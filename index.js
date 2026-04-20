import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      console.log("❌ Conexión cerrada")

      // 🔥 REINTENTO AUTOMÁTICO
      startBot()
    }

    if (connection === "open") {
      console.log("✅ BOT CONECTADO")
    }
  })

  // 🔥 GENERAR CÓDIGO SI NO ESTÁ REGISTRADO
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode("5493888457648")
    console.log("📱 CÓDIGO:", code)
  }
}

startBot()

