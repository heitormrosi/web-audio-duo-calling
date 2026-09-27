# Chamada de áudio dupla pela web

Uma aplicação web simples para chamadas de áudio via web entre dois usuários apenas.

Utiliza a ["Media Capture and Streams API"][MediaStreamAPI], que é uma API nativa do navegador para lidar com dispositivos de mídia
do usuário, para pegar o áudio.

A conexão entre os clientes é feita utilizando [WebRTC ("Web Real-Time Communication")][WebRTCAPI]

Para realizar a conexão com WebRTC entre os clientes, utiliza websockets através da [biblioteca SocketIO][SocketIO].

Como backend, utiliza o Express no NodeJS.

Como o objetivo é ver o WebRTC na raça por padrão, não vou utilizar o PeerJS.

Como o recurso de WebRTC requer segurança, só funciona no localhost ou se colocar o IP 
na opção "chrome://flags/#unsafely-treat-insecure-origin-as-secure".

Caso necessite de funcionamento, só precisa de um certificado SSL.

## Lista de tarefas
- [X] Pegar o áudio do dispositivo com Media Stream API
- [X] Troca de mensagens offer-answer por meio de SocketIO
- [X] Conectar a um cliente remoto utilizando WebRTC

[MediaStreamAPI]: <https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API>
[WebRTCAPI]: <https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API>
[SocketIO]: <https://socket.io/pt-br/>