import React from 'react';
import ReactDOM from 'react-dom'
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import '../../static/css/deviceCreator.css';

export default class DeviceCreator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpened: false
		}
		this.handleClick = this.handleClick.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	handleClick(e) {
		if(e.keyCode && e.keyCode != 13) {
			return;
		}
		var id = ReactDOM.findDOMNode(this.newDeviceID).value;
		var name = ReactDOM.findDOMNode(this.newDeviceName).value;
		if(id) {
			this.props.onAdd(id, name);
			ReactDOM.findDOMNode(this.newDeviceID).value = '';
			ReactDOM.findDOMNode(this.newDeviceName).value = '';
			this.closeModal();
		}
	}
	openModal() {
		this.setState({
			modalOpened: true
		});
	}
	closeModal() {
		this.setState({
			modalOpened: false
		});
	}
	render() {
		return (
			<span id="deviceCreator">
				<Glyphicon
					className="btn-newDevice"
					glyph="plus"
					onClick={this.openModal}
				/>
				<Modal id="modal-addDevice" show={this.state.modalOpened} onHide={this.closeModal}>
					<Modal.Header closeButton>
						<Modal.Title>新增聯絡人</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form horizontal>
							<FormGroup controlId="newID">
								<Col sm={3}>
									裝置 ID
								</Col>
								<Col sm={9}>
									<FormControl 
										type="text" 
										placeholder="裝置 ID" 
										ref={ref => this.newDeviceID = ref}
										onKeyDown={this.handleClick}
									/>
								</Col>
							</FormGroup>
							<FormGroup controlId="newName">
								<Col sm={3}>
									聯絡人名稱
								</Col>
								<Col sm={9}>
									<FormControl 
										type="text"
										placeholder="聯絡人名稱" 
										ref={ref => this.newDeviceName = ref}
										onKeyDown={this.handleClick}
									/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={12}>
									<Button className="btn-addDevice" bsStyle="primary" onClick={this.handleClick}>新增</Button>
								</Col>
							</FormGroup>
						</Form>
					</Modal.Body>
				</Modal>
			</span>
		);
	}
}
