import React from 'react';
import ReactDOM from 'react-dom';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';

import '../../static/css/login.css';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
	}
	handleLogin() {
		var user = ReactDOM.findDOMNode(this.loginUser).value;
		var pass = ReactDOM.findDOMNode(this.loginPass).value;
		if(user) {
			window.localStorage.WebRTCExampleUser = user;
			this.context.router.replace('/');
		} 
	}
	render() {
		return (
			<Grid>
				<Row>
					<Col md={6} mdOffset={3}>
						<Panel id="loginWrap" header="WebRTC Example" bsStyle="primary">
							<Form horizontal>
								<FormGroup controlId="formHorizontalUser">
									<Col sm={12}>
										<FormControl type="text" placeholder="帳號" ref={ref => this.loginUser = ref}/>
									</Col>
								</FormGroup>

								<FormGroup controlId="formHorizontalPassword">
									<Col sm={12}>
										<FormControl type="password" placeholder="密碼" ref={ref => this.loginPass = ref}/>
									</Col>
								</FormGroup>

								<FormGroup>
									<Col sm={12}>
										<Button id="btn-login" onClick={this.handleLogin}>登入</Button>
									</Col>
								</FormGroup>
							</Form>
						</Panel>
					</Col>
				</Row>
			</Grid>
		);
	}
}

Login.contextTypes = {
	router: function () {
		return React.PropTypes.func.isRequired;
	}
};
