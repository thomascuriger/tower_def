const Serializer = require('../FileSystem/Serializer');
const Mutex = require('async-mutex').Mutex;

class Database {
    /**
     * The default constructor.
     */
    constructor() {
        this.clientWebSockets = [];
        this.mutex = new Mutex();
    }
    /**
     * Get the client web socket.
     * @return The client web socket.
     */
    getClientWebSockets() {
        return this.clientWebSockets;
    }

    /**
     * Add a client web socket to the web sockets container.
     * @param The client web socket.
     */
    async addClientWebSockets(clientWebSocket) {
        const release = await this.mutex.acquire();
        try {
            this.clientWebSockets.push(clientWebSocket);
            console.log("Number of sockets = " + this.clientWebSockets.length);
        }
        catch (exception) {
        }
        finally {
            release();
        }
    }

    /**
     * Remove a client web socket from the web sockets container.
     * @param The client web socket.
     */
    async removeClientWebSockets(clientWebSocket) {
        const release = await this.mutex.acquire();
        try {
            for (var index = 0; index < this.clientWebSockets.length; index++) {
                if (clientWebSocket === this.clientWebSockets[index]) {
                    this.clientWebSockets.splice(index, 1);
                    console.log("Number of sockets = " + this.clientWebSockets.length);
                    break;
                }
            }
        }
        catch (exception) {
        }
        finally {
            release();
        }
    }

    /**
     * Lookup the container for an unpaired client web socket.
     * @param The client web socket.
     */
    lookupUnpairedPlayer(clientWebSocket) {
        for (var index = 0; index < this.clientWebSockets.length; index++) {
            if (clientWebSocket === this.clientWebSockets[index]) {
                continue;
            }
            if (null == this.clientWebSockets[index].getPlayer()) {
                return this.clientWebSockets[index];
            }
        }
        return null;
    }

    /**
     * Get the messenger scan interval time.
     * @return The interval in milliseconds.
     */
    getMessengerIntervalTime() {
        return 5000;
    }

    /**
     * Get the repository where the messenger messages are persistently stored.
     * @return The repository.
     */
    getMessengerRepository() {
        return process.cwd() + "/Repositories/Messenger/";
    }

    /**
     * Get the singleton instance.
     * @return The singleton instance.
     */
    readMessengerMessages()
    {
        var serializer = new Serializer(this.getMessengerRepository());
        var files = serializer.readDirectory();
        // Read the files content and delete the file
        var messages = [];
        for (var index = 0; (index < files.length); index++)
        {
            //ignore .gitignore file
            if(files[index] == ".gitignore") {
                continue;
            }
            serializer = new Serializer(this.getMessengerRepository() + files[index]);
            var message = {};
            message.text = serializer.read();
            messages.push(message);
            serializer.delete();
        }
        return messages;
    }

    /**
     * Get the game groups tree.
     * @return The game groups tree.
     */
    getGroupsTree() {
        return this.groups;
    }

    /**
     * Get the sub-groups combinations.
     * @return The sub-grup combinations.
     */
    getSubGroupCombinations() {
        return this.subGroups;
    }
}

/**
 * <h1>Singleton</h1>
 * The implementation of the singleton pattern.
 */
class Singleton {
    /**
     * The default constructor.
     */
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new Database();
        }
    }

    /**
     * Get the singleton instance.
     * @return The singleton instance.
     */
    getInstance() {
        return Singleton.instance;
    }
}

module.exports = Singleton
