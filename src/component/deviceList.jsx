import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import DeviceEditer from './deviceEditer';

import '../../static/css/deviceList.css';

export default class DeviceList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<ListGroup id="deviceList">
				{
					this.props.list && this.props.list.map((val, i) => {
						let callIcon = this.props.mode == 'device' ? (
							<span className="btn-call device pull-right" onClick={() => {this.props.onCall(val)}}>
								<Glyphicon glyph="earphone"/>
								<span className="btn-call-num">{+i+1}</span>
							</span>
						) : (
							<Glyphicon 
								className="btn-call pull-right" 
								glyph="earphone"
								onClick={() => {this.props.onCall(val)}}
							/>
						);
						return (
							<ListGroupItem className="deviceItem" key={i} >
								<span className="deviceName">{this.props.name[i]}</span><br />
								<span className="deviceID">{val}</span>
								{(this.props.mode == 'remote') && (<DeviceEditer deviceID={val} deviceName={this.props.name[i]} />)}
								{callIcon}
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
