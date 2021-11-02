
app.controller('about', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'About';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankAboutDetail = AboutDetail.blankAboutDetail();
	$scope.newAboutDetail = AboutDetail.blankNewAboutDetail();

	$scope.loadAboutDetailData = function () {
		dataService.getAboutDetail(
			jwt,
			function (data) {
				console.log(data);
				$scope.aboutDetails = [];
				if(data.data.data.length>=0){
					$scope.aboutDetails = data.data.data.map(q => AboutDetail.fromData(AboutDetail.blankAboutDetail(), q));
				}
				console.log($scope.aboutDetails);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.aboutDetails = [];
	$scope.loadAboutDetailData();

	$scope.updateAboutDetail = function (aboutDetail) {
		let [onSuccess,onError] = getUpdateDataHandler(aboutDetail,$timeout,function(){
			$scope.loadAboutDetailData();
		});
		console.log('aboutDetail', AboutDetail.toData(AboutDetail.blankAboutDetail(),aboutDetail));
		dataService.updateAboutDetail(AboutDetail.toData(AboutDetail.blankAboutDetail(),aboutDetail), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	
}]);