const hotkeyHandler = {
	toAddNewContact() {
		if(!this.state.live) {
			console.log('Hotkey + triggered.');
			$('.btn-newDevice').click();
			$('#newID').focus();
		}
	}, 
	call(index) {
		if(this.state.deviceList.list[index] && !this.state.live && $('#modal-addDevice').size() == 0) {
			connection.join(this.state.deviceList.list[index]);
		}
	}, 
	hangup() {
		if(this.state.live) {
			connection.close();
		}
	}, 
	urgentCall() {
		$.ajax({
			url: '../../static/json/getOrderList.json', 
			type: 'get', 
			dataType: 'json', 
			success: (data) => {
				whoToCall(data.list);
			}, 
			error: (jqXHR) => {
				console.log(jqXHR);
			}
		})
	}
}
function whoToCall(list, order = 0) {
	if(list[order]) {
		connection.checkPresence(list[order].id, function(exist, id) {
			if(exist) {
				connection.join(id);
				console.log(`join the order ${order}, and the id is ${id}`);
			} else {
				whoToCall(list, +order+1);
				console.log(id+' no exist');
			}
		});
	}
}

export default hotkeyHandler;
