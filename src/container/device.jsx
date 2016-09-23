import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import AlertContainer from 'react-alert';

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
		this.callTo = this.callTo.bind(this);
		this.whoToCall = this.whoToCall.bind(this);

		this.alertOptions = {
			position: 'bottom right',
			theme: 'dark',
			time: 3000,
			transition: 'scale'
		};
	}
	componentDidMount() {
		var _this = this;

		// set WebRTC info
		window.connection = new RTCMultiConnection();
		connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
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
			url: 'https://ezcare.info:38201/event/REGISTER_DEVICE', 
			type: 'post', 
			dataType: 'json', 
			data: {
				HW_id
			}
		});
	}
	setWebRTC() {
		let _this = this;
		connection.mediaConstraints = {
			video: {
			    mandatory: {
			        maxWidth: 120,
			        maxHeight: 80
			    },
			    optional: []
			}
		};
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
			url: 'https://ezcare.info:38201/event/GET_DEVICES', 
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
		if($('.deviceItem').size() >= 9) {
			this.msg.show('聯絡人數量已達上限', {
				time: 3000,
				type: 'info'
			});
			return;
		}
		let account = this.state.deviceID;
		$.ajax({
			url: 'https://ezcare.info:38201/event/ADD_DEVICE', 
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
				url: 'https://ezcare.info:38201/event/REMOVE_DEVICE', 
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
	callTo(number) {
		console.log(`calling ${number}`);
		if(!(/^[0-9]*$/).test(number)) { // remote
			$.ajax({
				url: 'https://ezcare.info:38201/event/GET_CALLLIST', 
				type: 'get', 
				dataType: 'json', 
				data: {
					id: number
				}, 
				success: (data) => {
					if(!data.P.err) {
						this.whoToCall([{target: number}, ...data.P.result]);
					}
				}, 
				error: (jqXHR) => {
					console.log(jqXHR);
				}
			});
		} else {
			connection.checkPresence(number, (exist, id) => {
				if(exist) {
					connection.join(id);
				} else {
					this.msg.show(`${id} 不在線上`, {
						time: 3000,
						type: 'info'
					});
					console.log(id+' no exist');
				}
			});
		}
	}
	whoToCall(list, order = 0) {
		if(list[order]) {
			connection.checkPresence(list[order].target, (exist, id) => {
				if(exist) {
					connection.join(id);
					console.log(`join the order ${order}, and the id is ${id}`);
				} else {
					this.whoToCall(list, +order+1);
					this.msg.show(`${id} 不在線上`, {
						time: 3000,
						type: 'info'
					});
					console.log(id+' no exist');
				}
			});
		}
	}
	handleHotkey(e) {
		const eventMap = {
			107: hotkeyHandler.toAddNewContact.bind(this), // +
			97: hotkeyHandler.select.bind(this, 0), // 1
			98: hotkeyHandler.select.bind(this, 1), // 2
			99: hotkeyHandler.select.bind(this, 2), // 3
			100: hotkeyHandler.select.bind(this, 3), // 4
			101: hotkeyHandler.select.bind(this, 4), // 5
			102: hotkeyHandler.select.bind(this, 5), // 6
			103: hotkeyHandler.select.bind(this, 6), // 7
			104: hotkeyHandler.select.bind(this, 7), // 8
			105: hotkeyHandler.select.bind(this, 8), // 9
			110: hotkeyHandler.del.bind(this), // Del
			106: hotkeyHandler.urgentCall.bind(this, this.state.deviceID), // *
			13: hotkeyHandler.call.bind(this) // Enter
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
						<DeviceList  
							devices={this.state.deviceList}
							mode="device"
							onDel={this.handleDelDevice}
							onCall={this.callTo}
						/>
						<AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
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
