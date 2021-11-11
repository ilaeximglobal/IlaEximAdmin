
app.controller('subproduct', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Sub Products';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankSubProduct = SubProduct.blankSubProduct();
	$scope.newSubProduct = SubProduct.blankNewSubProduct();

	$scope.sorting = false;

	$scope.showingSubProductIndex = 0;

	$scope.loadSubProductData = function () {
		dataService.getSubProduct(
			jwt,
			function (data) {
				console.log(data);
				$scope.subProducts = [];
				if(data.data.data.length>=0){
					$scope.subProducts = data.data.data.map(q => SubProduct.fromData(SubProduct.blankSubProduct(), q));
					$scope.subProducts.sort((a,b)=>a.item_order-b.item_order);
					$scope.loadProductBriefList();
				}
				console.log($scope.subProducts);
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
					$scope.productArray = addItemsToArray($scope.allproducts, 'id', $scope.subProducts, 'main_product_id');
					$scope.showItems($scope.showingSubProductIndex);
				}
				console.log($scope.allproducts);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.subProducts = [];
	$scope.loadSubProductData();

	$scope.showItems = function (index) {
		if ($scope.productArray.length > 0 && $scope.productArray.length > index && $scope.productArray[index] != undefined) {
			$scope.showingSubProduct = $scope.productArray[index];
			$scope.showingSubProductIndex = index;
			$scope.newSubProduct.single_selection_main_product_id = $scope.showingSubProduct.id;
		} else {
			$scope.showingSubProduct = {};
		}
	};

	$scope.updateSubProduct = function (subProduct) {
		let [onSuccess,onError] = getUpdateDataHandler(subProduct,$timeout,function(){
			$scope.loadSubProductData();
		});
		console.log('subProduct', SubProduct.toData(SubProduct.blankSubProduct(),subProduct));
		dataService.updateSubProduct(SubProduct.toData(SubProduct.blankSubProduct(),subProduct), jwt, onSuccess, onError);
	};

	$scope.updateSubProductBulk = function (subProducts) {
		let [onSuccess,onError] = getUpdateDataHandlerBulk(subProducts,$timeout,function(){
			$scope.loadSubProductData();
		});
		subProducts.map(p=>SubProduct.toData(SubProduct.blankSubProduct(),p));
		dataService.updateSubProductBulk(subProducts, jwt, onSuccess, onError);
	};

	$scope.createSubProduct = function () {
		var subProduct = $scope.newSubProduct;

		let productsLength = $scope.productArray[$scope.showingSubProductIndex].items.length;
		subProduct.item_order = productsLength;
		
		let [onSuccess,onError] = getCreateDataHandler(subProduct,$timeout,function(){
			$scope.loadSubProductData();
			$scope.resetNewSubProduct();
		});
		console.log('subProduct', SubProduct.toData(SubProduct.blankSubProduct(),subProduct));
		dataService.createSubProduct(SubProduct.toData(SubProduct.blankSubProduct(),subProduct), jwt, onSuccess, onError);
	};

	$scope.deleteSubProduct = function (subProduct) {
		let [onSuccess,onError] = getDeleteDataHandler(subProduct,$timeout,function(){
			$scope.loadSubProductData();
		});
		dataService.deleteSubProduct(SubProduct.toData(SubProduct.blankSubProduct(),subProduct), jwt, onSuccess, onError);
	};

	$scope.moveUp = function (index,destIndex) {
		if(!destIndex) destIndex = index-1;
		if (index == 0) return;

		$scope.swapWith(index,destIndex);
	};

	$scope.moveDown = function (index,destIndex) {
		if(!destIndex) destIndex = index+1;
		if (index == $scope.subProducts.length - 1) return;

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
		let products = $scope.productArray[$scope.showingSubProductIndex].items;
		let updatable = swapWith(products,index,destIndex);
		$scope.updateSubProductBulk(updatable);
	};

	$scope.moveTo = function (index,destIndex) {
		let products = $scope.productArray[$scope.showingSubProductIndex].items;
		let updatable = moveTo(products,index,destIndex);
		$scope.updateSubProductBulk(updatable);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewSubProduct = function () {
		$scope.newSubProduct = SubProduct.blankNewSubProduct();
	};
}]);