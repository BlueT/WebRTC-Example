import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import '../../static/css/ring.css';

export default class Ring extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpened: false
		}
		this.closeModal = this.closeModal.bind(this);
		this.handleDecline = this.handleDecline.bind(this);
		this.handleAnswer = this.handleAnswer.bind(this);
	}
	componentDidMount() {
		// on called
		this.props.connection.onNewParticipant = (participantId, userPreferences) => {
			this.setState({
				modalOpened: true, 
				participantId, 
				userPreferences
			});
		};
	}
	closeModal() {
		this.setState({
			modalOpened: false
		});
	}
	handleDecline() {
		this.props.connection.disconnectWith(this.state.participantId);
		this.setState({
			modalOpened: false
		});
	}
	handleAnswer() {
		this.props.connection.acceptParticipationRequest(this.state.participantId, this.state.userPreferences);
		this.setState({
			modalOpened: false
		});
	}
	render() {
		var deviceID = this.state.participantId;
		this.props.deviceList[this.state.participantId] && (deviceID = this.props.deviceList[this.state.participantId].name);
		return (
			<Modal id="modal-ring" show={this.state.modalOpened} onHide={this.closeModal}>
				<Modal.Body>
					<Row style={{height: '100px', lineHeight: '100px', textAlign: 'center'}}>
						<Col sm={3}>
							<span className="btn-answer" onClick={this.handleAnswer}>
								<Glyphicon glyph="earphone"/>
							</span>
						</Col>
						<Col sm={6}>
							<span className="deviceID">{deviceID}</span>
						</Col>
						<Col sm={3}>
							<span className="btn-decline" onClick={this.handleDecline}>
								<Glyphicon glyph="phone-alt"/>
							</span>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		);
	}
}
