
app.controller('faq', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
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

	$scope.faqs = [];
	dataService.getFaq(
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

	$scope.isLoggedIn = dataService.isUserLoggedIn();

	function preProcess(faq) {
		faq.isShowing = faq.showing == 'Y';
		faq.isContactFormDisabled = false;
		faq.message = { type: 'none', text: '' };
		faq.answer = faq.answer.replaceAll('<br>', '\n\n');
	}

	function postProcess(faq) {
		faq.showing = faq.isShowing ? 'Y' : 'N';
		faq.answer = faq.answer.replaceAll('\n\n', '<br>');
		faq.isContactFormDisabled = true;
	}

	$scope.updateFaq = function (faq) {
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
		};
		var onError = function (data, status, headers, config) {
			console.log('data', data);
			faq.message = { type: 'danger', text: 'Error occured' };
			//alert('Error occured.');
			faq.isContactFormDisabled = false;
		}
		dataService.updateFaq(faq, jwt, onSuccess, onError);

	};

	$scope.resetMessage = function (faq) {
		faq.message = { type: 'none', text: '' };
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