import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';

import Navigation from '../component/navigation';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: window.account || null
		}
		this.handleLogout = this.handleLogout.bind(this);
	}
	handleLogout() {
		$.ajax({
			url: 'http://src.imoncloud.com:38200/event/drupalLogout', 
			type: 'post', 
			dataType: 'json', 
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true, 
			success: (data) => {
				if(!data.P.err) {
					this.context.router.replace('/login');
				}
			}, 
			error: (jqXHR) => {
				console.log(jqXHR)
			}
		})
	}
	render() {
		return (
			<div>
				<Navigation user={this.state.account} onLogout={this.handleLogout} />
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
