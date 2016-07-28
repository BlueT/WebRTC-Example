import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import hashHistory from 'react-router/lib/hashHistory';
import Redirect from 'react-router/lib/Redirect';
// import IndexRedirect from 'react-router/lib/IndexRedirect';

import Login from './container/login';
import App from './container/app';
import Index from './container/index';
import Device from './container/device';

import '../static/css/style.css';

function isLogin(nextState, replace) {
	$.ajax({
		url: 'http://src.imoncloud.com:38200/event/isAuth', 
		type: 'post', 
		dataType: 'json', 
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true, 
		async: false, 
		success: (data) => {
			console.log(data);
			if(data.P.err || !data.P.result.login) {
				replace({
					pathname: '/login',
					state: { nextPathname: nextState.location.pathname }
				})
			} else {
				console.log('logged in');
				window.account = data.P.result.user.account;
			}
		}, 
		error: (jqXHR) => {
			console.log(jqXHR);
		}
	});
}

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/login" component={Login} />
		<Route path="/device" component={Device} />
		<Route path="/" component={App} onEnter={isLogin} >
			<IndexRoute component={Index}/>
			<Redirect from="*" to="/" />
		</Route>
	</Router>,
	document.getElementById('app')
);
