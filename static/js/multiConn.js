// ......................................................
// .......................UI Code........................
// ......................................................

document.getElementById('open-room').onclick = function() {
	this.disabled = true;
	connection.open(document.getElementById('room-id').value);
};

document.getElementById('join-room').onclick = function() {
	this.disabled = true;
	connection.join(document.getElementById('room-id').value);
};

document.getElementById('open-or-join-room').onclick = function() {
	this.disabled = true;
	connection.openOrJoin(document.getElementById('room-id').value);
};

var chatContainer = document.querySelector('.chat-output');

function appendDIV(event) {
	var div = document.createElement('div');
	div.innerHTML = event.data || event;
	chatContainer.insertBefore(div, chatContainer.firstChild);
	div.tabIndex = 0;
	div.focus();

	document.getElementById('input-text-chat').focus();
}

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = 'http://src.imoncloud.com:38200/';

// comment-out below line if you do not have your own socket.io server
// connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.socketMessageEvent = 'audio-video-file-chat-demo';

var roomid = '';
if(localStorage.getItem('rmc-room-id')) {
	roomid = localStorage.getItem('rmc-room-id');
} else {
	roomid = connection.token();
}
document.getElementById('room-id').value = roomid;
document.getElementById('room-id').onkeyup = function() {
	localStorage.setItem('rmc-room-id', this.value);
};

connection.enableFileSharing = true; // by default, it is "false".

connection.session = {
	audio: true,
	video: true,
	data: true
};

connection.sdpConstraints.mandatory = {
	OfferToReceiveAudio: true,
	OfferToReceiveVideo: true
};

connection.videosContainer = document.getElementById('videos-container');
connection.onstream = function(event) {
	connection.videosContainer.appendChild(event.mediaElement);
	event.mediaElement.play();
	setTimeout(function() {
		event.mediaElement.play();
	}, 5000);
};

connection.onmessage = appendDIV;
connection.filesContainer = document.getElementById('file-container');

connection.onopen = function() {
	console.log("connection.onopen");

	document.querySelector('h1').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
};

connection.onclose = function() {
	if(connection.getAllParticipants().length) {
		document.querySelector('h1').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
	} else {
		document.querySelector('h1').innerHTML = 'Seems session has been closed or all participants left.';
	}
};

connection.onEntireSessionClosed = function(event) {
	document.getElementById('share-file').disabled = true;
	document.getElementById('input-text-chat').disabled = true;
	document.getElementById('btn-leave-room').disabled = true;

	document.getElementById('open-or-join-room').disabled = false;
	document.getElementById('open-room').disabled = false;
	document.getElementById('join-room').disabled = false;
	document.getElementById('room-id').disabled = false;

	connection.attachStreams.forEach(function(stream) {
		stream.stop();
	});

	// don't display alert for moderator
	if(connection.userid === event.userid) return;
	document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
};

connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
	// seems room is already opened
	connection.join(useridAlreadyTaken);
};

// exports.connection = connection;