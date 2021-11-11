
app.controller('productitem', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Product Item';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankProductItem = ProductItem.blankProductItem();
	$scope.newProductItem = ProductItem.blankNewProductItem();

	$scope.showingSubProductIndex = 0;

	$scope.loadProductItemData = function () {
		dataService.getProductItem(
			jwt,
			function (data) {
				$scope.productItems = [];
				if (data.data.data.length >= 0) {
					$scope.productItems = data.data.data.map(q => ProductItem.fromData(ProductItem.blankProductItem(), q));
					$scope.loadProductBriefList();
				}
			},
			function (e) { console.error(e); }
		);
	}
	
	$scope.loadProductBriefList = function () {
		dataService.getProductBriefList(
			jwt,
			function (data) {
				console.log(data);
				$scope.allproducts = [];
				if (data.data.data.length >= 0) {
					$scope.allproducts = data.data.data;
					$scope.productArray = addItemsToArray($scope.allproducts, 'id', $scope.productItems, 'main_product_id');
					$scope.showItems($scope.showingSubProductIndex);
				}
				console.log($scope.allproducts);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.productItems = [];
	$scope.loadProductItemData();

	$scope.showItems = function (index) {
		if ($scope.productArray.length > 0 && $scope.productArray.length > index && $scope.productArray[index] != undefined) {
			$scope.showingSubProduct = $scope.productArray[index];
			$scope.showingSubProductIndex = index;
			$scope.newProductItem.single_selection_main_product_id = $scope.showingSubProduct.id;
		} else {
			$scope.showingSubProduct = {};
		}
	};

	$scope.updateProductItem = function (productItem) {
		let [onSuccess, onError] = getUpdateDataHandler(productItem, $timeout, function () {
			$scope.loadProductItemData();
		});
		dataService.updateProductItem(ProductItem.toData(ProductItem.blankProductItem(), productItem), jwt, onSuccess, onError);

	};

	$scope.createProductItem = function () {
		var productItem = $scope.newProductItem;
		console.log(productItem);
		let [onSuccess, onError] = getCreateDataHandler(productItem, $timeout, function () {
			$scope.loadProductItemData();
			$scope.resetNewProductItem();
		});
		dataService.createProductItem(ProductItem.toData(ProductItem.blankProductItem(), productItem), jwt, onSuccess, onError);
	};

	$scope.deleteProductItem = function (productItem) {
		let [onSuccess, onError] = getDeleteDataHandler(productItem, $timeout, function () {
			$scope.loadProductItemData();
		});
		dataService.deleteProductItem(ProductItem.toData(ProductItem.blankProductItem(), productItem), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewProductItem = function () {
		$scope.newProductItem = ProductItem.blankNewProductItem();
	};
}]);