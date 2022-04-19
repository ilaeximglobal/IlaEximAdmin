
app.controller('faq', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'FAQ';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankFaq = Faq.blankFaq();
	$scope.newFaq = angular.copy($scope.blankFaq);
	$scope.newFaq.is_showing = true;

	$scope.allFAQTypeList = [{id:'product',name:'1'},{id:'service',name:'2'}];

	$scope.loadFaqData = function () {
		dataService.getFaq(
			jwt,
			function (data) {
				$scope.faqs = [];
				if(data.data.data.length>=0){
					$scope.faqs = data.data.data.map(q => Faq.fromData(Faq.blankFaq(), q));
				}
				console.log($scope.faqs);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.faqs = [];
	$scope.loadFaqData();

	$scope.updateFaq = function (faq) {
		let [onSuccess,onError] = getUpdateDataHandler(faq,$timeout);
		dataService.updateFaq(Faq.toData(Faq.blankFaq(),faq), jwt, onSuccess, onError);
	};

	$scope.createFaq = function () {
		var faq = $scope.newFaq;
		let [onSuccess,onError] = getCreateDataHandler(faq,$timeout,function(){
			$scope.loadFaqData();
			$scope.resetNewFaq();
		});
		dataService.createFaq(Faq.toData(Faq.blankFaq(),faq), jwt, onSuccess, onError);
	};

	$scope.deleteFaq = function (faq) {
		let [onSuccess,onError] = getDeleteDataHandler(faq,$timeout,function(){
			$scope.loadFaqData();
		});
		dataService.deleteFaq(Faq.toData(Faq.blankFaq(),faq), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewFaq = function () {
		$scope.newFaq = angular.copy($scope.blankFaq);
	};
}]);