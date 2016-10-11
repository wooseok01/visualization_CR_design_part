function drawLine(root, x1, y1, x2, y2, strokeWidth, stroke, addClass) {
	var line = root.append('line').attr({
		x1 : x1,
		y1 : y1,
		x2 : x2,
		y2 : y2,
		'stroke-width' : strokeWidth,
		stroke : stroke,
		'class' : addClass
	})
	return line
}

function drawRect(root, x, y, width, height, fill, addClass, name){
	var rect = root.append('rect').attr({
		x: x,
		y: y,
		width: width,
		height: height,
		fill: fill,
		'class' : addClass,
		name : name
	});
	return rect;
}

function drawText(root, x, y, dy,fill, addClass, text){
	var textTag = root.append('text').attr({
			x : x,
			y : y,
			dy : dy,
			fill : fill,
			'class' : addClass
	}).text(text)
	return textTag;
}

function drawRect(root, x, y, width, height, fill, addClass, name,zIndex){
	if(zIndex == undefined) zIndex = 100;
	var rect = root.append('rect').attr({
		x: x,
		y: y,
		width: width,
		height: height,
		fill: fill,
		class : addClass,
		name : name
	}).style('z-index',zIndex);
	return rect;
}

function drawPolygon(init, points, strokeColor){
	var scaleX = d3.scale.linear()
    				.domain([-30,30]) //Give appropriate range in the scale
    				.range([0,init.graphW]);

    var scaleY = d3.scale.linear()
    				.domain([0,50]) //Give appropriate range in the scale
    				.range([init.graphH,0]);
    
		var polygon = init.rootSvg.selectAll("polygon")
	    	.data([points]).enter().append("polygon")
	    	.attr("points",function(d) { 
	    		return d.map(function(d) {
	            return [scaleX(d.x),scaleY(d.y)].join(",");
	        }).join(" ");
	    }).attr("stroke",strokeColor)
	      .attr("stroke-width",2);
	
	return polygon;
}



function drawGraph(root, lineData, className, stroke, width, tone, color){
	var lineFunction;
	if(tone == null){
		lineFunction = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })
		.interpolate("monotone");
	}else{
		lineFunction = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.interpolate(tone);
	}

	var line = root.append('path').attr({
		d : lineFunction(lineData),
		stroke : stroke,
		fill : color,
		'stroke-width' : width,
		class : className
	});
	return line;
}


function drawCircle(root, cx, cy, r, color, className){
	var circle = root.append('circle').attr({
		cx : cx,
		cy : cy,
		r : r,
		'fill' : color,
		class : className,
		stroke : 'none'
	});
	
	return circle;
}
