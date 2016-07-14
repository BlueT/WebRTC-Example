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
	}
	componentDidMount() {
		if(!this.getDeviceList()) {
			return;
		}

		var _this = this;
		var phone = window.phone = PHONE({
			number: localStorage.webrtcExampleUser, // listen on this line
			publish_key: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
			subscribe_key: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
			ssl: true
		});

		phone.ready(() => {
			// Ready To Call
			console.log('Phone ready.');
		});

		phone.receive(function(session){
			session.connected(connected);
			session.ended(ended);
		});

		function connected(session) {
			_this.setState({
				live: true
			});
			document.getElementById('streamWrap').innerHTML = '';
			document.getElementById('streamWrap').appendChild(session.video);
			console.log(`Call from ${session.number}`);
			console.log(session);
		}

		function ended(session) {
			_this.setState({
				live: false
			});
			document.getElementById('streamWrap').innerHTML = '';
			console.log("Call end.");
		}
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
	render() {
		return (
			<div>
				<Row>
					<Col md={6} mdOffset={3}>
						<DeviceCreator onAdd={this.handleAddDevice} />
					</Col>
				</Row>
				<Row>
					<Col md={6} mdOffset={3}>
						<DeviceList list={this.state.deviceList} />
					</Col>
				</Row>
				<Row>
					<Col id="streamWrap" className={this.state.live ? 'live' : ''} md={8} mdOffset={2}></Col>
					<div id="hangup">
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
