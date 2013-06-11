'use strict';

// TODO: move to a saparate file
var CONFIG = {
		'os_type': { 'name': 'OS Distribution', 'src': '/api/bar/ram/os_ram_sizes/?group_level=1',
					 'type': 'bar', 'args': {}},
		'version': { 'name': 'Version Distribution', 'src': '/api/bar/version/version/?group_level=1',
					 'type': 'bar', 'args': {}},
		'version_by_os': { 'name': 'Version By OS', 'src': '/api/stackedbar/version/os_version/?group_level=2&y_index=0&x_index=1',
					       'type': 'stackedbar', 'args': {}},
		'contact_by_date': { 'name': 'Contact By Date', 'src': '/api/line/overtime/contact_by_date/?group_level=1',
							 'type': 'line', 'args': {'xparse': 'time'}},
		'contact_by_day': {'name': "Contact By Day of Week", 'src': '/api/bar/overtime/contact_by_day_hour_size/?group_level=1',
							'type': 'bar', 'args': {'xparse': 'day'}},
		'contact_by_hour': {'name': "Contact By Hour of Day", 'src': '/api/bar/overtime/contact_by_hour/?group_level=1',
						    'type': 'bar', 'args': {'xparse': 'hour'}},
		'browser_by_cluster': {'name': "Browser By Cluster", 'src': '/api/stackedbar/browser/nodes_counts/?group_level=2&y_index=0&x_index=1&range_index=0&range=8',
							   'type': 'stackedbar', 'args': {}},
		'os_by_cluster': {'name': "OS By Cluster", 'src': '/api/stackedbar/os/os_nodes/?group_level=2&y_index=1&x_index=0&range_index=1&range=8',
						  'type': 'stackedbar', 'args': {}},
		'worldmap': {'name': "Geo Distribution", 'src': '/api/worldmap/geo/location_os_size/?group_level=4',
						  'type': 'worldmap', 'args': {}}
};

function ChartCtrl($scope, $routeParams, $http) {
	$scope.config = CONFIG;
	var path = $routeParams.path;
	
	if (path !== undefined && path in CONFIG) {
		var dic  = CONFIG[path];
		$scope.name = dic.name
	    $scope.data = $http.get(dic.src).then(function(resp) {
	        return {'type': dic.type, 'data': resp.data, 'args': dic.args};
	    });
	}
}