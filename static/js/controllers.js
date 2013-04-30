'use strict';

var CONFIG = {
		'os_type': { 'name': 'OS Distribution', 'src': '/api/bar/ram/os_ram_sizes/?y_index=0', 'type': 'bar', 'args': {}},
		'ram_sizes': { 'name': 'RAM Size', 'src': '/api/bar/ram/os_ram_sizes/?y_index=1', 'type': 'bar', 'args': {}},
		'contact_by_date': { 'name': 'Contact By Date', 'src': '/api/line/overtime/contact_by_date/?y_index=0', 'type': 'line', 'args': {'xparse': 'time'}},
		'browser_by_cluster': {'name': "Browser By Cluster", 'src': '/api/stackedbar/browser/nodes_counts/?group_level=2&y_index=0&x_index=1&range_index=0&range=8', 'type': 'stackedbar', 'args': {}},
		'os_by_cluster': {'name': "OS By Cluster", 'src': '/api/stackedbar/os/os_nodes/?group_level=2&y_index=1&x_index=0&range_index=1&range=8', 'type': 'stackedbar', 'args': {}}
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
		case 'stackedbar':
			StackedBarCtrl(dic.src, dic.args, $scope, $http);
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

function StackedBarCtrl(src, args, $scope, $http){
    $scope.data = $http.get(src).then(function(resp) {
        return {'type': 'stackedbar', 'data': resp.data, 'args': args};
    });
}