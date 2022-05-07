
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

	$scope.sorting = false;

	$scope.loadCertificateData = function () {
		dataService.getCertificate(
			jwt,
			function (data) {
				console.log(data);
				$scope.certificates = [];
				if(data.data.data.length>=0){
					$scope.certificates = data.data.data.map(q => Certificate.fromData(Certificate.blankCertificate(), q));
					$scope.certificates.sort((a,b)=>a.item_order-b.item_order);
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
	
	$scope.updateCertificateBulk = function (certificateList) {
		let [onSuccess,onError] = getUpdateDataHandlerBulk(certificateList,$timeout,function(){
			$scope.loadCertificateData();
		});
		certificateList.map(p=>Certificate.toData(Certificate.blankCertificate(),p));
		dataService.updateCertificateBulk(certificateList, jwt, onSuccess, onError);
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

	$scope.moveUp = function (index,destIndex) {
		if(!destIndex) destIndex = index-1;
		if (index == 0) return;

		$scope.swapWith(index,destIndex);
	};

	$scope.moveDown = function (index,destIndex) {
		if(!destIndex) destIndex = index+1;
		if (index == $scope.certificates.length - 1) return;

		$scope.swapWith(index,destIndex);
	};

	$scope.swapWithPosition = function (index,destIndex) {
		index = parseInt(index);
		destIndex = parseInt(destIndex)-1;
		$scope.swapWith(index,destIndex);
	}

	$scope.moveToPosition = function (index,destIndex) {
		index = parseInt(index);
		destIndex = parseInt(destIndex)-1;
		$scope.moveTo(index,destIndex);
	}

	$scope.swapWith = function (index,destIndex) {
		let items = $scope.certificates;
		let updatable = swapWith(items,index,destIndex);
		$scope.updateCertificateBulk(updatable);
	};

	$scope.moveTo = function (index,destIndex) {
		let items = $scope.certificates;
		let updatable = moveTo(items,index,destIndex);
		$scope.updateCertificateBulk(updatable);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewCertificate = function () {
		$scope.newCertificate = Certificate.blankNewCertificate();
	};
}]);