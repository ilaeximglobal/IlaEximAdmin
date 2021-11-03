
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
		index = parseInt(index);
		destIndex = parseInt(destIndex);

		if(isNaN(index)) return;
		if(isNaN(destIndex)) return;
		if (index < 0 || index >= $scope.products.length) return;
		if (destIndex < 0 || destIndex >= $scope.products.length) return;
		console.log(index,destIndex);

		let product = $scope.products[index];
		let nextProduct = $scope.products[destIndex];

		let temp = parseInt(product.item_order);
		product.item_order = parseInt(nextProduct.item_order);
		nextProduct.item_order = temp;

		console.log(product.item_order,nextProduct.item_order);
		$scope.updateProductBulk([product,nextProduct]);
	};

	$scope.moveTo = function (index,destIndex) {
		index = parseInt(index);
		destIndex = parseInt(destIndex);

		if(isNaN(index)) return;
		if(isNaN(destIndex)) return;
		if (index < 0 || index >= $scope.products.length) return;
		if (destIndex < 0 || destIndex >= $scope.products.length) return;
		if (index==destIndex) return;
		console.log(index,destIndex);

		console.log($scope.products.map(p=>p.toDataString()));
		if(index<destIndex){
			for(let i=index+1;i<=destIndex;i++){
				$scope.products[i].item_order = i-1;
			}
			$scope.products[index].item_order = destIndex;
		}else{
			for(let i=destIndex;i<index;i++){
				$scope.products[i].item_order = i+1;
			}
			$scope.products[index].item_order = destIndex;
		}

		console.log($scope.products.map(p=>p.toDataString()));
		$scope.updateProductBulk($scope.products);

		// if(!destIndex) destIndex = index+1;
		// if (index == $scope.products.length - 1) return;

		// let product = $scope.products[index];
		// let nextProduct = $scope.products[destIndex];

		// let temp = parseInt(product.item_order);
		// product.item_order = parseInt(nextProduct.item_order);
		// nextProduct.item_order = temp;

		// console.log(product.item_order,nextProduct.item_order);
		// $scope.updateProductBulk([product,nextProduct]);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewProduct = function () {
		$scope.newProduct = Product.blankNewProduct();
	};
}]);