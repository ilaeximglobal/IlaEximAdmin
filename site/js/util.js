var formatData = function(data){
	let returnData = '';
	let count = 0;
	for (let i in data) {
		if (count == 0) {
			returnData += i + '=' + data[i];
		} else {
			returnData += '&' + i + '=' + data[i];
		}
		count = count + 1;
	}
	return returnData;
};

var getFormHandlers = function(){
	var enableUpdateForm = function (obj) {
		obj.isContactFormDisabled = false;
	};
	var cancelUpdate = function (obj) {
		obj.revertOlder();
		obj.isContactFormDisabled = true;
	};
	var resetMessage = function (obj) {
		obj.setMessage({ type: 'none', text: '' });
	};
	return [enableUpdateForm,cancelUpdate,resetMessage];
}

var getUpdateDataHandler = function (obj,$timeout,successFunction) {
	var onSuccess = function (data, status, headers, config) {
		console.log('dataT', data);
		if (data.data.success) {
			obj.setMessage({ type: 'success', text: 'Updated.' });
			obj.isContactFormDisabled = true;
			obj.finalizeNewer(obj);
			$timeout(function () {
				successFunction();
			}, 1000);
		} else {
			obj.setMessage({ type: 'danger', text: 'Error occured - ' + data?.data?.message });
			obj.isContactFormDisabled = false;
		}
		$timeout(function () {
			obj.setMessage({ type: 'none', text: '' });
		}, 3000);
	};
	var onError = function (data, status, headers, config) {
		console.log('dataF', data);
		obj.setMessage({ type: 'danger', text: 'Error occured' });
		obj.isContactFormDisabled = false;
		$timeout(function () {
			obj.setMessage({ type: 'none', text: '' });
		}, 3000);
	}
	return [onSuccess,onError];
};

var getCreateDataHandler = function (obj,$timeout,successFunction) {
	var onSuccess = function (data, status, headers, config) {
		console.log('dataT', data);
		if (data.data.success) {
			obj.setMessage({ type: 'success', text: 'Created.' });
			$timeout(function () {
				successFunction();
			}, 1000);
		} else {
			obj.setMessage({ type: 'danger', text: 'Error occured - ' + data?.data?.message });
		}
		obj.isContactFormDisabled = false;
		$timeout(function () {
			obj.setMessage({ type: 'none', text: '' });
		}, 3000);
	};
	var onError = function (data, status, headers, config) {
		console.log('dataF', data);
		obj.setMessage({ type: 'danger', text: 'Error occured' });
		obj.isContactFormDisabled = false;
		$timeout(function () {
			obj.setMessage({ type: 'none', text: '' });
		}, 3000);
	}
	return [onSuccess,onError];
};

var getDeleteDataHandler = function (obj,$timeout,successFunction) {
	var onSuccess = function (data, status, headers, config) {
		console.log('dataT', data);
		if (data.data.success) {
			obj.setMessage({ type: 'success', text: 'Deleted.' });
		} else {
			obj.setMessage({ type: 'danger', text: 'Error occured - ' + data?.data?.message });
		}
		obj.isContactFormDisabled = false;
		$timeout(function () {
			successFunction();
		}, 1000);
		$timeout(function () {
			obj.setMessage({ type: 'none', text: '' });
		}, 3000);
	};
	var onError = function (data, status, headers, config) {
		console.log('dataF', data);
		obj.setMessage({ type: 'danger', text: 'Error occured' });
		obj.isContactFormDisabled = false;
		$timeout(function () {
			obj.setMessage({ type: 'none', text: '' });
		}, 3000);
	}
	return [onSuccess,onError];
};

//cookie
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
	document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteAllCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
}