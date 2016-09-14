const hotkeyHandler = {
	toAddNewContact() {
		if(!this.state.live) {
			console.log('Hotkey + triggered.');
			$('.btn-newDevice').click();
			$('#newID').focus();
		}
	}, 
	call(index) {
		var deviceIDs = Object.keys(this.state.deviceList);
		if(deviceIDs.length > index && !this.state.live && $('#modal-addDevice').size() == 0) {
			this.callTo(deviceIDs[index]);
		}
	}, 
	hangup() {
		if(this.state.live) {
			connection.close();
		}
	}, 
	urgentCall(id) {
		$.ajax({
			url: 'https://ezcare.info:38201/event/GET_CALLLIST', 
			type: 'get', 
			dataType: 'json', 
			data: {
				id
			}, 
			success: (data) => {
				if(!data.P.err) {
					whoToCall(this, data.P.result);
				}
			}, 
			error: (jqXHR) => {
				console.log(jqXHR);
			}
		});
	}
}
function whoToCall(_this, list, order = 0) {
	if(list[order]) {
		connection.checkPresence(list[order].target, function(exist, id) {
			if(exist) {
				connection.join(id);
				console.log(`join the order ${order}, and the id is ${id}`);
			} else {
				whoToCall(_this, list, +order+1);
				_this.msg.show(`${id} 不在線上`, {
					time: 3000,
					type: 'info'
				});
				console.log(id+' no exist');
			}
		});
	}
}

export default hotkeyHandler;
