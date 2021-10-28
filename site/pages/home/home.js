
app.controller('home', ['$scope', '$location', '$http', 'dataService', function ($scope, $location, $http, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Home';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
		var anchors = document.getElementsByClassName('scrolluplink');
		for (var i = 0; i < anchors.length; i++) {
			anchors[i].onclick = function (e) {
				window.scrollTo(0, 0);
			};
		}
	}

	$scope.logout = function () {
		console.log('lo');
		var jwt = getCookie("jwt");
		var user_id = getCookie("user_id");

		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				$scope.message = { type: 'success', text: 'Logout successful' };
				setCookie("jwt", "", 0);
				$location.path("/login");
				console.log('logout successful');
			} else {
				$scope.message = { type: 'danger', text: 'Error occured - ' + data.data.message };
			}
			dataService.setUserData(undefined);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			$scope.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
			setCookie("jwt", "", 0);
			$location.path("/login");
			console.log('logout successful');
			dataService.setUserData(undefined);
		}
		$http({
			method: 'POST',
			url: 'api/v1/logout.php',
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			data: { 'user_id': user_id, 'token': jwt }
		}).then(onSuccess, onError);

	}

	var jwt = getCookie('jwt');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		$scope.isLoggedIn = false;
	}else{
		$scope.isLoggedIn = true;
		
		var user_id =  getCookie("user_id");
		var firstname = getCookie("firstname");
		var lastname = getCookie("lastname");
		var email = getCookie("email");
		var role = getCookie("role");
		$scope.userData = {
			'user_id': user_id,
			'firstname': firstname,
			'lastname': lastname ,
			'email': email,
			'role': role,
		};
		dataService.setUserData($scope.userData);
	}

	$scope.isLoggedIn = dataService.isUserLoggedIn();
	if($scope.isLoggedIn){
		$scope.userData = dataService.getUserData();
	}

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
}]);