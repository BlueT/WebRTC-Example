import React from 'react';
import ReactDOM from 'react-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';

export default class AccountSetting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpened: false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	openModal() {
		$.ajax({
			url: 'https://ezcare.info:38201/event/GET_CALLLIST', 
			type: 'get', 
			dataType: 'json', 
			data: {
				id: this.props.user
			}, 
			success: (data) => {
				if(!data.P.err) {
					this.setState({
						modalOpened: true
					}, () => {
						ReactDOM.findDOMNode(this.contactOrder1).value = data.P.result[0] == undefined ? '' : data.P.result[0].target;
						ReactDOM.findDOMNode(this.contactOrder2).value = data.P.result[1] == undefined ? '' : data.P.result[1].target;
						ReactDOM.findDOMNode(this.contactOrder3).value = data.P.result[2] == undefined ? '' : data.P.result[2].target;
					});
				}
			}, 
			error: (jqXHR) => {
				console.log(jqXHR);
			}
		});
	}
	closeModal() {
		this.setState({
			modalOpened: false
		});
	}
	handleClick() {
		alert(ReactDOM.findDOMNode(this.connectTo).value);
	}
	render() {
		return (
			<div id="btn-setting" onClick={this.openModal}>
				<Glyphicon glyph="cog" />
				<Modal id="modal-accountSetting" show={this.state.modalOpened} onHide={this.closeModal}>
					<Modal.Header closeButton>
						<Modal.Title>設定</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Panel header="轉接設定">
							<Form horizontal>
								<FormGroup controlId="contactOrder1">
									<Col sm={3}>
										第一順位
									</Col>
									<Col sm={9}>
										<FormControl 
											type="text" 
											placeholder="第一順位" 
											ref={ref => this.contactOrder1 = ref}
										/>
									</Col>
								</FormGroup>
								<FormGroup controlId="contactOrder2">
									<Col sm={3}>
										第二順位
									</Col>
									<Col sm={9}>
										<FormControl 
											type="text" 
											placeholder="第二順位" 
											ref={ref => this.contactOrder2 = ref}
										/>
									</Col>
								</FormGroup>
								<FormGroup controlId="contactOrder3">
									<Col sm={3}>
										第三順位
									</Col>
									<Col sm={9}>
										<FormControl 
											type="text" 
											placeholder="第三順位" 
											ref={ref => this.contactOrder3 = ref}
										/>
									</Col>
								</FormGroup>
							</Form>
						</Panel>
						<Button className="btn-saveSetting" bsStyle="primary" style={{width: '100%'}} onClick={this.handleClick}>完成</Button>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}
