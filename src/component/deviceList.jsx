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
					this.props.devices && Object.keys(this.props.devices).map((deviceID, i) => {
						let callIcon = this.props.mode == 'device' ? (
							<span className="btn-call device pull-right" onClick={() => {this.props.onCall(deviceID)}}>
								<Glyphicon glyph="earphone"/>
								<span className="btn-call-num">{+i+1}</span>
							</span>
						) : (
							<Glyphicon 
								className="btn-call pull-right" 
								glyph="earphone"
								onClick={() => {this.props.onCall(deviceID)}}
							/>
						);
						return (
							<ListGroupItem className="deviceItem" key={i} >
								<span className="deviceName">{this.props.devices[deviceID].name}</span><br />
								<span className="deviceID">{deviceID}</span>
								{
									(this.props.mode == 'remote') && 
									(this.props.devices[deviceID].owner) &&
									(<DeviceEditer deviceID={deviceID} deviceName={this.props.devices[deviceID].name} />)
								}
								{callIcon}
								<Glyphicon 
									className="btn-del" 
									glyph="remove-circle" 
									onClick={() => {this.props.onDel(deviceID, this.props.devices[deviceID].name)}}
								/>
							</ListGroupItem>
						);
					})
				}
			</ListGroup>
		);
	}
}
