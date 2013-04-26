'use strict';

var CONFIG = {
		'os_type': { 'name': 'OS Distribution', 'src': '/api/bar/ram/os_ram_sizes/0/', 'type': 'bar', 'args': {}},
		'ram_sizes': { 'name': 'RAM Size', 'src': '/api/bar/ram/os_ram_sizes/1/', 'type': 'bar', 'args': {}},
		'contact_by_date': { 'name': 'Contact By Date', 'src': '/api/line/overtime/contact_by_date/0/', 'type': 'line', 'args': {'xparse': 'time'}}
};

function ChartCtrl($scope, $routeParams, $http) {
	$scope.config = CONFIG;
	var path = $routeParams.path;
	
	if (path !== undefined && path in CONFIG) {
		var dic  = CONFIG[path];
		switch(dic.type) {
		case 'bar':
			BarCtrl(dic.src, dic.args, $scope, $http);
			break;
		case 'line':
			LineCtrl(dic.src, dic.args, $scope, $http);
			break;
		default:
			BarCtrl(dic.src, dic.args, $scope, $http);
		}
	}
}

function BarCtrl(src, args, $scope,  $http) {
    $scope.data = $http.get(src).then(function(resp) {
        return {'type': 'bar', 'data': resp.data, 'args': args};
    });
}

function LineCtrl(src, args, $scope, $http){
    $scope.data = $http.get(src).then(function(resp) {
        return {'type': 'line', 'data': resp.data, 'args': args};
    });
}