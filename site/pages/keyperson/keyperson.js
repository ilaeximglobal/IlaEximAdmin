
app.controller('keyperson', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Keyperson';
	$scope.setup = function () {
		// document.getElementById('carousel').style.display = 'none';
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('jwt');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
	}

	$scope.blankKeyperson = {
		'id': '0',
		'name': '',
		'designation': '',
		'expertise': '',
		'about': '',
		'image': '',

		'showing': 'Y',
		'isShowing': true,
		'isContactFormDisabled': false,
		'message': {
			'type': 'none',
			'text': ''
		}
	};
	$scope.newKeyperson = angular.copy($scope.blankKeyperson);

	$scope.loadKeypersonData = function () {
		dataService.getKeyperson(
			jwt,
			function (data) {
				$scope.keypersons = data.data;
				$scope.keypersons.forEach(q => {
					preProcess(q);
				});
				console.log($scope.keypersons);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.keypersons = [];
	$scope.loadKeypersonData();

	$scope.isLoggedIn = dataService.isUserLoggedIn();

	function preProcess(keyperson) {
		// keyperson.printableAnswer = keyperson.answer.replaceAll('<br>', '\n\n');

		keyperson.olderName = keyperson.name;
		keyperson.olderDesignation = keyperson.designation;
		keyperson.olderExpertise = keyperson.expertise;
		keyperson.olderAbout = keyperson.about;
		keyperson.olderImage = keyperson.image;
		keyperson.olderIsShowing = keyperson.isShowing;

		keyperson.isShowing = keyperson.showing == 'Y';
		keyperson.isContactFormDisabled = true;
		keyperson.message = { type: 'none', text: '' };
	}

	function postProcess(keyperson) {
		// keyperson.answer = keyperson.printableAnswer.replaceAll('\n\n', '<br>');

		keyperson.showing = keyperson.isShowing ? 'Y' : 'N';
		keyperson.isContactFormDisabled = true;
	}

	function revertOlder(keyperson) {
		keyperson.name = keyperson.olderName;
		keyperson.designation = keyperson.olderDesignation;
		keyperson.expertise = keyperson.olderExpertise;
		keyperson.about = keyperson.olderAbout;
		keyperson.image = keyperson.olderImage;
		
		keyperson.isShowing = keyperson.olderIsShowing;
		preProcess(keyperson);
	}

	function finalizeNewer(keyperson) {
		keyperson.olderQuestion = keyperson.question;
		keyperson.olderAnswer = keyperson.answer;
		keyperson.olderIsShowing = keyperson.isShowing;
	}

	$scope.updateKeyperson = function (keyperson) {
		postProcess(keyperson);
		console.log('updateKeyperson', keyperson);
		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				//alert('Thanks. We have received your request.');
				keyperson.message = { type: 'success', text: 'FAQ updated.' };
				// $scope.resetForm();
			} else {
				keyperson.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
				//alert('Error occured - '+data.data);
			}
			keyperson.isContactFormDisabled = false;
			$scope.disableUpdateForm(keyperson);
			finalizeNewer(keyperson);
			$timeout(function () {
				$scope.resetMessage(keyperson);
			}, 3000);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			keyperson.message = { type: 'danger', text: 'Error occured' };
			//alert('Error occured.');
			keyperson.isContactFormDisabled = false;
			$timeout(function () {
				$scope.resetMessage(keyperson);
			}, 3000);
		}
		dataService.updateKeyperson(keyperson, jwt, onSuccess, onError);

	};

	$scope.createKeyperson = function () {
		var keyperson = $scope.newKeyperson;
		postProcess(keyperson);
		console.log('updateKeyperson', keyperson);
		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				keyperson.message = { type: 'success', text: 'FAQ created.' };
			} else {
				keyperson.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
			}
			keyperson.isContactFormDisabled = false;
			$timeout(function () {
				$scope.loadKeypersonData();
				$scope.resetNewKeyperson();
			}, 1000);
			$timeout(function () {
				$scope.resetMessage(keyperson);
			}, 3000);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			keyperson.message = { type: 'danger', text: 'Error occured' };
			keyperson.isContactFormDisabled = false;
			$timeout(function () {
				$scope.resetMessage(keyperson);
			}, 3000);
		}
		dataService.createKeyperson(keyperson, jwt, onSuccess, onError);
	};

	$scope.deleteKeyperson = function (keyperson) {
		postProcess(keyperson);
		console.log('updateKeyperson', keyperson);
		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				keyperson.message = { type: 'success', text: 'FAQ deleted.' };
			} else {
				keyperson.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
			}
			keyperson.isContactFormDisabled = false;
			$timeout(function () {
				$scope.loadKeypersonData();
			}, 1000);
			$timeout(function () {
				$scope.resetMessage(keyperson);
			}, 3000);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			keyperson.message = { type: 'danger', text: 'Error occured' };
			keyperson.isContactFormDisabled = false;
			$timeout(function () {
				$scope.resetMessage(keyperson);
			}, 3000);
		}
		dataService.deleteKeyperson(keyperson, jwt, onSuccess, onError);
	};

	$scope.enableUpdateForm = function (keyperson) {
		keyperson.isContactFormDisabled = false;
	};
	$scope.disableUpdateForm = function (keyperson) {
		keyperson.isContactFormDisabled = true;
	};
	$scope.cancelUpdate = function (keyperson) {
		revertOlder(keyperson);
		$scope.disableUpdateForm(keyperson);
	};
	$scope.resetMessage = function (keyperson) {
		console.log('resetMessage');
		keyperson.message = { type: 'none', text: '' };
	};
	$scope.resetNewKeyperson = function () {
		$scope.newKeyperson = angular.copy($scope.blankKeyperson);
	};

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
}]);