'use strict';

var CONFIG = {
		'os_type': { 'name': 'OS Distribution', 'src': '/api/bar/ram/os_ram_sizes/0/0', 'type': 'bar'},
		'ram_sizes': { 'name': 'RAM Size', 'src': '/api/bar/ram/os_ram_sizes/1/0', 'type': 'bar'}
}

function ChartCtrl($scope, $routeParams, $http) {
	$scope.config = CONFIG;
	var path = $routeParams.path;
	
	if (path != undefined && path in CONFIG) {
		var dic  = CONFIG[path];
		switch(dic['type']) {
		case 'bar':
			BarCtrl(dic['src'], $scope, $http);
			break;
		case 'line':
			LineCtrl(dic['src'], $scope, $http);
			break;
		default:
			BarCtrl(dic['src'], $scope, $http);
		}
	}
}

function BarCtrl(src, $scope,  $http) {
    $scope.data = $http.get(src).then(function(resp) {
        return {'type': 'bar', 'data': resp.data};
    });
	
//	$scope.updateBar = function() {
//		$scope.data = $http.get("/api/bar/ram/os_ram_sizes/1/0").then(function(resp) {
//	        return resp.data;
//	    });
//	};	
}

function LineCtrl(src, $scope, $http){
    $scope.data = $http.get(src).then(function(resp) {
        return {'type': 'line', 'data': resp.data};
    });
}