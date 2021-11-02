
app.controller('review', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Review';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankReview = Review.blankReview();
	$scope.newReview = Review.blankNewReview();

	$scope.loadReviewData = function () {
		dataService.getReview(
			jwt,
			function (data) {
				console.log(data);
				$scope.reviews = [];
				if(data.data.data.length>=0){
					$scope.reviews = data.data.data.map(q => Review.fromData(Review.blankReview(), q));
				}
				console.log($scope.reviews);
			},
			function (e) { console.error(e); }
		);
		dataService.getProductBriefList(
			jwt,
			function (data) {
				console.log(data);
				$scope.allproducts = [];
				if(data.data.data.length>=0){
					$scope.allproducts = data.data.data;
				}
				console.log($scope.allproducts);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.reviews = [];
	$scope.loadReviewData();

	$scope.updateReview = function (review) {
		let [onSuccess,onError] = getUpdateDataHandler(review,$timeout,function(){
			$scope.loadReviewData();
		});
		console.log('review', Review.toData(Review.blankReview(),review));
		dataService.updateReview(Review.toData(Review.blankReview(),review), jwt, onSuccess, onError);
	};

	$scope.createReview = function () {
		var review = $scope.newReview;
		let [onSuccess,onError] = getCreateDataHandler(review,$timeout,function(){
			$scope.loadReviewData();
			$scope.resetNewReview();
		});
		dataService.createReview(Review.toData(Review.blankReview(),review), jwt, onSuccess, onError);
	};

	$scope.deleteReview = function (review) {
		let [onSuccess,onError] = getDeleteDataHandler(review,$timeout,function(){
			$scope.loadReviewData();
		});
		dataService.deleteReview(Review.toData(Review.blankReview(),review), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewReview = function () {
		$scope.newReview = Review.blankNewReview();
	};
}]);