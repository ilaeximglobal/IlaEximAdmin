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