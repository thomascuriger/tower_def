/**
 * <h1>ObjectType</h1>
 * The enumeration defining the unique message identifier.
 */
const ObjectTypeConst = Object.freeze({
    Undefined: '0',
    StartGame: '1',
    ChatLogEntry: '2',
    WaitStateInvoke: '3'
});

window.ObjectType = ObjectTypeConst;

/**
 * <h1>TextKey</h1>
 * The enumeration defining the text keys for the text being visualized.
 */
const TextKeyConst =  Object.freeze({
    Undefined: '?',
    NewGame: '1',
    NextGameLevel: '2',
    WaitForPlayers: '3',
    ConnectionLost:	'4',
    GameAborted: '5',
    Exception: '6'
});

window.TextKey = TextKeyConst;
