
app.controller('diamonditem', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Diamond Item';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankDiamondItem = DiamondItem.blankDiamondItem();
	$scope.newDiamondItem = DiamondItem.blankNewDiamondItem();

	$scope.sorting = false;

	$scope.showingSubProductIndex = 0;

	$scope.loadDiamondItemData = function () {
		dataService.getDiamondItem(
			jwt,
			function (data) {
				console.log(data);
				$scope.diamondItems = [];
				if(data.data.data.length>=0){
					$scope.diamondItems = data.data.data.map(q => DiamondItem.fromData(DiamondItem.blankDiamondItem(), q));
					$scope.diamondItems.sort((a,b)=>a.item_order-b.item_order);
					$scope.loadSubProductArray();
				}
				console.log($scope.diamondItems);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.loadSubProductArray = function () {
		dataService.getDiamondSubProductBriefList(
			jwt,
			function (data) {
				$scope.allsubproducts = [];
				if(data.data.data.length>=0){
					$scope.allsubproducts = data.data.data;
					$scope.subProductArray = addItemsToArray($scope.allsubproducts, 'id', $scope.diamondItems, 'subproduct_id');
					$scope.showItems($scope.showingSubProductIndex);
				}
			},
			function (e) { console.error(e); }
		);
	}

	$scope.diamondItems = [];
	$scope.loadDiamondItemData();

	$scope.showItems = function (index) {
		if ($scope.subProductArray.length > 0 && $scope.subProductArray.length > index && $scope.subProductArray[index] != undefined) {
			$scope.showingDiamondItem = $scope.subProductArray[index];
			$scope.showingSubProductIndex = index;
			$scope.newDiamondItem.single_selection_subproduct_id = $scope.showingDiamondItem.id;
		} else {
			$scope.showingDiamondItem = {};
		}
	};

	$scope.updateDiamondItem = function (diamondItem) {
		let [onSuccess,onError] = getUpdateDataHandler(diamondItem,$timeout,function(){
			$scope.loadDiamondItemData();
		});
		console.log('diamondItem', DiamondItem.toData(DiamondItem.blankDiamondItem(),diamondItem));
		dataService.updateDiamondItem(DiamondItem.toData(DiamondItem.blankDiamondItem(),diamondItem), jwt, onSuccess, onError);
	};

	$scope.updateDiamondItemBulk = function (diamondItems) {
		let [onSuccess,onError] = getUpdateDataHandlerBulk(diamondItems,$timeout,function(){
			$scope.loadDiamondItemData();
		});
		diamondItems.map(p=>DiamondItem.toData(DiamondItem.blankDiamondItem(),p));
		dataService.updateDiamondItemBulk(diamondItems, jwt, onSuccess, onError);
	};

	$scope.createDiamondItem = function () {
		var diamondItem = $scope.newDiamondItem;

		let productsLength = $scope.subProductArray[$scope.showingSubProductIndex].items.length;
		diamondItem.item_order = productsLength;

		let [onSuccess,onError] = getCreateDataHandler(diamondItem,$timeout,function(){
			$scope.loadDiamondItemData();
			$scope.resetNewDiamondItem();
		});
		console.log('diamondItem', DiamondItem.toData(DiamondItem.blankDiamondItem(),diamondItem));
		dataService.createDiamondItem(DiamondItem.toData(DiamondItem.blankDiamondItem(),diamondItem), jwt, onSuccess, onError);
	};

	$scope.deleteDiamondItem = function (diamondItem) {
		let [onSuccess,onError] = getDeleteDataHandler(diamondItem,$timeout,function(){
			console.log('delete');
			$scope.loadDiamondItemData();
		});
		dataService.deleteDiamondItem(DiamondItem.toData(DiamondItem.blankDiamondItem(),diamondItem), jwt, onSuccess, onError);
	};

	$scope.moveUp = function (index,destIndex) {
		if(!destIndex) destIndex = index-1;
		if (index == 0) return;

		$scope.swapWith(index,destIndex);
	};

	$scope.moveDown = function (index,destIndex) {
		if(!destIndex) destIndex = index+1;
		if (index == $scope.diamondItems.length - 1) return;

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
		$scope.updateDiamondItemBulk(updatable);
	};

	$scope.moveTo = function (index,destIndex) {
		let products = $scope.subProductArray[$scope.showingSubProductIndex].items;
		let updatable = moveTo(products,index,destIndex);
		$scope.updateDiamondItemBulk(updatable);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewDiamondItem = function () {
		$scope.newDiamondItem = DiamondItem.blankNewDiamondItem();
	};
}]);