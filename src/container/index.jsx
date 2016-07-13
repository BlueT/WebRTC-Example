import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import DeviceCreator from '../component/deviceCreator';

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceList: []
		}
		this.getDeviceList = this.getDeviceList.bind(this);
		this.handleAddDevice = this.handleAddDevice.bind(this);
	}
	componentDidMount() {
		this.getDeviceList();
	}
	getDeviceList() {
		let user = localStorage.webrtcExampleUser;
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
	}
	handleAddDevice(deviceID) {
		alert(deviceID);
	}
	render() {
		return (
			<Row>
				<Col md={6} mdOffset={3}>
					<DeviceCreator onAdd={this.handleAddDevice} />
				</Col>
			</Row>
		)
	}
}
