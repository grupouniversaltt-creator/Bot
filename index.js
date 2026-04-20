import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update

    if (connection === "open") {
      console.log("✅ BOT CONECTADO")
    }

    if (connection === "close") {
      console.log("❌ DESCONECTADO")
    }
  })

  // 🔥 CÓDIGO DE VINCULACIÓN
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(5493888457648)
    console.log("📱CÓDIGO:", code)
  }
}

startBot()
