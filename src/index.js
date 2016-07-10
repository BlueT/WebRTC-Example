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

import '../static/css/style.css';

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/login" component={Login} />
		<Route path="/" component={App}>
			<IndexRoute component={Index}/>
			<Redirect from="*" to="/" />
		</Route>
	</Router>,
	document.getElementById('app')
);
