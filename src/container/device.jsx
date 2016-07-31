import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Alert from 'react-bootstrap/lib/Alert';

import '../../static/css/device.css';

export default class Device extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceID: '( Loading... )', 
			live: false
		};
	}
	componentDidMount() {
		var _this = this;

		// set WebRTC info
		window.connection = new RTCMultiConnection();
		connection.socketURL = 'http://src.imoncloud.com:38200/';
		connection.socketMessageEvent = 'audio-video-file-chat-demo';

		localStorage.webrtcExample = localStorage.webrtcExample || connection.token();
		this.setState({
			deviceID: localStorage.webrtcExample
		});

		connection.session = {
			audio: true,
			video: true,
			data: true
		};
		connection.sdpConstraints.mandatory = {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true
		};
		connection.videosContainer = document.getElementById('streamWrap');
		connection.maxParticipantsAllowed = 1;

		connection.onstream = function(event) {
			if(event.type != 'local') {
				console.log('connection onstream.');
				connection.videosContainer.appendChild(event.mediaElement);
				event.mediaElement.play();
				setTimeout(function() {
					event.mediaElement.play();
				}, 5000);
				_this.setState({
					live: true
				});
			}
		};
		connection.onopen = function() {
			console.log('connection opened.');
		}
		connection.onleave = connection.streamended = connection.onclose = function() {
			console.log('connection closed.');
			$('#streamWrap').empty();
			_this.setState({
				live: false
			});
		}
		connection.onEntireSessionClosed = function(event) {
			connection.attachStreams.forEach(function(stream) {
				stream.stop();
			});
			console.log('entire session closed.');
		};
		connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
			// seems room is already opened
			connection.join(useridAlreadyTaken);
		};

		// auto join
		connection.open(localStorage.webrtcExample);
		console.log(`auto join: ${localStorage.webrtcExample}`);
	}
	componentWillUnmount() {
		connection.close();
		this.setState({
			live: false
		});
	}
	render() {
		return (
			<Grid>
				<Row>
					<Col md={12}>
						<Alert id="alert-deviceID" bsStyle="info">
							Welcome!<br />
							The device ID is <span id="idWrap" >{this.state.deviceID}</span>.
						</Alert>
					</Col>
				</Row>
				<Row>
					<Col id="streamWrap" className={this.state.live ? 'live' : ''} md={12}></Col>
				</Row>
			</Grid>
		)
	}
}
