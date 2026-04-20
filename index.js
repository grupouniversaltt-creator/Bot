const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    if (!sock.authState.creds.registered) {
        const numero = "5493888457648"

        const code = await sock.requestPairingCode(numero)
        console.log("🔥 TU CODIGO ES:", code)
    }
}

startBot()

