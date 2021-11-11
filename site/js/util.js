var formatData = function (data) {
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

var getFormHandlers = function () {
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
	return [enableUpdateForm, cancelUpdate, resetMessage];
}

var swapWith = function (array, index, destIndex) {
	index = parseInt(index);
	destIndex = parseInt(destIndex);

	if (isNaN(index)) return;
	if (isNaN(destIndex)) return;

	if (index < 0 || index >= array.length) return;
	if (destIndex < 0 || destIndex >= array.length) return;
	console.log(index, destIndex);

	let product = array[index];
	let nextProduct = array[destIndex];

	let temp = parseInt(product.item_order);
	product.item_order = parseInt(nextProduct.item_order);
	nextProduct.item_order = temp;

	console.log(product.item_order, nextProduct.item_order);
	return [product, nextProduct];
};

var moveTo = function (array, index, destIndex) {
	index = parseInt(index);
	destIndex = parseInt(destIndex);

	if (isNaN(index)) return;
	if (isNaN(destIndex)) return;

	if (index < 0 || index >= array.length) return;
	if (destIndex < 0 || destIndex >= array.length) return;

	if (index == destIndex) return;
	console.log(index, destIndex);

	if (index < destIndex) {
		for (let i = index + 1; i <= destIndex; i++) {
			array[i].item_order = i - 1;
		}
		array[index].item_order = destIndex;
	} else {
		for (let i = destIndex; i < index; i++) {
			array[i].item_order = i + 1;
		}
		array[index].item_order = destIndex;
	}

	return array;
};

var getUpdateDataHandler = function (obj, $timeout, successFunction) {
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
	return [onSuccess, onError];
};

var getUpdateDataHandlerBulk = function (objs, $timeout, successFunction) {
	var onSuccess = function (data, status, headers, config) {
		console.log('dataT', data);
		if (data.data.success) {
			objs.forEach(obj => obj.finalizeNewer(obj));
			$timeout(function () {
				successFunction();
			}, 1000);
		}
	};
	var onError = function (data, status, headers, config) {
		console.log('dataF', data);
	}
	return [onSuccess, onError];
};

var getCreateDataHandler = function (obj, $timeout, successFunction) {
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
	return [onSuccess, onError];
};

var getDeleteDataHandler = function (obj, $timeout, successFunction) {
	var onSuccess = function (data, status, headers, config) {
		console.log('dataT', data);
		if (data.data.success) {
			obj.setMessage({ type: 'success', text: 'Deleted.' });
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
	return [onSuccess, onError];
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

//create a map with index and object from array
function getIndexedMap(array) {
	var map = {};
	for (var i = 0; i < array.length; i++) {
		map[i] = array[i];
	}
	return map;
}

function getIndexedMapAndAssignOrder(array) {
	var map = {};
	for (var i = 0; i < array.length; i++) {
		array[i].item_order = i;
		map[i] = array[i];
	}
	return map;
}

//convert array to map using field name as key and value as array
function getMapFromArray(array, field) {
	var map = {};
	for (var i = 0; i < array.length; i++) {
		var fieldValue = array[i][field];
		if (map[fieldValue] == undefined) {
			map[fieldValue] = [];
		}
		map[fieldValue].push(array[i]);
	}
	return map;
}

//add items from 2nd array to 1st array based on key field
function addItemsToArray(array1, kf1, array2, kf2) {
	var map = getMapFromArray(array2, kf2);
	for (var i = 0; i < array1.length; i++) {
		var key = array1[i][kf1];
		if (map[key] != undefined) {
			array1[i].items = map[key];
		} else {
			array1[i].items = [];
		}
	}
	return array1;
}
