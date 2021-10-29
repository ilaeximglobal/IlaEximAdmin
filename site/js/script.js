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

		.when('/keyperson', {
			templateUrl: 'site/pages/keyperson/keyperson.html',
			controller: 'keyperson'
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