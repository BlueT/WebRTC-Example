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
			url: '../../static/json/getOrderList.json', 
			type: 'get', 
			dataType: 'json',
			success: (data) => {
				this.setState({
					modalOpened: true
				}, () => {
					ReactDOM.findDOMNode(this.connectTo).value = data.list[0] == undefined ? '' : data.list[0].id;
				});
			}, 
			error: (jqXHR) => {
				console.log(jqXHR);
			}
		})
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
				<Glyphicon glyph="cog" onClick={this.openModal} />
				<Modal id="modal-accountSetting" show={this.state.modalOpened} onHide={this.closeModal}>
					<Modal.Header closeButton>
						<Modal.Title>設定</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Panel header="轉接設定">
							<Form horizontal>
								<FormGroup controlId="order1">
									<Col sm={3}>
										第一順位
									</Col>
									<Col sm={9}>
										<FormControl 
											type="text" 
											placeholder="第一順位" 
											ref={ref => this.order1 = ref}
										/>
									</Col>
								</FormGroup>
								<FormGroup controlId="order2">
									<Col sm={3}>
										第二順位
									</Col>
									<Col sm={9}>
										<FormControl 
											type="text" 
											placeholder="第二順位" 
											ref={ref => this.order2 = ref}
										/>
									</Col>
								</FormGroup>
								<FormGroup controlId="order3">
									<Col sm={3}>
										第三順位
									</Col>
									<Col sm={9}>
										<FormControl 
											type="text" 
											placeholder="第三順位" 
											ref={ref => this.order3 = ref}
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
