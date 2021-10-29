
app.controller('blog', ['$scope', '$location', '$timeout', 'dataService', function ($scope, $location, $timeout, dataService) {
	$scope.sitename = 'ILA EXIM';
	$scope.pagename = 'Blog';
	$scope.setup = function () {
	}
	$scope.finalSetup = function () {
	}

	var jwt = getCookie('PHPSESSID');
	if (jwt == undefined || jwt == null || jwt.length == 0) {
		$location.path("/login");
		return;
	}

	$scope.blankBlog = Blog.blankBlog();
	$scope.newBlog = angular.copy($scope.blankBlog);
	$scope.newBlog.is_showing = true;

	$scope.loadBlogData = function () {
		dataService.getBlog(
			jwt,
			function (data) {
				$scope.blogs = [];
				if(data.data.data.length>=0){
					$scope.blogs = data.data.data.map(q => Blog.fromData(Blog.blankBlog(), q));
				}
				console.log($scope.blogs);
			},
			function (e) { console.error(e); }
		);
	};

	$scope.blogs = [];
	$scope.loadBlogData();

	$scope.updateBlog = function (blog) {
		let [onSuccess,onError] = getUpdateDataHandler(blog,$timeout);
		dataService.updateBlog(Blog.toData(Blog.blankBlog(),blog), jwt, onSuccess, onError);
	};

	$scope.createBlog = function () {
		var blog = $scope.newBlog;
		let [onSuccess,onError] = getCreateDataHandler(blog,$timeout,function(){
			$scope.loadBlogData();
			$scope.resetNewBlog();
		});
		dataService.createBlog(Blog.toData(Blog.blankBlog(),blog), jwt, onSuccess, onError);
	};

	$scope.deleteBlog = function (blog) {
		let [onSuccess,onError] = getDeleteDataHandler(blog,$timeout,function(){
			$scope.loadBlogData();
		});
		dataService.deleteBlog(Blog.toData(Blog.blankBlog(),blog), jwt, onSuccess, onError);
	};

	[$scope.enableUpdateForm, $scope.cancelUpdate, $scope.resetMessage] = getFormHandlers();
	$scope.resetNewBlog = function () {
		$scope.newBlog = angular.copy($scope.blankBlog);
	};
}]);