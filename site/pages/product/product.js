
app.controller('product', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Product';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankProduct = Product.blankProduct();
	$scope.newProduct = Product.blankNewProduct();

	$scope.sorting = false;

	$scope.loadProductData = function () {
		dataService.getProduct(
			jwt,
			function (data) {
				console.log(data);
				$scope.products = [];
				if(data.data.data.length>=0){
					$scope.products = data.data.data.map(q => Product.fromData(Product.blankProduct(), q));
					$scope.products.sort((a,b)=>a.item_order-b.item_order);
				}
				console.log($scope.products);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.products = [];
	$scope.loadProductData();

	$scope.updateProduct = function (product) {
		let [onSuccess,onError] = getUpdateDataHandler(product,$timeout,function(){
			$scope.loadProductData();
		});
		console.log('product', Product.toData(Product.blankProduct(),product));
		dataService.updateProduct(Product.toData(Product.blankProduct(),product), jwt, onSuccess, onError);
	};

	$scope.updateProductBulk = function (products) {
		let [onSuccess,onError] = getUpdateDataHandlerBulk(products,$timeout,function(){
			$scope.loadProductData();
		});
		products.map(p=>Product.toData(Product.blankProduct(),p));
		dataService.updateProductBulk(products, jwt, onSuccess, onError);
	};

	$scope.createProduct = function () {
		var product = $scope.newProduct;

		let productsLength = $scope.products.length;
		product.item_order = productsLength;

		let [onSuccess,onError] = getCreateDataHandler(product,$timeout,function(){
			$scope.loadProductData();
			$scope.resetNewProduct();
		});
		console.log('product', Product.toData(Product.blankProduct(),product));
		dataService.createProduct(Product.toData(Product.blankProduct(),product), jwt, onSuccess, onError);
	};

	$scope.deleteProduct = function (product) {
		let [onSuccess,onError] = getDeleteDataHandler(product,$timeout,function(){
			$scope.loadProductData();
		});
		dataService.deleteProduct(Product.toData(Product.blankProduct(),product), jwt, onSuccess, onError);
	};

	$scope.moveUp = function (index,destIndex) {
		if(!destIndex) destIndex = index-1;
		if (index == 0) return;

		$scope.swapWith(index,destIndex);
	};

	$scope.moveDown = function (index,destIndex) {
		if(!destIndex) destIndex = index+1;
		if (index == $scope.products.length - 1) return;

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
		let products = $scope.products;
		let updatable = swapWith(products,index,destIndex);
		$scope.updateProductBulk(updatable);
	};

	$scope.moveTo = function (index,destIndex) {
		let products = $scope.products;
		let updatable = moveTo(products,index,destIndex);
		$scope.updateProductBulk(updatable);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewProduct = function () {
		$scope.newProduct = Product.blankNewProduct();
	};
}]);