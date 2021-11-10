var FileSystem = require('fs');

/**
 * <h1>DateTime</h1>
 * A helper class for serializing/deserializing the data to/from a persistent medium.
 */
class Serializer {
    /**
     * The specialized constructor.
     * @param container The container (file/directory) name on the persistent medium where the data is serialized to/from
     */
    constructor(containerName) {
        this.containerName = containerName;
    }

    /**
     * Write a stream as file to the persistent medium.
     * @param stream The stream to be written.
     */
    write(stream) {
        FileSystem.writeFile(this.containerName, stream, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }

    /**
     * Append a stream to an existing file on the persistent medium.
     * @param stream The stream to be appended.
     */
    writeAppend(stream) {
        FileSystem.appendFile(this.containerName, stream, (err) => {
        });
    }

    /**
     * Read a stream from an existing file on the persistent medium.
     * @return stream The stream read from the file.
     */
    read() {
        try {
            return FileSystem.readFileSync(this.containerName, 'utf8');
        } catch (err) {
        }
    }

    /**
     * Read the file structure on an directory on a persistent medium.
     * @return The directory file structure.
     */
    readDirectory() {
        return FileSystem.readdirSync(this.containerName);
    }

    /**
     * Delete existing file on the persistent medium.
     */
    delete() {
        try {
            FileSystem.unlinkSync(this.containerName);
        } catch (err) {
        }
    }
}

module.exports = Serializer
