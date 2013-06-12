'use strict';

var createSVG, updateChart, bar, line;

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

angular.module('cbs.directives', [])
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
    if (!(scope.svg != null)) {
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
	var args = newData.args;
	
	switch(type) {
	case 'bar':
		bar(data, scope, args);
		break;
	case 'line':
		line(data, scope, args);
		break;
	case 'stackedbar':
		stackedBar(data, scope, args);
		break;
	case 'worldmap':
		worldMap(data, scope, args);
		break;
	default:
		bar(data, scope, args);
	}
}

function bar(data, scope, args) {
	if ('xparse' in args && args.xparse === 'day') {
		data.sort(function(a, b){return a.x - b.x});
		data.forEach(function(d) {
			d.x = weekday[+d.x];
		});
	} else if ('xparse' in args && args.xparse === 'hour') {
		data.sort(function(a, b){return a.x - b.x});
	}
	
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

function line(data, scope, args) {
	
	if ('xparse' in args && args.xparse === 'time') {
		scope.x = d3.time.scale()
		.range([0, scope.width]);
	} else {
		scope.x = d3.scale.linear()
		.range([0, scope.width]);
	}

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
		if ('xparse' in args && args.xparse === 'time') {
			d.x = d3.time.format("%Y-%m-%d").parse(d.x);
		} else {
			d.x = +d.x;
		}
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

function stackedBar(data, scope, args) {
	scope.x = d3.scale.ordinal()
		.rangeRoundBands([0, scope.width], 0.1);

	scope.y = d3.scale.linear()
		.rangeRound([scope.height, 0]);

	scope.color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b",
                "#a05d56", "#d0743c", "#ff8c00"]);

	scope.xAxis = d3.svg.axis()
		.scale(scope.x)
		.orient("bottom");

	scope.yAxis = d3.svg.axis()
		.scale(scope.y)
		.orient("left")
		.tickFormat(scope.digitFormat);

    scope.color.domain(d3.keys(data[0]).filter(function(key) { return key !== "x"; }));

	data.forEach(function(d) {
		var y0 = 0;
		d.vals = scope.color.domain().map(
				function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
		d.total = d.vals[d.vals.length - 1].y1;
	});

	data.sort(function(a, b) { return b.total - a.total; });

	scope.x.domain(data.map(function(d) { return d.x; }));
	scope.y.domain([0, d3.max(data, function(d) { return d.total; })]);

	scope.svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + scope.height + ")")
     .call(scope.xAxis);

	scope.svg.append('g')
	.attr('class', 'y axis')
	.call(scope.yAxis);

    scope.xlabel = scope.svg.selectAll(".x")
     .data(data)
   .enter().append("g")
     .attr("class", "g")
     .attr("transform", function(d) { return "translate(" + scope.x(d.x) + ",0)"; });

    scope.xlabel.selectAll("rect")
     .data(function(d) { return d.vals; })
   .enter().append("rect")
     .attr("width", scope.x.rangeBand())
     .attr("y", function(d) { return scope.y(d.y1); })
     .attr("height", function(d) { return scope.y(d.y0) - scope.y(d.y1); })
     .style("fill", function(d) { return scope.color(d.name); });

    scope.legend = scope.svg.selectAll(".legend")
     .data(scope.color.domain().slice().reverse())
   .enter().append("g")
     .attr("class", "legend")
     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    scope.legend.append("rect")
     .attr("x", scope.width - 18)
     .attr("width", 18)
     .attr("height", 18)
     .style("fill", scope.color);

    scope.legend.append("text")
     .attr("x", scope.width - 24)
     .attr("y", 9)
     .attr("dy", ".35em")
     .style("text-anchor", "end")
     .text(function(d) { return d; });
}

function worldMap(data, scope, args) {

	var colors = {"lnx": "#fd61d1", "win": "#00bcd8", "mac": "#00ba38",
				  "mixed": "#f8766d", "sol":"#00b0f6", "others":"#a3a500"};

	var projection = d3.geo.mercator()
		.rotate([-180,0]);

	var path = d3.geo.path()
		.projection(projection);

	var g = scope.svg.append("g");
	// load and display the World
	d3.json("/static/lib/world-110m2.json", function(error, topology) {
	    g.selectAll("path")
	      .data(topojson.object(topology, topology.objects.countries)
	          .geometries)
	    .enter()
	      .append("path")
	      .attr("d", path);
	});

	// load and display circles
	g.selectAll("circle")
	     .data(data)
	     .enter()
	     .append("circle")
	     .attr("cx", function(d) {
	         return projection([d.long, d.lat])[0];
	     })
	     .attr("cy", function(d) {
	         return projection([d.long, d.lat])[1];
	     })
	     .attr("r", function(d) {
	         return Math.log(d.size);
	     })
	     .style("fill", function(d){
	         return colors[d.os];
	     });

}