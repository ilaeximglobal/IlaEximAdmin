
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
	$scope.newBlog = Blog.blankNewBlog();

	$scope.loadBlogData = function () {
		dataService.getBlog(
			jwt,
			function (data) {
				console.log(data);
				$scope.blogs = [];
				if(data.data.data.length>=0){
					$scope.blogs = data.data.data.map(q => Blog.fromData(Blog.blankBlog(), q));
					$scope.loadSubProductBriefList();
				}
				console.log($scope.blogs);
			},
			function (e) { console.error(e); }
		);
	}
	
	$scope.loadSubProductBriefList = function () {
		dataService.getSubProductBriefList(
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

	$scope.blogs = [];
	$scope.loadBlogData();

	$scope.updateBlog = function (blog) {
		let [onSuccess,onError] = getUpdateDataHandler(blog,$timeout,function(){
			$scope.loadBlogData();
		});
		console.log('blog', Blog.toData(Blog.blankBlog(),blog));
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
		$scope.newBlog = Blog.blankNewBlog();
	};
}]);