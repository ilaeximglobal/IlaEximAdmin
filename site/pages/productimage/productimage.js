
app.controller('productimage', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Product Images';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankProductImage = ProductImage.blankProductImage();
	$scope.newProductImage = ProductImage.blankNewProductImage();

	$scope.sorting = false;

	$scope.showingSubProductIndex = 0;

	$scope.loadProductImageData = function () {
		dataService.getProductImage(
			jwt,
			function (data) {
				console.log(data);
				$scope.productImages = [];
				if(data.data.data.length>=0){
					$scope.productImages = data.data.data.map(q => ProductImage.fromData(ProductImage.blankProductImage(), q));
					$scope.productImages.sort((a,b)=>a.item_order-b.item_order);
					$scope.loadSubProductArray();
				}
				console.log($scope.productImages);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.loadSubProductArray = function () {
		dataService.getSubProductBriefList(
			jwt,
			function (data) {
				$scope.allsubproducts = [];
				if(data.data.data.length>=0){
					$scope.allsubproducts = data.data.data;
					$scope.subProductArray = addItemsToArray($scope.allsubproducts, 'id', $scope.productImages, 'product_id');
					$scope.showItems($scope.showingSubProductIndex);
					console.log($scope.subProductArray);
				}
			},
			function (e) { console.error(e); }
		);
	}

	$scope.productImages = [];
	$scope.loadProductImageData();

	$scope.showItems = function (index) {
		if ($scope.subProductArray.length > 0 && $scope.subProductArray.length > index && $scope.subProductArray[index] != undefined) {
			$scope.showingProductImage = $scope.subProductArray[index];
			$scope.showingSubProductIndex = index;
			$scope.newProductImage.single_selection_product_id = $scope.showingProductImage.id;
		} else {
			$scope.showingProductImage = {};
		}
	};

	$scope.updateProductImage = function (productImage) {
		let [onSuccess,onError] = getUpdateDataHandler(productImage,$timeout,function(){
			$scope.loadProductImageData();
		});
		console.log('productImage', ProductImage.toData(ProductImage.blankProductImage(),productImage));
		dataService.updateProductImage(ProductImage.toData(ProductImage.blankProductImage(),productImage), jwt, onSuccess, onError);
	};

	$scope.updateProductImageBulk = function (productImages) {
		let [onSuccess,onError] = getUpdateDataHandlerBulk(productImages,$timeout,function(){
			$scope.loadProductImageData();
		});
		productImages.map(p=>ProductImage.toData(ProductImage.blankProductImage(),p));
		dataService.updateProductImageBulk(productImages, jwt, onSuccess, onError);
	};

	$scope.createProductImage = function () {
		var productImage = $scope.newProductImage;

		let productsLength = $scope.subProductArray[$scope.showingSubProductIndex].items.length;
		productImage.item_order = productsLength;

		let [onSuccess,onError] = getCreateDataHandler(productImage,$timeout,function(){
			$scope.loadProductImageData();
			$scope.resetNewProductImage();
		});
		console.log('productImage', ProductImage.toData(ProductImage.blankProductImage(),productImage));
		dataService.createProductImage(ProductImage.toData(ProductImage.blankProductImage(),productImage), jwt, onSuccess, onError);
	};

	$scope.deleteProductImage = function (productImage) {
		let [onSuccess,onError] = getDeleteDataHandler(productImage,$timeout,function(){
			console.log('delete');
			$scope.loadProductImageData();
		});
		dataService.deleteProductImage(ProductImage.toData(ProductImage.blankProductImage(),productImage), jwt, onSuccess, onError);
	};

	$scope.moveUp = function (index,destIndex) {
		if(!destIndex) destIndex = index-1;
		if (index == 0) return;

		$scope.swapWith(index,destIndex);
	};

	$scope.moveDown = function (index,destIndex) {
		if(!destIndex) destIndex = index+1;
		if (index == $scope.productImages.length - 1) return;

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
		let products = $scope.subProductArray[$scope.showingSubProductIndex].items;
		let updatable = swapWith(products,index,destIndex);
		$scope.updateProductImageBulk(updatable);
	};

	$scope.moveTo = function (index,destIndex) {
		let products = $scope.subProductArray[$scope.showingSubProductIndex].items;
		let updatable = moveTo(products,index,destIndex);
		$scope.updateProductImageBulk(updatable);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewProductImage = function () {
		$scope.newProductImage = ProductImage.blankNewProductImage();
	};
}]);