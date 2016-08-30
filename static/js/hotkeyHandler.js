const hotkeyHandler = {
	toAddNewContact() {
		console.log('Hotkey + triggered.');
		$('.btn-newDevice').click();
		$('#newID').focus();
	}
}

export default hotkeyHandler;
