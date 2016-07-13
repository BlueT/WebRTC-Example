import React from 'react';
import ReactDOM from 'react-dom'
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export default class DeviceCreator extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		var id = ReactDOM.findDOMNode(this.newDevice).value;
		if(id) {
			this.props.onAdd(id);
		}
	}
	render() {
		return (
			<FormGroup>
				<InputGroup>
					<FormControl type="text" placeholder="新增裝置" ref={ref => this.newDevice = ref} />
					<InputGroup.Addon>
						<Glyphicon glyph="plus" onClick={this.handleClick} />
					</InputGroup.Addon>
				</InputGroup>
			</FormGroup>
		);
	}
}
