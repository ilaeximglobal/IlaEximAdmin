/*
< one-way binding
= two-way binding
& function binding
@ pass only strings

*/

// app.directive('navigationbar', function () {
// 	return {
// 		restrict: 'E',
// 		transclude: true,
// 		scope: {isloggedin: "<", logout: '&'},
// 		templateUrl: 'site/components/navigationbar.html',
// 		replace: true
// 	}
// });

app.directive('textupdate', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {id: "@", label: "@", data: "=", disabled: "<", required: "<"},
		templateUrl: 'site/components/textupdate.html',
		replace: true
	}
});
app.directive('textareaupdate', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {id: "@", label: "@", data: "=", disabled: "<", required: "<"},
		templateUrl: 'site/components/textareaupdate.html',
		replace: true
	}
});
app.directive('fileupdate', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {id: "@", label: "@", oldname: "=", newimage:"=", path:"<", ischange: "=", data:"=", disabled: "<", required: "<"},
		templateUrl: 'site/components/fileupdate.html',
		replace: true
	}
});
app.directive('multiselect', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {id: "@", label: "@", data:"=", list:"=", disabled: "<", required: "<"},
		templateUrl: 'site/components/multiselect.html',
		replace: true
	}
});
app.directive('checkboxupdate', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {label: "@", data: "=", disabled: "<"},
		templateUrl: 'site/components/checkboxupdate.html',
		replace: true
	}
});
app.directive('sortcontrol', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {label: "@", data: "=", index:"=", count:"=", moveUp:"&", moveDown:"&", moveToPosition:"&", swapWithPosition:"&", disabled: "<", sortDisabled:"<"},
		templateUrl: 'site/components/sortcontrol.html',
		replace: true
	}
});
app.directive('actionbuttons', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {updateAction: "&", cancelAction: "&", saveAction: "&", deleteAction: "&", disabled: "<"},
		templateUrl: 'site/components/actionbuttons.html',
		replace: true
	}
});
app.directive('message', function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {type: "=", text: "=", clickAction: "&"},
		templateUrl: 'site/components/message.html',
		replace: true
	}
});