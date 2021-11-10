
var websocketGame = {
	socket : {},
	playerID : "",
	activePlayerID : "",
	quit : false
}


// init script when the DOM is ready.
$(function() {
	connect();
	validatePlayerName();
	startGame();
	handleChatText();
});
/**
 * Validate length (min. 3, max. 10 chars) of playername
 */
function validatePlayerName() {
	$("#input-playername").keyup(function(e) {
	});
}

function waitStateInvoke(socket, data) {
	console.log("Wait State");
}

/**
 * Manage the websocket connection and react to the different messages
 */
function connect() {
	try {
		//websocket is supported by browser
		if (window["WebSocket"]) {
			//create connection
			websocketGame.socket = new WebSocket("ws://localhost:8000");

			//on open event
			websocketGame.socket.onopen = function (e) {
				console.log("[OPEN] Connection established");
				websocketGame.playerID = "1" + Math.floor(Math.random() * 1000000000);
			};

			//on message event
			websocketGame.socket.onmessage = function (event) {
				console.log("[MESSAGE] Data received from server: " + event.data);

				try {
					let data = JSON.parse(event.data);

					switch (data.objecttype) {
						case window.ObjectType.ChatLogEntry:
							chatLogEntry(this, event.data);
							break;
						case window.ObjectType.WaitStateInvoke:
							waitStateInvoke(this, event.data);
							break;
						default:
							console.log("[MESSAGE.WARNING] Client doesn't expect this message: " + data);
							break;
					}
				}
				catch(e) {
					console.log("[MESSAGE.ERROR] Catch: " + e.toString() + "data: " + event.data);
				}
			};

			//on error event
			websocketGame.socket.onerror = function(error) {
				console.log(`[ERROR] ${error.message}`);
			};

			//on close event
			websocketGame.socket.onclose = function (event) {
				// https://javascript.info/websocket
				if(!websocketGame.quit) {
					console.log(`[CLOSED] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
				}
			};
		}
	}
	catch(exception) {
		console.log("[ERROR] An error occurred: " + exception);
	}
}
/**
 * Submit playername of signin form to server to start a game.
 */
function startGame() {
	$("#form-signin").submit(function(e) {
		console.log("[INFORMATION] start game");

		//alert to avoid that player waits without open socket connection for another player
		//e.g. if server is not running, there's an alert before
		//but we don't deactivate the whole site
		if(websocketGame.socket.readyState != 1) {
			console.log("[ERROR] Socket connection is not open.");
			alert(lang.ALERT_CONNECTIONLOST);
		}
		else {
			let playerName = this.playername.value;
			e.preventDefault(); //prevent page reload
			bindPreventPageReload();
			let playerIdentifier = websocketGame.playerID;
			const message = new window.StartGame(playerIdentifier, playerName);
			websocketGame.socket.send(message.toStream());
			$("#div_Lobby").addClass("d-none");
			$("#div_Game").removeClass("d-none");
		}
	});
}
/**
 * Binds chat field to click and return event
 * for sending text to server
 */
function handleChatText() {
	$("#btn-chat").on("click", sendChatText);

	$("#input-chat").on("keyup", function(e) {
		if(e.key === "Enter" && e.shiftKey === false) {
			sendChatText();
		}
	});
}

/**
 * Send text of chat input to websocket server
 * and clear the field
 */
function sendChatText() {
	let input = $("#input-chat").val();
	console.log("[SEND] chat text: " + input);

	let message = new window.ChatLogEntry(window.TransmissionMode.Unicast, input);
	websocketGame.socket.send(message.toStream());

	$("#input-chat").val("");
	addChatText(input, false);
}
/**
 * Add sent chat text to chatbox, that means create a div-element for a card
 * https://stackoverflow.com/questions/40520564/create-divs-with-different-classes-and-append-jquery-dynamically
 * https://stackoverflow.com/questions/40903462/how-to-keep-a-scrollbar-always-bottom
 */
function addChatText(message, received) {
	let divcard = $("<div/>", {
		"class" : "chatcard"
	});
	let divcardbody = $("<div/>", {
		"class" : "chatcard-body"
	});
	let text = $("<p/>");
	text.text(message);
	//if message is received put it left otherwise right
	if (received == true) {
		text.addClass("chatcard-text float-left");
	}
	else {
		text.addClass("chatcard-text float-right");
	}
	divcard.append(divcardbody);
	divcardbody.append(text);
	$("#chatEntries").append(divcard);
	//keep scrollbar at bottom
	var chatBody = document.querySelector('#chatEntries');
	chatBody.scrollTop = chatBody.scrollHeight - chatBody.clientHeight;
}
/**
 * Handle chat message from server (if received ChatLogEntry)
 * @param clientWebSocket
 * @param stream
 */
function chatLogEntry(clientWebSocket, stream) {
	let message = new window.ChatLogEntry(stream.transmissionMode,stream.text);
	message.fromStream(stream);
	if(message.getTransmissionMode() == window.TransmissionMode.Unicast) {
		addChatText(message.text, true);
	}
	else if (message.getTransmissionMode() == window.TransmissionMode.Broadcast) {
		alert(message.text);
	}
}

/**
 * Bind event to prevent page reload
 */
function bindPreventPageReload() {
	window.addEventListener("beforeunload", preventPageReload);
}
/**
 * Show standard message if user wants to reload browser page
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
 * @param e
 */
function preventPageReload(e) {
	// Cancel the event
	e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
	// Chrome requires returnValue to be set
	e.returnValue = '';
}
