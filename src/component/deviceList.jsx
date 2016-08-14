import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import '../../static/css/deviceList.css';

export default class DeviceList extends React.Component {
	constructor(props) {
		super(props);
		this.clickToCall = this.clickToCall.bind(this);
	}
	clickToCall(number) {
		connection.join(number);
	}
	render() {
		return (
			<ListGroup id="deviceList">
				{
					this.props.list && this.props.list.map((val, i) => {
						return (
							<ListGroupItem className="deviceItem" key={i} >
								<span className="deviceName">{this.props.name[i]}</span><br />
								<span className="deviceID">{val}</span>
								<Glyphicon 
									className="btn-call pull-right" 
									glyph="earphone"
									onClick={() => {this.clickToCall(val)}}
								/>
								<Glyphicon 
									className="btn-del" 
									glyph="remove-circle" 
									onClick={() => {this.props.onDel(val, this.props.name[i])}}
								/>
							</ListGroupItem>
						);
					})
				}
			</ListGroup>
		);
	}
}
