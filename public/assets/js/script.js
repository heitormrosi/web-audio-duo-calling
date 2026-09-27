/**
 * Definições iniciais
 */

// Para adicionar o áudio do cliente remoto à página
const backgroundElement = document.getElementById("Background");

// Iniciar o SocketIO
const socket = io();

/**
 * Funções
 */

// Pega o áudio do cliente local
async function getUserAudio() {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
}

// Cria uma conexão WebRTC a um servidor STUN público da Google
function createPeerConnection() {
    return new RTCPeerConnection({
        iceServers: [{
            urls: "stun:stun.l.google.com"
        }]
    });
}


/**
 * Rotina principal
 */

async function main() {
    // Cria uma conexão WebRTC a um servidor STUN público da Google
    const pc = createPeerConnection();

    // Pega o áudio do cliente local
    const mediaStream = await getUserAudio();

    // Adiciona o áudio à conexão WebRTC
    for (const track of mediaStream.getTracks()) {
        pc.addTrack(track, mediaStream);
    }

    // Lida quando o cliente remoto se conecta
    pc.ontrack = ({ track, streams }) => {
        track.onunmute = () => {
            const audio = new Audio();

            audio.srcObject = streams[0];

            audio.volume = 1;

            backgroundElement.appendChild(audio);

            audio.play();
        };
    };

    // Criar oferta na conexão WebRTC
    let makingOffer = false;

    pc.onnegotiationneeded = async () => {
        makingOffer = false;

        await pc.setLocalDescription();

        socket.emit("localDescription", JSON.stringify({
            description: pc.localDescription
        }));

        makingOffer = false;
    };

    // Lida com o candidato ICE
    pc.onicecandidate = ({ candidate }) => {
        socket.emit("iceCandidate", JSON.stringify({
            iceCandidate: candidate
        }));
    };

    // Lida com a conexão em si
    let ignoreOffer = false;
    let isSettingRemoteAnswerPending = false;

    socket.on("localDescription", async msg => {
        const description = JSON.parse(msg).description;

        const polite = true;

        const readyForOffer =
            !makingOffer &&
            (pc.signalingState === "stable" || isSettingRemoteAnswerPending);

        const offerCollision = description.type === "offer" && !readyForOffer;

        ignoreOffer = !polite && offerCollision;

        if (ignoreOffer) {
            return;
        }

        isSettingRemoteAnswerPending = description.type === "answer";

        await pc.setRemoteDescription(description);

        isSettingRemoteAnswerPending = false;

        if (description.type === "offer") {
            await pc.setLocalDescription();
            socket.emit("localDescription", JSON.stringify({ description: pc.localDescription }));
        }
    });

    socket.on("iceCandidate", async msg => {
        const candidate = JSON.parse(msg).iceCandidate;

        await pc.addIceCandidate(candidate);
    });

}


/**
 * Ponto de partida
 */

main();

