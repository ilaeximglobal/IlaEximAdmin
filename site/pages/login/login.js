
app.controller('login', ['$scope', '$routeParams', '$location', '$http', 'dataService',
	function ($scope, $routeParams, $location, $http, dataService) {
		$scope.sitename = 'ILA EXIM';
		$scope.pagename = 'Login';
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

		$scope.blankLoginData = {
			email: '',
			password: '',
		};
		$scope.LoginData = angular.copy($scope.blankLoginData);
		$scope.submitLogin = function () {
			console.log('Sending email ', $scope.LoginData);
			$scope.isContactFormDisabled = true;

			var onSuccess = function (data, status, headers, config) {
				console.log('data', data);
				if (data.data.success) {
					$scope.message = { type: 'success', text: 'Login successful' };
					// $scope.resetForm();
					// setCookie("jwt", data.data.token, 1);
					setCookie("user_id", data.data.user_id, 1);
					setCookie("firstname", data.data.firstname, 1);
					setCookie("lastname", data.data.lastname, 1);
					setCookie("email", data.data.email, 1);
					setCookie("role", data.data.role, 1);

					dataService.setUserData({
						user_id: data.data.user_id,
						firstname: data.data.firstname,
						lastname: data.data.lastname,
						email: data.data.email,
						role: data.data.role,
					});
					
					$location.path( "/home" );
					console.log('login successful');
				} else {
					$scope.message = { type: 'danger', text: 'Error occured - ' + data.data.message };
					//alert('Error occured - '+data.data);
				}
				$scope.isContactFormDisabled = false;
			};
			var onError = function (data, status, headers, config) {
				console.log('data', data);
				$scope.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
				//alert('Error occured.');
				$scope.isContactFormDisabled = false;
			}
			$http({
				method: 'POST',
				url: 'api/v1/login.php',
				headers: { 'Content-Type': 'application/json; charset=UTF-8' },
				data: $scope.LoginData
			}).then(onSuccess, onError);

		};

		function setCookie(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+ d.toUTCString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		}
	}]);