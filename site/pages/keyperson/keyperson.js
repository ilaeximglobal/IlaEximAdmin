
app.controller('keyperson', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'keyperson';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankKeyperson = KeyPerson.blankKeyperson();
	$scope.newKeyperson = KeyPerson.blankNewKeyperson();

	$scope.loadKeypersonData = function () {
		dataService.getKeyperson(
			jwt,
			function (data) {
				$scope.keypersons = [];
				if(data.data.data.length>=0){
					$scope.keypersons = data.data.data.map(q => KeyPerson.fromData(KeyPerson.blankKeyperson(), q));
				}
				console.log($scope.keypersons);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.keypersons = [];
	$scope.loadKeypersonData();

	$scope.updateKeyperson = function (keyperson) {
		let [onSuccess,onError] = getUpdateDataHandler(keyperson,$timeout,function(){
			$scope.loadKeypersonData();
		});
		dataService.updateKeyperson(KeyPerson.toData(KeyPerson.blankKeyperson(),keyperson), jwt, onSuccess, onError);

	};

	$scope.createKeyperson = function () {
		var keyperson = $scope.newKeyperson;
		let [onSuccess,onError] = getCreateDataHandler(keyperson,$timeout,function(){
			$scope.loadKeypersonData();
			$scope.resetNewKeyperson();
		});
		dataService.createKeyperson(KeyPerson.toData(KeyPerson.blankKeyperson(),keyperson), jwt, onSuccess, onError);
	};

	$scope.deleteKeyperson = function (keyperson) {
		let [onSuccess,onError] = getDeleteDataHandler(faq,$timeout,function(){
			$scope.loadKeypersonData();
		});
		dataService.deleteKeyperson(KeyPerson.toData(KeyPerson.blankKeyperson(),keyperson), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewKeyperson = function () {
		$scope.newKeyperson = KeyPerson.blankNewKeyperson();
	};
}]);