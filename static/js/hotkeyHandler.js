const hotkeyHandler = {
	toAddNewContact() {
		if(!this.state.live) {
			console.log('Hotkey + triggered.');
			$('.btn-newDevice').click();
			$('#newID').focus();
		}
	}
}

export default hotkeyHandler;
