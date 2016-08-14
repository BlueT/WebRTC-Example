import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import PageHeader from 'react-bootstrap/lib/PageHeader';

import DeviceCreator from '../component/deviceCreator';
import DeviceList from '../component/deviceList';

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: window.account || null, 
			deviceList: {}, 
			live: false
		}
		this.getDeviceList = this.getDeviceList.bind(this);
		this.handleAddDevice = this.handleAddDevice.bind(this);
		this.handleDelDevice = this.handleDelDevice.bind(this);
		this.handleHangup = this.handleHangup.bind(this);
	}
	componentDidMount() {
		this.getDeviceList();

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
	}
	getDeviceList() {
		$.ajax({
			url: 'http://src.imoncloud.com:38200/event/GET_DEVICES', 
			type: 'get', 
			dataType: 'json', 
			data: {
				account: this.state.account
			}, 
			success: (data) => {
				console.log(data);
				if(!data.P.err) {
					this.setState({
						deviceList: data.P.result.devices
					});
				}
			}
		});
		return true;
	}
	handleDelDevice(device_id, device_name) {
		if(confirm(`確定移除 ${device_name}(${device_id}) ?`)) {
			$.ajax({
				url: 'http://src.imoncloud.com:38200/event/REMOVE_DEVICES', 
				type: 'get', 
				dataType: 'json', 
				data: {
					account: this.state.account, 
					device_id
				}, 
				success: (data) => {
					console.log(data);
					if(!data.P.err) {
						this.getDeviceList();
					}
				}
			});
		}
	}
	handleAddDevice(device_id, device_name) {
		let account = this.state.account;
		$.ajax({
			url: 'http://src.imoncloud.com:38200/event/ADD_DEVICES', 
			type: 'post', 
			dataType: 'json', 
			data: {
				account, 
				device_id, 
				device_name
			}, 
			success: (data) => {
				console.log(data);
				if(!data.P.err) {
					this.getDeviceList();
				}
			}, 
			error: function(jqXHR) {
				console.log(jqXHR);
			}
		})
	}
	handleHangup() {
		connection.close();
	}
	render() {
		return (
			<div>
				<Row>
					<Col 
						id="listWrap" 
						md={8} 
						mdOffset={2}
					>
						<PageHeader>通訊錄 <DeviceCreator onAdd={this.handleAddDevice} /></PageHeader>
						<DeviceList list={this.state.deviceList.list} name={this.state.deviceList.name} onDel={this.handleDelDevice} />
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
