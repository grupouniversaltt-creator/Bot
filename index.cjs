const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { connection } = update

        if (connection === "open") {
            console.log("✅ Conectado a WhatsApp")
        }

        if (connection === "close") {
            console.log("❌ Conexión cerrada")
        }

        // 👇 ACA pedimos el código correctamente
        if (!sock.authState.creds.registered) {
            const numero = "5493888457648"

            try {
                const code = await sock.requestPairingCode(numero)
                console.log("🔥 TU CODIGO ES:", code)
            } catch (err) {
                console.log("❌ Error al pedir código:", err)
            }
        }
    })
}

startBot()
