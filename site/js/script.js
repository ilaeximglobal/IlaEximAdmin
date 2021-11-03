var app = angular.module('admin', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider

		.when('/', {
			templateUrl: 'site/pages/home/home.html',
			controller: 'home'
		})

		.when('/login', {
			templateUrl: 'site/pages/login/login.html',
			controller: 'login'
		})

		.when('/about', {
			templateUrl: 'site/pages/about/about.html',
			controller: 'about'
		})

		.when('/certificate', {
			templateUrl: 'site/pages/certificate/certificate.html',
			controller: 'certificate'
		})
		
		.when('/keyperson', {
			templateUrl: 'site/pages/keyperson/keyperson.html',
			controller: 'keyperson'
		})

		.when('/product', {
			templateUrl: 'site/pages/product/product.html',
			controller: 'product'
		})

		.when('/faq', {
			templateUrl: 'site/pages/faq/faq.html',
			controller: 'faq'
		})

		.when('/diamondfaq', {
			templateUrl: 'site/pages/faq/faq.html',
			controller: 'diamondfaq'
		})

		.when('/blog', {
			templateUrl: 'site/pages/blog/blog.html',
			controller: 'blog'
		})

		.when('/review', {
			templateUrl: 'site/pages/review/review.html',
			controller: 'review'
		})

		.otherwise({ redirectTo: '/' });
});

app.directive('postrenderAction', postrenderAction);

function postrenderAction($timeout) {
	var directive = {
		restrict: 'A',
		priority: 101,
		link: link
	};
	return directive;
	function link(scope, element, attrs) {
		$timeout(function () {
			scope.$evalAsync(attrs.postrenderAction);
		}, 0);
	}
}

app.directive("autoHeight", function ($timeout) {
	return {
		restrict: 'A',
		link: function ($scope, element) {
			if (element[0].scrollHeight < 30) {
				element[0].style.height = 30;
			} else {
				element[0].style.height = (element[0].scrollHeight) + "px";
			}

			var resize = function () {
				return element[0].style.height = "" + element[0].scrollHeight + "px";
			};

			element.on("blur keyup change", resize);
			$timeout(resize, 0);
		}
	}
}
);

app.directive("fileread", [function () {
	return {
		scope: {
			fileread: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.fileread = {
							name: changeEvent.target.files[0].name,
							data: loadEvent.target.result
						};
					});
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	}
}]);