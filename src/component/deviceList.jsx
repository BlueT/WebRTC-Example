import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

export default class DeviceList extends React.Component {
	constructor(props) {
		super(props);
		this.clickToCall = this.clickToCall.bind(this);
	}
	clickToCall(number) {
		phone.dial(number);
	}
	render() {
		return (
			<ListGroup>
				{
					this.props.list.map((val, i) => {
						return (<ListGroupItem key={i} onClick={() => {this.clickToCall(val)}}>{val}</ListGroupItem>);
					})
				}
			</ListGroup>
		);
	}
}
