import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import DeviceCreator from '../component/deviceCreator';
import DeviceList from '../component/deviceList';

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceList: [], 
			live: false
		}
		this.getDeviceList = this.getDeviceList.bind(this);
		this.handleAddDevice = this.handleAddDevice.bind(this);
		this.handleHangup = this.handleHangup.bind(this);
	}
	componentDidMount() {
		if(!this.getDeviceList()) {
			return;
		}

		var _this = this;

		// set webrtc 
		window.connection = new RTCMultiConnection();
		connection.socketURL = 'http://src.imoncloud.com:38200/';
		connection.socketMessageEvent = 'audio-video-file-chat-demo';

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
		connection.onclose = function() {
			console.log('connection closed.');
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
	}
	getDeviceList() {
		let user = localStorage.webrtcExampleUser;
		if(!user) {
			return false;
		}
		let deviceList; 
		if(localStorage.webrtcExampleDeviceList) {
			if(JSON.parse(localStorage.webrtcExampleDeviceList)[user]) {
				deviceList = JSON.parse(localStorage.webrtcExampleDeviceList)[user];
			} else {
				deviceList = [];
				localStorage.webrtcExampleDeviceList = JSON.stringify(Object.assign(JSON.parse(localStorage.webrtcExampleDeviceList), {[user]: []}));
			}
		} else {
			deviceList = [];
			localStorage.webrtcExampleDeviceList = JSON.stringify({[user]: []});
		}
		this.setState({
			deviceList
		});
		return true;
	}
	handleAddDevice(deviceID) {
		let user = localStorage.webrtcExampleUser;
		let deviceList = [...JSON.parse(localStorage.webrtcExampleDeviceList)[user], deviceID]
		localStorage.webrtcExampleDeviceList = JSON.stringify(Object.assign(JSON.parse(localStorage.webrtcExampleDeviceList), {[user]: deviceList}));
		this.getDeviceList();
	}
	handleHangup() {
		connection.close();
	}
	render() {
		return (
			<div>
				<Row>
					<Col md={6} mdOffset={3}>
						<DeviceCreator onAdd={this.handleAddDevice} />
					</Col>
				</Row>
				<Row>
					<Col 
						id="listWrap" 
						md={6} 
						mdOffset={3}
						style={{maxHeight: '600px', overflow: 'auto'}}
					>
						<DeviceList list={this.state.deviceList} />
					</Col>
				</Row>
				<Row>
					<Col id="streamWrap" className={this.state.live ? 'live' : ''} md={8} mdOffset={2}></Col>
					<div id="hangup" onClick={this.handleHangup}>
						<Glyphicon 
							className="btn-hangup" 
							glyph="phone-alt"
						/>
					</div>
				</Row>
			</div>
		)
	}
}
