
app.controller('diamondfaq', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'FAQ';
	$scope.setup = function () {
		// document.getElementById('carousel').style.display = 'none';
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('jwt');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
	}

	$scope.blankFaq = {
		'id': '0',
		'question': '',
		'answer': '',
		'printableAnswer': '',
		'showing': 'Y',
		'isShowing': true,
		'isContactFormDisabled': false,
		'message': {
			'type': 'none',
			'text': ''
		}
	};
	$scope.newFaq = angular.copy($scope.blankFaq);

	$scope.loadFaqData = function () {
		dataService.getDiamondFaq(
			jwt,
			function (data) {
				$scope.faqs = data.data;
				$scope.faqs.forEach(q => {
					preProcess(q);
				});
				console.log($scope.faqs);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.faqs = [];
	$scope.loadFaqData();

	$scope.isLoggedIn = dataService.isUserLoggedIn();

	function preProcess(faq) {
		faq.isShowing = faq.showing == 'Y';
		faq.isContactFormDisabled = true;
		faq.message = { type: 'none', text: '' };
		faq.printableAnswer = faq.answer.replaceAll('<br>', '\n\n');
		faq.olderQuestion = faq.question;
		faq.olderAnswer = faq.answer;
		faq.olderIsShowing = faq.isShowing;
	}

	function postProcess(faq) {
		faq.showing = faq.isShowing ? 'Y' : 'N';
		faq.answer = faq.printableAnswer.replaceAll('\n\n', '<br>');
		faq.isContactFormDisabled = true;
	}

	function revertOlder(faq) {
		faq.question = faq.olderQuestion;
		faq.answer = faq.olderAnswer;
		faq.isShowing = faq.olderIsShowing;
		preProcess(faq);
	}

	function finalizeNewer(faq) {
		faq.olderQuestion = faq.question;
		faq.olderAnswer = faq.answer;
		faq.olderIsShowing = faq.isShowing;
	}

	$scope.updateFaq = function (faq) {
		// var faq = angular.copy(givenFaq);
		postProcess(faq);
		console.log('updateFaq', faq);
		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				//alert('Thanks. We have received your request.');
				faq.message = { type: 'success', text: 'FAQ updated.' };
				// $scope.resetForm();
			} else {
				faq.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
				//alert('Error occured - '+data.data);
			}
			faq.isContactFormDisabled = false;
			$scope.disableUpdateForm(faq);
			finalizeNewer(faq);
			$timeout(function () {
				$scope.resetMessage(faq);
			}, 3000);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			faq.message = { type: 'danger', text: 'Error occured' };
			//alert('Error occured.');
			faq.isContactFormDisabled = false;
			$timeout(function () {
				$scope.resetMessage(faq);
			}, 3000);
		}
		dataService.updateDiamondFaq(faq, jwt, onSuccess, onError);

	};

	$scope.createFaq = function () {
		var faq = $scope.newFaq;
		postProcess(faq);
		console.log('updateFaq', faq);
		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				faq.message = { type: 'success', text: 'FAQ created.' };
			} else {
				faq.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
			}
			faq.isContactFormDisabled = false;
			$timeout(function () {
				$scope.loadFaqData();
				$scope.resetNewFaq();
			}, 1000);
			$timeout(function () {
				$scope.resetMessage(faq);
			}, 3000);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			faq.message = { type: 'danger', text: 'Error occured' };
			faq.isContactFormDisabled = false;
			$timeout(function () {
				$scope.resetMessage(faq);
			}, 3000);
		}
		dataService.createDiamondFaq(faq, jwt, onSuccess, onError);
	};

	$scope.deleteFaq = function (faq) {
		postProcess(faq);
		console.log('updateFaq', faq);
		var onSuccess = function (data, status, headers, config) {
			console.log('data', data);
			if (data.data.success) {
				faq.message = { type: 'success', text: 'FAQ deleted.' };
			} else {
				faq.message = { type: 'danger', text: 'Error occured - ' + data?.data?.message };
			}
			faq.isContactFormDisabled = false;
			$timeout(function () {
				$scope.loadFaqData();
			}, 1000);
			$timeout(function () {
				$scope.resetMessage(faq);
			}, 3000);
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			faq.message = { type: 'danger', text: 'Error occured' };
			faq.isContactFormDisabled = false;
			$timeout(function () {
				$scope.resetMessage(faq);
			}, 3000);
		}
		dataService.deleteDiamondFaq(faq, jwt, onSuccess, onError);
	};

	$scope.enableUpdateForm = function (faq) {
		faq.isContactFormDisabled = false;
	};
	$scope.disableUpdateForm = function (faq) {
		faq.isContactFormDisabled = true;
	};
	$scope.cancelUpdate = function (faq) {
		revertOlder(faq);
		$scope.disableUpdateForm(faq);
	};
	$scope.resetMessage = function (faq) {
		console.log('resetMessage');
		faq.message = { type: 'none', text: '' };
	};
	$scope.resetNewFaq = function () {
		$scope.newFaq = angular.copy($scope.blankFaq);
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