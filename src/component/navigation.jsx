import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import AccountSetting from './accountSetting';

export default class Navigation extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Navbar id="nav">
				<Navbar.Header>
					<Navbar.Brand>
						<a href="/">ezCare</a>
					</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
						<NavItem eventKey={1} href="#">{this.props.user}</NavItem>
						<NavItem eventKey={1} href="#">
							<AccountSetting user={this.props.user} />
						</NavItem>
						<NavItem eventKey={2} href="#" onClick={this.props.onLogout}>登出</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}
