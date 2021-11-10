const ChatLogEntry = require('./ChatLogEntry');
const Message = require('../Message');
const StartGame = require('./StartGame');
const Database = require('../../Database/Database');
const GameSession = require('../../GameControl/Session');

const WaitStateInvoke = require('../ServerMessages/WaitStateInvoke');


class Handler {
    /**
     * The default constructor.
     */
    constructor() {
        this.database = new Database().getInstance();
    }
    /**
     * Handle the client request to join a game.
     * @param clientWebSocket The receiving web socket
     * @param stream The received data stream
     */
    startGame(clientWebSocket, stream) {
        var message = new StartGame();
        message.fromStream(stream);
        // Register websocket and wait for opponent player
        clientWebSocket.setPlayerProperties(message.getPlayerIdentifier(), message.getPlayerName());
        var clientWebSockets = this.database.getClientWebSockets();
        // Lookup for waiting play candidates
        for (var index = 0; (index < clientWebSockets.length); index++) {
            if (clientWebSocket === clientWebSockets[index]) {
                continue;
            }
            // Shall create new game session?
            if (clientWebSockets[index].isWaitingToJoinGameSession()) {
                var session = new GameSession(clientWebSocket, clientWebSockets[index]);
                session.startGame();
                // tc : game starts
                return;
            }
        }
        // No registered player opponent found
        var response = new WaitStateInvoke.WaitStateInvoke(Message.TextKey.WaitForPlayers, WaitStateInvoke.State.WaitingForPlayer);
        clientWebSocket.send(response.toStream());
    }
    /**
     * Forward the chat log message to either a specific client or broadcast to all connected clients.
     * @param clientWebSocket The receiving web socket
     * @param stream The received data stream
     */
    chatLogEntry(clientWebSocket, stream) {
        var message = new ChatLogEntry.ChatLogEntry();
        message.fromStream(stream);
        switch (message.getTransmissionMode()) {
            case ChatLogEntry.TransmissionMode.Unicast:
                this.unicastMessageTransmission(clientWebSocket, stream);
                break;
            default:
                this.broadcastMessageTransmission(clientWebSocket, stream);
        }
    }
    /**
     * Forward the chat log message to a specific client.
     * @param clientWebSocket The receiving web socket
     * @param stream The received data stream
     */
    unicastMessageTransmission(clientWebSocket, stream) {
        try {
            //SEND TO Session Player
            this.broadcastMessageTransmission(clientWebSocket,stream)
        }
        catch (e) {
            console.log("Catch: " + e.toString());
        }
    }
    /**
     * Forward the chat log message to all connected clients.
     * @param clientWebSocket The receiving web socket
     * @param stream The received data stream
     */
    broadcastMessageTransmission(clientWebSocket, stream)
    {
        try {
            var clientWebSockets = this.database.getClientWebSockets();
            for (var index = 0; (index < clientWebSockets.length); index++) {
                if (clientWebSocket === clientWebSockets[index]) {
                    continue;
                }
                clientWebSockets[index].send(stream);
            }
        }
        catch (e) {
            console.log("Catch: " + e.toString());
        }
    }
}

module.exports = Handler
