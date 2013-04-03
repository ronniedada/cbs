'use strict';

angular.module('cbstats', ['cbstats.directives']).
  config(['$routeProvider', '$locationProvider', 
          function($routeProvider, $locationProvider) {
    $routeProvider.when('/chart/:path/', {templateUrl: '/static/partials/chart.html', controller: ChartCtrl});
    $routeProvider.otherwise({redirectTo: '/chart/os_type/'});
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }]);