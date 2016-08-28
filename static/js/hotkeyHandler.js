const hotkeyHandler = {
	toAddNewContact() {
		console.log('Hotkey + triggered.');
		$('.btn-newDevice').click();
		$('#newID').focus();
	},
	createNewContact() {
		alert('createNewContact');
	}
}

export default hotkeyHandler;
