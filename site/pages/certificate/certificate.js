
app.controller('certificate', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Certificates';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankCertificate = Certificate.blankCertificate();
	$scope.newCertificate = Certificate.blankNewCertificate();

	$scope.loadCertificateData = function () {
		dataService.getCertificate(
			jwt,
			function (data) {
				console.log(data);
				$scope.certificates = [];
				if(data.data.data.length>=0){
					$scope.certificates = data.data.data.map(q => Certificate.fromData(Certificate.blankCertificate(), q));
				}
				console.log($scope.certificates);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.certificates = [];
	$scope.loadCertificateData();

	$scope.updateCertificate = function (certificate) {
		let [onSuccess,onError] = getUpdateDataHandler(certificate,$timeout,function(){
			$scope.loadCertificateData();
		});
		console.log('certificate', Certificate.toData(Certificate.blankCertificate(),certificate));
		dataService.updateCertificate(Certificate.toData(Certificate.blankCertificate(),certificate), jwt, onSuccess, onError);
	};

	$scope.createCertificate = function () {
		var certificate = $scope.newCertificate;
		let [onSuccess,onError] = getCreateDataHandler(certificate,$timeout,function(){
			$scope.loadCertificateData();
			$scope.resetNewCertificate();
		});
		console.log('certificate', Certificate.toData(Certificate.blankCertificate(),certificate));
		dataService.createCertificate(Certificate.toData(Certificate.blankCertificate(),certificate), jwt, onSuccess, onError);
	};

	$scope.deleteCertificate = function (certificate) {
		let [onSuccess,onError] = getDeleteDataHandler(certificate,$timeout,function(){
			$scope.loadCertificateData();
		});
		dataService.deleteCertificate(Certificate.toData(Certificate.blankCertificate(),certificate), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewCertificate = function () {
		$scope.newCertificate = Certificate.blankNewCertificate();
	};
}]);