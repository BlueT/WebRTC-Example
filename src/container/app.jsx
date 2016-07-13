import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

import Navigation from '../component/navigation';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
	}
	componentDidMount() {
		if(!localStorage.webrtcExampleUser) {
			this.context.router.replace('/login');
		}
	}
	handleLogout() {
		delete localStorage.webrtcExampleUser;
		this.context.router.replace('/login');
	}
	render() {
		return (
			<div>
				<Navigation user={localStorage.webrtcExampleUser} onLogout={this.handleLogout} />
				<Grid>
					{this.props.children}
				</Grid>
			</div>
		);
	}
}

App.contextTypes = {
	router: function () {
		return React.PropTypes.func.isRequired;
	}
};
