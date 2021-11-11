
app.controller('productlink', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Product Link';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankProductLink = ProductLink.blankProductLink();
	$scope.newProductLink = ProductLink.blankNewProductLink();

	$scope.showingSubProductIndex = 0;

	$scope.loadProductLinkData = function () {
		dataService.getProductLink(
			jwt,
			function (data) {
				$scope.productLinks = [];
				if(data.data.data.length>=0){
					$scope.productLinks = data.data.data.map(q => ProductLink.fromData(ProductLink.blankProductLink(), q));
					$scope.loadSubProductBriefList();
				}
				console.log($scope.productLinks);
			},
			function (e) { console.error(e); }
		);
	}
	
	$scope.loadSubProductBriefList = function () {
		dataService.getSubProductBriefList(
			jwt,
			function (data) {
				$scope.allsubproducts = [];
				if(data.data.data.length>=0){
					$scope.allsubproducts = data.data.data;
					$scope.subProductArray = addItemsToArray($scope.allsubproducts, 'id', $scope.productLinks, 'product_id');
					$scope.showItems($scope.showingSubProductIndex);
				}
			},
			function (e) { console.error(e); }
		);
	};

	$scope.productLinks = [];
	$scope.loadProductLinkData();

	$scope.showItems = function (index) {
		if ($scope.subProductArray.length > 0 && $scope.subProductArray.length > index && $scope.subProductArray[index] != undefined) {
			$scope.showingSubProduct = $scope.subProductArray[index];
			$scope.showingSubProductIndex = index;
			$scope.newProductLink.single_selection_product_id = $scope.showingSubProduct.id;
		} else {
			$scope.showingSubProduct = {};
		}
	};

	$scope.updateProductLink = function (productLink) {
		let [onSuccess,onError] = getUpdateDataHandler(productLink,$timeout,function(){
			$scope.loadProductLinkData();
		});
		dataService.updateProductLink(ProductLink.toData(ProductLink.blankProductLink(),productLink), jwt, onSuccess, onError);

	};

	$scope.createProductLink = function () {
		var productLink = $scope.newProductLink;
		let [onSuccess,onError] = getCreateDataHandler(productLink,$timeout,function(){
			$scope.loadProductLinkData();
			$scope.resetNewProductLink();
		});
		dataService.createProductLink(ProductLink.toData(ProductLink.blankProductLink(),productLink), jwt, onSuccess, onError);
	};

	$scope.deleteProductLink = function (productLink) {
		let [onSuccess,onError] = getDeleteDataHandler(productLink,$timeout,function(){
			$scope.loadProductLinkData();
		});
		dataService.deleteProductLink(ProductLink.toData(ProductLink.blankProductLink(),productLink), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewProductLink = function () {
		$scope.newProductLink = ProductLink.blankNewProductLink();
	};
}]);