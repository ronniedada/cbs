'use strict';

var createSVG, updateChart, bar, line;

angular.module('cbstats.directives', [])
  .directive('chart', [
   function() {
    return {
        restrict: 'E',
        scope: {
             val: '='
        },
        link: function(scope, elm, attrs) {
            createSVG(scope, elm);
            return scope.$watch('val', updateChart, true);
        }
    };
  }]);

function createSVG(scope, elm) {
	scope.margin = {top: 20, right: 20, bottom: 30, left: 40};
	scope.width = 960 - scope.margin.left - scope.margin.right;
    scope.height = 500 - scope.margin.top - scope.margin.bottom;
    scope.digitFormat = d3.format('s');
    if (!(scope.svg !== null)) {
        scope.svg = d3.select(elm[0]).append('svg')
                        .attr('width', scope.width + scope.margin.left + scope.margin.right)
                        .attr('height', scope.height + scope.margin.top + scope.margin.bottom)
                        .append('g')
                        .attr('transform', 'translate(' + scope.margin.left + ',' + scope.margin.top + ')');
    }
}

function updateChart(newData, oldData, scope) {
	if (newData === undefined || newData === oldData) {
		return;
	}
	
	var type = newData.type;
	var data = d3.csv.parse(newData.data);
	
	switch(type) {
	case 'bar':
		bar(data, scope);
		break;
	case 'line':
		line(data, scope);
		break;
	default:
		bar(data, scope);
	}
}

function bar(data, scope) {
	
	scope.x = d3.scale.ordinal()
		.rangeRoundBands([0, scope.width], 0.1);

	scope.y = d3.scale.linear()
		.range([scope.height, 0]);
	
	scope.xAxis = d3.svg.axis()
		.scale(scope.x)
		.orient('bottom');

	scope.yAxis = d3.svg.axis()
		.scale(scope.y)
		.orient('left')
		.tickFormat(scope.digitFormat);
	
	data.forEach(function(d) {
		d.y = +d.y;
	});
	
	scope.x.domain(data.map(function(d) { return d.x; }));
	scope.y.domain([0, d3.max(data, function(d) { return d.y; })]);
	
	var axes = scope.svg.selectAll("text").data(data);

	scope.svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + scope.height + ')')
		.call(scope.xAxis);
  
	scope.svg.append('g')
		.attr('class', 'y axis')
		.call(scope.yAxis);

  var rect = scope.svg.selectAll('.bar').data(data);

  rect.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return scope.x(d.x); })
        .attr('width', scope.x.rangeBand())
        .attr('y', function(d) { return scope.y(d.y); })
        .attr('height', function(d) { return scope.height - scope.y(d.y); });
 
  rect.exit().remove();

  rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr('class', 'bar')
        .attr('x', function(d) { return scope.x(d.x); })
        .attr('width', scope.x.rangeBand())
        .transition()
        .attr('y', function(d) { return scope.y(d.y); })
        .attr('height', function(d) { return scope.height - scope.y(d.y); });
	
	scope.svg.select(".x.axis").transition().call(scope.xAxis);
	scope.svg.select(".y.axis").transition().call(scope.yAxis);
}

function line(data, scope) {
	
	scope.x = d3.scale.linear()
		.range([0, scope.width]);

	scope.y = d3.scale.linear()
		.range([scope.height, 0]);
	
	scope.xAxis = d3.svg.axis()
		.scale(scope.x)
		.orient('bottom');

	scope.yAxis = d3.svg.axis()
		.scale(scope.y)
		.orient('left')
		.tickFormat(scope.digitFormat);
	
	data.forEach(function(d) {
		d.x = +d.x;
		d.y = +d.y;
	});
	
	scope.x.domain(d3.extent(data, function(d) { return d.x; }));
	scope.y.domain(d3.extent(data, function(d) { return d.y; }));
	
	var axes = scope.svg.selectAll("text").data(data);
    
	scope.svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + scope.height + ')')
		.call(scope.xAxis);
  
	scope.svg.append('g')
		.attr('class', 'y axis')
		.call(scope.yAxis);
	
	var l = d3.svg.line().x(function(d) { return scope.x(d.x); })
						 .y(function(d) { return scope.y(d.y); });
	
	scope.svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", l);
	
	scope.svg.select(".x.axis").transition().call(scope.xAxis);
	scope.svg.select(".y.axis").transition().call(scope.yAxis);
}