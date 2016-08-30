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
	}
}

export default hotkeyHandler;
