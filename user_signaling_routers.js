import { msgTypes } from "./utilities/signaling_msg_types.js";
import { Connections } from "./utilities/signaling_connetions.js";

export function onMessageSignaling(ws, data, isBinary) {
  try {
    const msg = JSON.parse(convertDataToString(data));
    const userConnection = Connections.getConnection(msg.username);
    const targetConnection = Connections.getConnection(msg.target);

    switch (msg.type) {
      case msgTypes.signIn:
        Connections.addConnection(msg.username, ws);
        break;
      case msgTypes.handshake:
        handleReceiveMessage(
          userConnection,
          targetConnection,
          JSON.stringify({
            type: msgTypes.handshake,
            username: msg.username,
            target: msg.target,
          })
        );
        break;
      case msgTypes.call:
        handleReceiveMessage(
          userConnection,
          targetConnection,
          JSON.stringify({
            type: msgTypes.call,
            username: msg.username,
            target: msg.target,
            data: msg.data,
          })
        );
        break;
      case msgTypes.answer:
        handleReceiveMessage(
          userConnection,
          targetConnection,
          JSON.stringify({
            type: msgTypes.answer,
            username: msg.username,
            target: msg.target,
            data: msg.data,
          })
        );
        break;
      case msgTypes.ice:
        handleReceiveMessage(
          userConnection,
          targetConnection,
          JSON.stringify({
            type: msgTypes.ice,
            username: msg.username,
            target: msg.target,
            data: msg.data,
          })
        );
        break;
      case msgTypes.signOut:
        handleReceiveMessage(
          userConnection,
          targetConnection,
          JSON.stringify({
            type: msgTypes.signOut,
            username: msg.username,
            target: msg.target,
            data: msg.data,
          })
        );
        break;
      case msgTypes.failed:
        handleReceiveMessage(
          userConnection,
          targetConnection,
          JSON.stringify({
            type: msgTypes.failed,
            username: msg.username,
            target: msg.target,
            data: msg.data,
          })
        );
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

export function onCloseSignaling(ws, code, data) {
  const reason = convertDataToString(data);
  Connections.removeConnectionByWebsocket(ws).then((username) => {
    console.log(
      `${username}  disconnected and its connection removed from the connections list. CODE: ${code}, REASON: ${reason}`
    );
  });
}

function handleReceiveMessage(userConnection, targetConnection, message) {
  if (userConnection) {
    if (targetConnection) targetConnection.send(message);
    else {
      userConnection.send(
        JSON.stringify({
          type: msgTypes.failed,
          username: message.username,
          target: message.target,
          data: JSON.stringify({
            code: 4004,
            reason: "هدف مورد نظر یافت نشد.",
          }),
        })
      );
    }
  } else failedAuthorization(ws, 4002, "ابتدا وارد شوید.");
}

function failedAuthorization(ws, code, reason) {
  const msg = { code, reason };
  ws.send(JSON.stringify(msg));
  ws.terminate();
}

function convertDataToString(data) {
  const msg = Buffer.from(data);
  return new TextDecoder("utf-8").decode(msg);
}
