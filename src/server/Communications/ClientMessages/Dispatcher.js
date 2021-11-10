const Handler = require('./Handler');
const Message = require('../Message');

/**
 * <h1>Dispatcher</h1>
 * This class is responsible to deserialize the communication stream to a message and dispatch the message to a distinct handler for further processing.
 */
class Dispatcher {
    /**
     * The default constructor.
     */
    constructor() {
        this.handler = new Handler();
        this.message = new Message.Message();
    }

    /**
     * Dispatch the received message to the distinct receiver.
     * @param clientWebSocket The receiving web socket
     * @param stream The received data stream
     */
    dispatch(clientWebSocket, stream) {
        try {
            this.message.fromStream(stream);
            switch (this.message.getObjectType()) {
                case Message.ObjectType.ChatLogEntry:
                    this.handler.chatLogEntry(clientWebSocket, stream);
                    break;
                case Message.ObjectType.StartGame:
                    this.handler.startGame(clientWebSocket, stream);
                    break;
                default:
                    break;
            }
        }
        catch (exception) {
        }
    }
}

module.exports = Dispatcher
