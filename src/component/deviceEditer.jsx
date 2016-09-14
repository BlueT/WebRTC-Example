import React from 'react';
import ReactDOM from 'react-dom';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import '../../static/css/deviceEditer.css';

export default class DeviceEditer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpened: false, 
			orderList: []
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
				id: this.props.deviceID
			}, 
			success: (data) => {
				if(!data.P.err) {
					this.setState({
						modalOpened: true
					}, () => {
						ReactDOM.findDOMNode(this.order1).value = data.P.result[0] == undefined ? '' : data.P.result[0].target;
						ReactDOM.findDOMNode(this.order2).value = data.P.result[1] == undefined ? '' : data.P.result[1].target;
						ReactDOM.findDOMNode(this.order3).value = data.P.result[2] == undefined ? '' : data.P.result[2].target;
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
		})
	}
	handleClick() {
		var list = [];
		for(var i = 1; i <= 3; i++) {
			var target = ReactDOM.findDOMNode(this[`order${i}`]).value;
			if(target) {
				list = [...list, {target}];
			}
		}
		// console.log(list);
		$.ajax({
			url: 'https://ezcare.info:38201/event/SET_CALLLIST', 
			type: 'get', 
			dataType: 'json', 
			data: {
				_data: JSON.stringify({
					id: this.props.deviceID,
					list
				})
			}, 
			success: (data) => {
				console.log(data);
				if(!data.P.err) {
					this.closeModal();
				}
			}, 
			error: (jqXHR) => {
				console.log(jqXHR);
			}
		})
	}
	render() {
		return (
			<span className="deviceEditer">
				<Glyphicon className="pull-right btn-edit" glyph="pencil" onClick={this.openModal} />
				<Modal id="modal-editDevice" show={this.state.modalOpened} onHide={this.closeModal}>
					<Modal.Header closeButton>
						<Modal.Title>{`設定 ${this.props.deviceName} (${this.props.deviceID}) 緊急撥號對象`}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form horizontal>
							<FormGroup controlId="order1">
								<Col sm={3}>
									第一順位
								</Col>
								<Col sm={9}>
									<FormControl 
										type="text" 
										placeholder="裝置編號或帳號" 
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
										placeholder="裝置編號或帳號" 
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
										placeholder="裝置編號或帳號" 
										ref={ref => this.order3 = ref}
									/>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col sm={12}>
									<Button className="btn-editDevice pull-right" bsStyle="primary" onClick={this.handleClick}>完成</Button>
								</Col>
							</FormGroup>
						</Form>
					</Modal.Body>
				</Modal>
			</span>
		);
	}
}
