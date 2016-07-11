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
			phoneStatus: 'Pending', 
			live: false
		};
	}
	componentDidMount() {
		var _this = this;
		let randomID = Math.floor(Math.random()*1000);
		this.setState({
			deviceID: randomID
		});

		// set the wetRTC info
		var phone = window.phone = PHONE({
			number: randomID, // listen on this line
			publish_key: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
			subscribe_key: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
			ssl: true
		});

		phone.ready(() => {
			// Ready To Call
			console.log('Phone ready.');
			this.setState({
				phoneStatus: 'Ready'
			});
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
			document.getElementById('streamWrap').innerHTML = '';
			console.log("Call end.");
		}
	}
	componentWillUnmount() {
		window.phone.hangup();
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
							The device ID is <span id="idWrap" >{this.state.deviceID}</span>.<br />
							Status: {this.state.phoneStatus}
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
