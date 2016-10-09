const hotkeyHandler = {
	toAddNewContact() {
		if(!this.state.live) {
			console.log('Hotkey + triggered.');
			$('.deviceItem').removeClass('selected');
			$('.btn-newDevice').click();
			$('#newID').focus();
		}
	}, 
	select(index) {
		var deviceIDs = Object.keys(this.state.deviceList);
		if(deviceIDs.length > index && !this.state.live && $('#modal-addDevice').size() == 0) {
			$('.deviceItem').removeClass('selected');
			$(`.deviceItem:eq(${index})`).addClass('selected');
		}
	}, 
	call() {
		if(!this.state.live && $('#modal-addDevice').size() == 0 && $('.deviceItem.selected').size() == 1) {
			this.callTo($('.deviceItem.selected .deviceID').text());
		}
	}, 
	del() {
		if(this.state.live) {
			$('.deviceItem').removeClass('selected');
			connection.close();
		} else if($('.deviceItem.selected').size() == 1) {
			$.ajax({
				url: 'https://ezcare.info:38201/event/REMOVE_CONTACT', 
				type: 'get', 
				dataType: 'json', 
				data: {
					self: this.state.deviceID, 
					target: $('.deviceItem.selected .deviceID').text()
				}, 
				success: (data) => {
					console.log(data);
					if(!data.P.err) {
						$('.deviceItem').removeClass('selected');
						this.getDeviceList();
					}
				}
			});
		}
	}, 
	urgentCall(id) {
		$('.deviceItem').removeClass('selected');
		$.ajax({
			url: 'https://ezcare.info:38201/event/GET_CALLLIST', 
			type: 'get', 
			dataType: 'json', 
			data: {
				id
			}, 
			success: (data) => {
				if(!data.P.err) {
					this.whoToCall(data.P.result);
				}
			}, 
			error: (jqXHR) => {
				console.log(jqXHR);
			}
		});
	}
}

export default hotkeyHandler;
