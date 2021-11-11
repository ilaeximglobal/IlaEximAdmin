
app.controller('diamondsubproduct', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Diamond Sub Products';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankSubProduct = DiamondSubProduct.blankSubProduct();
	$scope.newSubProduct = DiamondSubProduct.blankNewSubProduct();

	$scope.sorting = false;

	$scope.showingSubProductIndex = 0;

	$scope.loadSubProductData = function () {
		dataService.getDiamondSubProduct(
			jwt,
			function (data) {
				console.log(data);
				$scope.subProducts = [];
				if(data.data.data.length>=0){
					$scope.subProducts = data.data.data.map(q => DiamondSubProduct.fromData(DiamondSubProduct.blankSubProduct(), q));
					$scope.subProducts.sort((a,b)=>a.item_order-b.item_order);
					$scope.loadSubProductBriefList();
				}
				console.log($scope.subProducts);
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
					$scope.allsubproducts = $scope.allsubproducts.filter(p=>p.main_product_id==4);
					$scope.subProductArray = addItemsToArray($scope.allsubproducts, 'id', $scope.subProducts, 'product_id');
					$scope.showItems($scope.showingSubProductIndex);
				}
			},
			function (e) { console.error(e); }
		);
	};

	$scope.subProducts = [];
	$scope.loadSubProductData();

	$scope.showItems = function (index) {
		if ($scope.subProductArray.length > 0 && $scope.subProductArray.length > index && $scope.subProductArray[index] != undefined) {
			$scope.showingSubProduct = $scope.subProductArray[index];
			$scope.showingSubProductIndex = index;
			$scope.newSubProduct.single_selection_product_id = $scope.showingSubProduct.id;
		} else {
			$scope.showingSubProduct = {};
		}
	};

	$scope.updateSubProduct = function (diamondSubProduct) {
		let [onSuccess,onError] = getUpdateDataHandler(diamondSubProduct,$timeout,function(){
			$scope.loadSubProductData();
		});
		console.log('diamondSubProduct', DiamondSubProduct.toData(DiamondSubProduct.blankSubProduct(),diamondSubProduct));
		dataService.updateDiamondSubProduct(DiamondSubProduct.toData(DiamondSubProduct.blankSubProduct(),diamondSubProduct), jwt, onSuccess, onError);
	};

	$scope.updateSubProductBulk = function (subProducts) {
		let [onSuccess,onError] = getUpdateDataHandlerBulk(subProducts,$timeout,function(){
			$scope.loadSubProductData();
		});
		subProducts.map(p=>DiamondSubProduct.toData(DiamondSubProduct.blankSubProduct(),p));
		dataService.updateDiamondSubProductBulk(subProducts, jwt, onSuccess, onError);
	};

	$scope.createSubProduct = function () {
		var diamondSubProduct = $scope.newSubProduct;

		let productsLength = $scope.subProductArray[$scope.showingSubProductIndex].items.length;
		diamondSubProduct.item_order = productsLength;
		
		let [onSuccess,onError] = getCreateDataHandler(diamondSubProduct,$timeout,function(){
			$scope.loadSubProductData();
			$scope.resetNewSubProduct();
		});
		console.log('diamondSubProduct', DiamondSubProduct.toData(DiamondSubProduct.blankSubProduct(),diamondSubProduct));
		dataService.createDiamondSubProduct(DiamondSubProduct.toData(DiamondSubProduct.blankSubProduct(),diamondSubProduct), jwt, onSuccess, onError);
	};

	$scope.deleteSubProduct = function (diamondSubProduct) {
		let [onSuccess,onError] = getDeleteDataHandler(diamondSubProduct,$timeout,function(){
			$scope.loadSubProductData();
		});
		dataService.deleteDiamondSubProduct(DiamondSubProduct.toData(DiamondSubProduct.blankSubProduct(),diamondSubProduct), jwt, onSuccess, onError);
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
		let products = $scope.subProductArray[$scope.showingSubProductIndex].items;
		let updatable = swapWith(products,index,destIndex);
		$scope.updateSubProductBulk(updatable);
	};

	$scope.moveTo = function (index,destIndex) {
		let products = $scope.subProductArray[$scope.showingSubProductIndex].items;
		let updatable = moveTo(products,index,destIndex);
		$scope.updateSubProductBulk(updatable);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewSubProduct = function () {
		$scope.newSubProduct = DiamondSubProduct.blankNewSubProduct();
	};
}]);