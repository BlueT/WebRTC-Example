import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import DeviceCreator from '../component/deviceCreator';
import DeviceList from '../component/deviceList';

import '../../static/css/device.css';

import hotkey from 'react-hotkey';
import hotkeyHandler from '../../static/js/hotkeyHandler'; 
hotkey.activate();

export default class Device extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceID: '( Loading... )', 
			live: false, 
			deviceList: {}
		};
		this.getDeviceList = this.getDeviceList.bind(this);
		this.handleAddDevice = this.handleAddDevice.bind(this);
		this.handleDelDevice = this.handleDelDevice.bind(this);
		this.handleHotkey = this.handleHotkey.bind(this);
	}
	componentDidMount() {
		var _this = this;

		// set WebRTC info
		window.connection = new RTCMultiConnection();
		connection.socketURL = 'http://src.imoncloud.com:38200/';
		connection.socketMessageEvent = 'audio-video-file-chat-demo';

		localStorage.ezCareDeviceID = localStorage.ezCareDeviceID || connection.token();
		this.getNumID(localStorage.ezCareDeviceID)
			.done((data) => {
				if(!data.P.err) {
					this.setState({
						deviceID: data.P.result.device_id
					}, this.getDeviceList);
					this.setWebRTC();
				}
			})
			.fail((jqXHR) => {
				console.log(jqXHR);
			});
		hotkey.addHandler(this.handleHotkey);
	}
	componentWillUnmount() {
		connection.close();
		this.setState({
			live: false
		});
		hotkey.removeHandler(this.handleHotkey);
	}
	getNumID(HW_id) {
		return $.ajax({
			url: 'http://src.imoncloud.com:38200/event/REGISTER_DEVICE', 
			type: 'post', 
			dataType: 'json', 
			data: {
				HW_id
			}
		});
	}
	setWebRTC() {
		let _this = this;
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
			console.info(event);
			console.log('connection onstream.');
			if(event.type == 'local') {
				$('#streamWrap-local').append(event.mediaElement);
			} else {
				connection.videosContainer.appendChild(event.mediaElement);
				_this.setState({
					live: true
				});
			}
			event.mediaElement.play();
			setTimeout(function() {
				event.mediaElement.play();
			}, 5000);
		};
		connection.onopen = function() {
			console.log('connection opened.');
		}
		connection.onleave = connection.streamended = connection.onclose = function(e) {
			console.log(e);
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
		connection.open(this.state.deviceID);
		console.log(`auto join: ${this.state.deviceID}`);
	}
	getDeviceList() {
		$.ajax({
			url: 'http://src.imoncloud.com:38200/event/GET_DEVICES', 
			type: 'get', 
			dataType: 'json', 
			data: {
				account: this.state.deviceID
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
	}
	handleAddDevice(device_id, device_name) {
		let account = this.state.deviceID;
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
	handleDelDevice(device_id, device_name) {
		if(confirm(`確定移除 ${device_name}(${device_id}) ?`)) {
			$.ajax({
				url: 'http://src.imoncloud.com:38200/event/REMOVE_DEVICES', 
				type: 'get', 
				dataType: 'json', 
				data: {
					account: this.state.deviceID, 
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
	handleHangup() {
		connection.close();
	}
	handleHotkey(e) {
		const eventMap = {
			107: hotkeyHandler.toAddNewContact.bind(this), // +
		}
		eventMap[e.keyCode] && eventMap[e.keyCode]();
	}
	render() {
		return (
			<Grid>
				<Row>
					<Col md={6}>
						<Jumbotron id="alert-deviceID">
							<span style={{fontSize: '25px'}}>歡迎使用 </span>
							<b style={{fontSize: '35px'}}>ezCare</b><br />
							<span style={{fontSize: '25px'}}>您的裝置編號為</span><br />
							<span id="idWrap" >{this.state.deviceID}</span>
						</Jumbotron>
					</Col>
					<Col md={6}>
						<PageHeader>通訊錄 <DeviceCreator onAdd={this.handleAddDevice} /></PageHeader>
						<DeviceList list={this.state.deviceList.list} name={this.state.deviceList.name} onDel={this.handleDelDevice} />
					</Col>
				</Row>
				<Row>
					<Col id="streamWrap" className={this.state.live ? 'live' : ''} md={12}></Col>
					<Col id="streamWrap-local" className={this.state.live ? 'live' : ''} md={12}></Col>
					<div id="hangup" onClick={this.handleHangup}>
						<Glyphicon 
							className="btn-hangup" 
							glyph="phone-alt"
						/>
					</div>
				</Row>
			</Grid>
		)
	}
}
