const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    let codigoPedido = false

    sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update

        if (connection === "open") {
            console.log("✅ Conectado a WhatsApp")
        }

        if (connection === "close") {
            console.log("❌ Conexión cerrada")
        }

        // 🔥 PEDIR CÓDIGO SOLO UNA VEZ Y CUANDO ESTÉ LISTO
        if (!codigoPedido && !sock.authState.creds.registered) {
            codigoPedido = true

            const numero = "5493888457648"

            setTimeout(async () => {
                try {
                    const code = await sock.requestPairingCode(numero)
                    console.log("🔥 TU CODIGO ES:", code)
                } catch (err) {
                    console.log("❌ Error al pedir código:", err)
                }
            }, 5000) // ⏳ espera 5 segundos
        }
    })
}

startBot()
