// Raja you can use this variable which has english comments (it's appear //end)
// please don't change other variables :)
// and you can change this six variables score, don't change six variables name

var nodeColor = 'rgb(53,158,131)'; //color of dots in dendrogramix
var nameGraphColor = 'rgba(197,193,169,1)';//this is line graph(phase graph) color
var smallRectColor = 'rgba(54,163,135,1)';//matrix bar graph color (not matrix small cell background color)
var smallRectNoColor = 'rgba(54,163,135,0.5)';//matrix bar graph color but this is not meaningful variable
var nullValueColor = 'rgba(49,58,66,1)';//matrix bar graph color which have a null score.
var compareOkColor = 'rgba(221,214,197,1)';//this is mean meaningful variable color when matrix hovering
var compareNoColor = 'rgba(221,214,197,0.5)';//this is the same compareOkColor variable but difference is opacity.
//					   						   please same color compareOkColor only change opacity better:)
var leftGuideTextColor = 'rgba(197,193,169,1)'; //left side test text color
var guidePolygonColor = 'rgba(53,158,131,1)'; //rights side guide polygon color
var guideTextColor = 'rgba(197,193,169,1)'; //right side guide text color
var bigTriangleLineColor = 'rgba(208,208,212,0.8)'; //dendrogramix most big triangle line color
var bigTriangleBackgroundColor = 'rgba(35,30,45,1)'; //dendrogramix most bit triangle backgroundColor
var smallTriangleLineColor =  'rgba(255,255,255,0.8)';//all dendrogramix small triangle line color -> not big triangle
var bottomTriangleBackgroundColor = 'rgba(184,204,117,1)';//bottom triangle has only other color you can understand.
//															i mean first green triangle section color.
var leftBigTriangleBackgroundColor = 'rgba(25,20,35,1)';// second biggest triangle left side.
var rightInLeftTriangleBackgroundColor = 'rgba(15,10,25,1)';// right small triangle in second biggest left triangle
var rightInRightTriangleBackgroundColor = 'rgba(5,0,15,1)';// right small triangle in second biggest right triangle.
var dotHoverEventColor = 'rgba(255,165,0,0.2)';// circle in dendrogramix triangle color when it's hovering
var phaseGuideLineColor = 'rgba(255,255,255,0.3)';// phase line graph guide line color.
var phaseGraphLineColor = 'rgba(255,255,255,0.85)';// phase line graph color
var phaseBackgroundRectColor = 'rgba(82,86,97,1)';// rect has phase line graph color. i mean phase rect.
var smallBarGraphColor = ['rgba(54,163,135,','rgba(49,58,66,1'];// small bar graph in matrix score
// 																	it has a two value.
// 																	if this small bar graph is meaningful then it color arr[0]
// 																	but if this small bar graph is not meaningful then it color arr[1]

// end!

var questions;
var questionsList;

var dif;
var treeDif;
var init = init();
var treeInit = treeInit();
var nameList = [];
var personList = [];
var plusAxis;
var plusYxis;
var minusAxis;
var minusYxis;
var selected = null;
var phaseDif;
var rectWidth;



//tree와 matrix연동 전에 임시 개발을 위한 변수
var treePerson = [];
var treeNameList = [];
var similarityArr = [];
var secondCluster;

d3.selection.prototype.moveToFront = function() {  
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

d3.selection.prototype.moveToBack = function() {  
	return this.each(function() { 
		var firstChild = this.parentNode.firstChild; 
		if (firstChild) { 
			this.parentNode.insertBefore(this, firstChild); 
		} 
	});
};

//처음 시작할때 모든 셋팅!
firstSetting(function(){
	console.log('done!');
});

function firstSetting(innerCallback){

	async.waterfall([
		function(cb){
			ajaxCall('http://helloybz.dlinkddns.com:8080/visualization/getSimilarityPerson', init, dif, function(data){
//				console.log('first');
				cb(null, data);
//				console.log(init);
//				console.log(dif);
			});
			
		}, function(data, cb){
			// draw tree
			//basic triangle
			treePerson = data;
			drawBasicTriangle(treeInit); //now here
//			console.log('second');
			cb(null);
		}, function(cb){
			ajaxCall('http://helloybz.dlinkddns.com:8080/visualization/getSimilarityColumn', init, dif, function(data){
//				console.log('third');
				cb(null,data);
			});
		},function(data, cb){
			treeNameList = data;
			nameList = data;
//			drawSimilarityCircle();
//			console.log('fourth');
			cb(null);
		}, function(cb){
	    	//get all patientData
	    	ajaxCall('http://helloybz.dlinkddns.com:8080/visualization/getCredosData3', init, dif, function(data){
	        	//get all questionsData
	    		ajaxCall('http://helloybz.dlinkddns.com:8080/visualization/getCredosQuestions', init, dif, function(qList){
	    			var overallList = [];
	    			var kmmseList = [];
	    			var kdsqlList = ['q_kdsq_1','q_kdsq_3','q_kdsq_4','q_kdsq_5','q_kdsq_11','q_kdsq_12'];
	    			var siadlList = ['a_siadl_c1','a_siadl_c2','a_siadl_c8','a_siadl_c13','a_siadl_c14','a_siadl_c15'];
	    			var npiList = [];
	    			var cdrList = [];
	    			var ksfList = ['b_ksf_gds_9','b_ksf_gds_14'];
	    			
//	    			overallList = [];
	    			overallList = overallList.concat(kdsqlList);
	    			overallList = overallList.concat(siadlList);
	    			overallList = overallList.concat(ksfList);
	    			
	    			for(var i=0; i<qList.length; i++){
	    				var listObj = qList[i];
	    				if(listObj.search('km_') != -1){
	    					if(listObj.search('pent') == -1 && listObj.search('total') == -1){
	    						kmmseList.push(listObj);
	    					}
	    				}else if(listObj.search('q_kdsq') != -1){
	    					if(listObj.search('q_kdsq_1') != -1 || listObj.search('q_kdsq_3') != -1 || 
	        					listObj.search('q_kdsq_4') != -1 || listObj.search('q_kdsq_5') != -1 ||
	    						listObj.search('q_kdsq_11') != -1 || listObj.search('q_kdsq_12') != -1){
	    						continue;
	    					}
	    					kdsqlList.push(listObj);
	    				}else if(listObj.search('a_siadl') != -1){
	    					if(listObj.search('a_siadl_p') == -1){
	    						if(listObj.search('a_siadl_c1') != -1 || listObj.search('a_siadl_c2') != -1 || 
	        						listObj.search('a_siadl_c8') != -1 || listObj.search('a_siadl_c13') != -1 ||
	    							listObj.search('a_siadl_c14') != -1 || listObj.search('a_siadl_c15') != -1){
	        						continue;
	        					}else{
	        						siadlList.push(listObj);
	        					}
	    					}
	    				}else if(listObj.search('b_cga_npi') != -1){npiList.push(listObj);}
	    				else if(listObj.search('g_cdr') != -1){cdrList.push(listObj);}
	    				else if(listObj.search('b_ksf_gds') != -1){
	    					if(listObj.search('b_ksf_gds_9') != -1 || listObj.search('b_ksf_gds_14') != -1){
	        						continue;
	    					}else{
	    						ksfList.push(listObj);
	    					}
	    				}
	    			}
	    			
	    			questionsList = {
	    				kmmseList : kmmseList,
	    				kdsqlList : kdsqlList,
	    				siadlList : siadlList,
	    				npiList : npiList,
	    				cdrList : cdrList,
	    				ksfList : ksfList,
	    				overallList : overallList
	    			};
//	    			console.log('fifth');
	    			cb(null, data);
	    		});
	    	});
	    },function(data, cb){
	    	if(selected == null){
	    		selected = 'overallList';
	    		questions = questionsList[selected];
	    	}
	    	//make personList & nameList
	    	
	    	var name = null;
	    	var index = 0;
	    	data = credosDataFitSimilarity(data);
	    	personList = [];
	    	for(var i=0; i<data.length; i++){
	    		if(i == 0){
	    			name = data[i].id;
	    			index++;
	    		}else if(i == data.length-1){personList.push(makeList(i-index, index+1, data));}
	    		else{
	    			if(name == data[i].id){
	    				index++;
	    			}else{
	    				var object = makeList(i-(index), index, data);
	    				personList.push(object);
	    				index = 0;
	    				index++;
	    				name = data[i].id;
	    			}
	    		}
	    	}
//	    	console.log('seventh');
	    	cb(null);
	    }, function(cb){
	    	//draw basic template
			
	    	if(selected != 'kmmseList'){
	    		dif = {
	    	    	xDif : init.graphW/nameList.length,
	    	    	//yDif : init.graphH/questions.length
	    	    	yDif : init.graphH/(questionsList['kmmseList'].length-5)
	    	    }
	    	}else{
	    		dif = {
	    			xDif : init.graphW/nameList.length,
	    	    	yDif : init.graphH/questions.length
	    		}
	    	}
	    	
	    	makePatientRect(init, dif);
	    	drawVariableText(init, dif);
	    	drawPhaseGraph(init, dif);
//	    	console.log('eighth');
	    	cb(null);
	    }, function(cb){
	    	//data input!
//	    	console.log('here!');
	    	console.log(init);
	    	dataInputMatrix(init);
	    	console.log('들어옴??');
	    	d3.selectAll('.verticalGuideLine').moveToFront();
	    	drawSimilarityCircle();
	    	cb(null,'done');
	    }],
	    function(err, result){
			if(err != null){
				console.log('error!!');
				console.log(err.message);
			}else{
				innerCallback();
			}
	});
}

function credosDataFitSimilarity(data){
	var result=[];

	for(var i=0; i<nameList.length; i++){
		for(var j=0; j<data.length; j++){
			if(data[j].id == nameList[i])
				result.push(data[j]);
		}
	}

	return result;
}

//user define for using waterfall
function makeList(start, index, data){
	switch(index){
		case 4: 
			return {
				first : data[start],
				second : data[start+1],
				third : data[start+2],
				fourth : data[start+3]
			};
		case 5: 
			return {
				first : data[start],
				second : data[start+1],
				third : data[start+2],
				fourth : data[start+3],
				fifth : data[start+4]
			};
	}
	
}

// user define function
// tree
function treeInit(){
	var width = $('#treeArea').width()*1;
	var height = $('#treeArea').height()*1;
	var padding = 20;
	var graphW = width - padding*2 - 30;
	var graphH = height - padding;
	
	var svg = d3.select('#treeArea').append('svg').attr({
		width : width,
		height : height
	});
	
	var treeRoot = svg.append('rect').attr({
		x : padding + 30,
		y : 10,
		width : graphW,
		height : graphH+5,
		fill : 'none',
		stroke : 'none',
		id : 'treeSvg'
	});

	drawRect(svg, 
			graphW-padding*3 + 10-2.5, padding*2, 
			5, 10, guidePolygonColor,
			'guideDescription', '');
	drawRect(svg, 
			graphW-padding*3 + 10-2.5, padding*3, 
			5, 10, nullValueColor, 
			'guideDescription', '');
	
	drawCircle(svg, 
			graphW-padding*3 + 10, padding*4+2.5, 
			5, guidePolygonColor, '');
	
	drawCircle(svg, 
			graphW-padding*3 + 10, padding*5+2.5, 
			2, guidePolygonColor, '');
	
	
	drawText(svg, 
			graphW-padding*3 + 20, padding*2-1, 
			10, guideTextColor, 'guideDescription', 'Score').style({
				'text-anchor' : 'start'
			});
	drawText(svg, 
			graphW-padding*3 + 20, padding*3-1, 
			10, guideTextColor, 'guideDescription', 'No data');
	drawText(svg, 
			graphW-padding*3 + 20, padding*4-3, 
			10, guideTextColor, 'guideDescription', 'High similarity');
	
	drawText(svg, 
			graphW-padding*3 + 20, padding*5-3, 
			10, guideTextColor, 'guideDescription', 'Low similarity');
	
	return {
		svg : svg,
		treeRoot : treeRoot,
		padding : padding,
		graphW : graphW,
		graphH : graphH
	};
}

function drawBasicTriangle(treeInit){
	var x = treeInit.treeRoot.attr('x')*1;
	var y = treeInit.treeRoot.attr('y')*1;
	var height = treeInit.treeRoot.attr('height')*1;
	var width = treeInit.treeRoot.attr('width')*1;
	
	var middleX = (x + (x+width))/2;
	
	plusAxis = (y-(y+height))/(middleX-x);
	plusYxis = y+height - plusAxis*x;
	
	minusAxis = (y+height-y)/(x+width-middleX);
	minusYxis = y - minusAxis*(middleX);
//	console.log(treeInit.svg);
	drawLine(treeInit.svg, 
			x, y+height, 
			x+width, y+height, 
			0.5, bigTriangleLineColor, 'basicTriangle');
//	console.log(temp.attr('x1'));
	var lineData = [];
	lineData.push({x : x, y : y+height});
	lineData.push({x : middleX, y : y});
	lineData.push({x : x+width, y : y+height});

	var temp = drawGraph(treeInit.svg, lineData, '', bigTriangleLineColor,
//			0.5, 'linear', 'rgba(225,245,156,0.15)');
			0.5, 'linear', bigTriangleBackgroundColor);
	console.log(temp);
	treeDif = {
			xDif : width/treePerson.length,
			yDif : height/treePerson.length
	};
}

function drawSimilarityCircle(){
	var x = treeInit.treeRoot.attr('x')*1;
	var y = treeInit.treeRoot.attr('y')*1;
	var width = treeInit.treeRoot.attr('width')*1;
	var height = treeInit.treeRoot.attr('height')*1;
	var arr = [];

	similarityArr = getSimilarityCircleData();

	var yDif = height/similarityArr.length;
	var firstXDif = width/similarityArr.length/2;
	var xDif = width/similarityArr.length;

	for(var i=0; i<similarityArr.length; i++){
		var obj = similarityArr[i];
		
		for(var j=0; j<obj.length; j++){
			var circle = drawCircle(treeInit.svg, 
					x+xDif*j+xDif/2, y+height-yDif*i, 
					treeDif.xDif/8*(1-obj[j]), nodeColor, 
					nameList[j]+'And'+nameList[j+i]+' similarityCircle real circleOrder'+i+'-'+j);
			if(nameList[j] == nameList[j+i]) circle.attr('hidden','hidden');

			if(i == 0){
				circle.attr({
					'id' : nameList[j],
					'class' : nameList[j]+'And'+nameList[j]+' similarityCircle real circleOrder'+i+'-'+j
				});
			}else{
				drawCircle(treeInit.svg, 
						x+xDif*j+xDif/2, y+height-yDif*i, 
						treeDif.xDif/8, 'rgba(53,158,131,0)',
						nameList[j]+'And'+nameList[j+i]+' similarityCircle circleOrder'+i+'-'+j);
			}
		}
		x += xDif/2;
	}
	
	divideCluster(similarityArr);
}

function divideCluster(similarityArr){
	//same circle devide
	
	var x = treeInit.treeRoot.attr('x')*1;
	var y = treeInit.treeRoot.attr('y')*1;
	var width = treeInit.treeRoot.attr('width')*1;
	var height = treeInit.treeRoot.attr('height')*1;
	
	var sameCircle = ['MjMwMzEyLTE4MjkyMTQg', 'NDEwODI1LTE3OTgxMTEg',
	                  'NDExMjE1LTE0NjY3Mjkg', 'MjgwNjA2LTIwNjM2MTAg',
	                  'NTAwMzIyLTI4MDc4Mjcg', 'NTQwODA4LTE5MzA0MTgg',
	                  'NDkxMjE1LTIwNTYyMzgg', 'NDMwMzIzLTEwNDI3MTEg',
	                  'NDcxMTE2LTIwNTI0MTQg', 'NDEwODEzLTI0NzE2MTEg'];
	
	var middleList = ['#MzIxMjI5LTIxNjkzMTUg', 
	                  '.NDExMjE1LTE0NjY3MjkgAndMjgwNjA2LTIwNjM2MTAg',
	                  '.NTAwMzIyLTI4MDc4MjcgAndNTQwODA4LTE5MzA0MTgg',
	                  '.NDkxMjE1LTIwNTYyMzggAndNDMwMzIzLTEwNDI3MTEg',
	                  '.NDcxMTE2LTIwNTI0MTQgAndNDEwODEzLTI0NzE2MTEg'];
	
	var cx; 
	var cx2; 
	var xDif = $('#'+sameCircle[0]).attr('cx')*1 - x;
	var lineData = [];
	
	
//    'NDEwODEzLTI0NzE2MTEg', 'MjMwMzEyLTE4MjkyMTQg'
	var unSameCircle = ['MzUwMTAxLTIwMDAzMTEg', 'MjkwNDA5LTEwMzc4Mjcg',
	                    'MjMwMzEyLTE4MjkyMTQg', 'MzYwNTIxLTEwNDE5MTQg',
	                    'NDExMjE1LTE0NjY3Mjkg', 'MzYwNTIxLTEwNDE5MTQg',
	                    'NDAxMDE1LTEyMzE3MTEg', 'MzYxMjAyLTIxMDg3MTkg',
	                    'NDAxMDE1LTEyMzE3MTEg', 'NDEwODEzLTI0NzE2MTEg',
	                    'MzUwMTAxLTIwMDAzMTEg', 'NDEwODEzLTI0NzE2MTEg', // 여기 꼬
	                    'NDAxMDE1LTEyMzE3MTEg', 'NDkxMjE1LTIwNTYyMzgg'
	                    ];
	//MjkwNDA5LTEwMzc4MjcgAndNDEwODEzLTI0NzE2MTEg
	//
	var unSameMiddleList = ['.MzUwMTAxLTIwMDAzMTEgAndMjkwNDA5LTEwMzc4Mjcg',
	                        '.MjMwMzEyLTE4MjkyMTQgAndMzYwNTIxLTEwNDE5MTQg',
	                        '.NDExMjE1LTE0NjY3MjkgAndMzYwNTIxLTEwNDE5MTQg',
	                        '.NDAxMDE1LTEyMzE3MTEgAndMzYxMjAyLTIxMDg3MTkg',
	                        '.NDAxMDE1LTEyMzE3MTEgAndNDEwODEzLTI0NzE2MTEg',
	                        '.MzUwMTAxLTIwMDAzMTEgAndNDEwODEzLTI0NzE2MTEg', //여기 꼬임
	                        '.NDAxMDE1LTEyMzE3MTEgAndNDkxMjE1LTIwNTYyMzgg'
//	                        '.NDIxMjEyLTIwMjM1MTggAndNDAxMDE1LTEyMzE3MTEg'
	                        ];
	
	for(var i=0; i<unSameCircle.length/2; i++){
		cx = $('#'+unSameCircle[i*2]).attr('cx')*1;
		cx2 = $('#'+unSameCircle[i*2+1]).attr('cx')*1;
		lineData.push({x : cx - 2.5/2, y : y+height});
		lineData.push({x : cx2 + 2.5/2, y : y+height});
		var cr = $(unSameMiddleList[i]).attr('r')*1;
		lineData.push({
			x : $(unSameMiddleList[i]).attr('cx')*1,
			y : $(unSameMiddleList[i]).attr('cy')*1 - cr 
		});
		lineData.push({x : cx - 2.5/2, y : y+height});
		//rgba(0,17,30,1)
		if(i<2){
			drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//					0.5, 'linear', 'rgba(195,215,126,0.7)');
					0.5, 'linear', leftBigTriangleBackgroundColor);
		}else if(i<5){
			if(i==2){
				drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(185,205,116,0.7)');
						0.5, 'linear', rightInLeftTriangleBackgroundColor); //- > 이거!
			}else{
				drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(185,205,116,0.7)');
						0.5, 'linear', leftBigTriangleBackgroundColor);
			}
		}else if(i<7){
			if(i==5){
//				console.log('xxxx');
				drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(185,205,116,0.7)');
						0.5, 'linear', rightInRightTriangleBackgroundColor);
			}else if(i==6){
				drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(195,215,126,0.7)');
						0.5, 'linear', rightInLeftTriangleBackgroundColor); //- > 이거!
			}else{
				drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(205,225,136,0.7)');
						0.5, 'linear', 'rgba(82,86,97,0.7)');
			}
		}else if(i<8){
			if(i==7){
				secondCluster = drawGraph(treeInit.svg, lineData, 'x', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(205,225,136,0.7)');
						0.5, 'linear', 'rgba(82,86,97,0.7)');

						
			}else{
				drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
//						0.5, 'linear', 'rgba(215,235,146,0.7)');				
						0.5, 'linear', 'rgba(82,86,97,0.7)');				
			}
		}
		lineData = [];
	}
	
	for(var i=0; i<sameCircle.length/2; i++){
		cx = $('#'+sameCircle[i*2]).attr('cx')*1;
		cx2 = $('#'+sameCircle[i*2+1]).attr('cx')*1;
		if(i == 0){
			lineData.push({x : x, y : y+height});
			lineData.push({x : cx2, y : y+height});
			lineData.push({
				x : $(middleList[i]).attr('cx')*1,
				y : plusAxis*($(middleList[i]).attr('cx')*1)+plusYxis
			});
			lineData.push({x : x, y : y+height});
		}else if(i == sameCircle.length/2-1){
			lineData.push({x : cx - xDif/2, y : y+height});
			lineData.push({x : x+width, y : y+height});
			var cr = $(middleList[i]).attr('r')*1;
			lineData.push({
				x : $(middleList[i]).attr('cx')*1,
				y : $(middleList[i]).attr('cy')*1 -cr 
			});
			lineData.push({x : cx - xDif/2, y : y+height});
		}else{
			lineData.push({x : cx - xDif/2, y : y+height});
			lineData.push({x : cx2 + xDif/2, y : y+height});
			var cr = $(middleList[i]).attr('r')*1;
			lineData.push({
				x : $(middleList[i]).attr('cx')*1,
				y : $(middleList[i]).attr('cy')*1 -cr 
			});
			lineData.push({x : cx - xDif/2, y : y+height});
		}
		drawGraph(treeInit.svg, lineData, '', smallTriangleLineColor,
				0.5, 'linear', bottomTriangleBackgroundColor);
//				0.5, 'linear', 'rgba(30,21,32,0.7)');
		lineData = [];
	}
	d3.selectAll('.real').moveToFront();
	d3.selectAll('.similarityCircle')
	.on('mouseover', function(){
		
		var className = $(this).attr('class');
		var split = className.split('And');
		var first = split[0];
		var second = (split[1].split(' '))[0];
		
		$('#'+first).attr('fill','orange');
		$('#'+second).attr('fill','orange');
		$('.'+first+'And'+second+'.similarityCircle.real').attr('fill','orange');
		
		$('#'+first+'NameGraph').find('.phase').attr('stroke','orange');
		$('#'+second+'NameGraph').find('.phase').attr('stroke','orange');
		
		treeNodeHoverFunction(first, second, this, 'Hover',dotHoverEventColor);
		split = split[1].split(' ');
		guideCircleColorChange(split[split.length-1]);
		
		if(first != second){
			var firstClass = $('#'+first).attr('class');
			var secondClass = $('#'+second).attr('class');
			
			split = firstClass.split(' ');
			firstClass = split[0].split('And')[0];
			guideCircleColorChange(split[split.length-1]);
			
			split = secondClass.split(' ');
			secondClass = split[0].split('And')[0];
			guideCircleColorChange(split[split.length-1]);
			
			var guideX = $('.'+firstClass+'.smallRect.order0').parent().find('rect').attr('x')*1;
			var guideY = $('.'+firstClass+'.smallRect.order0').parent().find('rect').attr('y')*1;
			var guideHeight = $('.'+firstClass+'.smallRect.order0').parent().find('rect').attr('height')*1;

			drawRect(init.svg, 
					guideX, guideY, 
					rectWidth, (guideHeight+1.8)*questions.length, 
					'none', 'Hover', '').attr('stroke','orange');
			
			guideX = $('.'+secondClass+'.smallRect.order0').parent().find('rect').attr('x')*1;
			guideY = $('.'+secondClass+'.smallRect.order0').parent().find('rect').attr('y')*1;
			guideHeight = $('.'+secondClass+'.smallRect.order0').parent().find('rect').attr('height')*1;
			
			drawRect(init.svg, 
					guideX, guideY, 
					rectWidth, (guideHeight+1.8)*questions.length, 
					'none', 'Hover', '').attr('stroke','orange');
//			console.log(temp.attr('x')+' '+temp2.attr('x'));
		}else{
			var firstClass = $('#'+first).attr('class');
			
			split = firstClass.split(' ');
			firstClass = split[0].split('And')[0];
			
			var guideX = $('.'+firstClass+'.smallRect.order0').parent().find('rect').attr('x')*1;
			var guideY = $('.'+firstClass+'.smallRect.order0').parent().find('rect').attr('y')*1;
			var guideHeight = $('.'+firstClass+'.smallRect.order0').parent().find('rect').attr('height')*1;
			
			drawRect(init.svg, 
					guideX, guideY, 
					rectWidth, (guideHeight+1.8)*questions.length, 
					'none', 'Hover', '').attr('stroke','orange');
		}
		
		
		
	}).on('mouseout', function(){
		var className = $(this).attr('class');
		var split = className.split('And');
		var first = split[0];
		var second = (split[1].split(' '))[0];
		//nameGraphColor
		$('#'+first+'NameGraph').find('.phase').attr('stroke',nameGraphColor);
		$('#'+second+'NameGraph').find('.phase').attr('stroke',nameGraphColor);
		
		d3.selectAll('.similarityCircle').attr('fill','rgba(53,158,131,0)');
		d3.selectAll('.real').attr('fill',nodeColor);
		
		$('.Hover').remove();
	}).on('click', function(){
		var className = $(this).attr('class');
		var split = className.split('And');
		var first = split[0];
		var second = (split[1].split(' '))[0];
		
	});
}

function guideCircleColorChange(circleOrder){
	var order = circleOrder.substring('circleOrder'.length, circleOrder.length);
	var firstOrder = order.split('-')[0]*1;
	var secondOrder = order.split('-')[1]*1;
	var tempFirst = firstOrder;
	var tempSecond = secondOrder;
	//left upside node color change logic
	while(true){
		tempFirst++;
		tempSecond--;

		if(tempFirst>64 || tempSecond<0) break;
		
		$('.real'+'.circleOrder'+tempFirst+'-'+tempSecond).attr('fill','orange');
	}
	
	tempFirst = firstOrder;
	tempSecond = secondOrder;
	
	//right downside node color change logic
	while(true){
		tempFirst--;
		tempSecond++;

		if(tempFirst<0 || tempSecond>63) break;
		
		$('.real'+'.circleOrder'+tempFirst+'-'+tempSecond).attr('fill','orange');
	}
	
	tempFirst = firstOrder;
	tempSecond = secondOrder;
	//right upside node color change logic
	while(true){
		tempFirst++;
//		tempSecond++;

		if(similarityArr[tempFirst].length < tempSecond)break;

		$('.real'+'.circleOrder'+tempFirst+'-'+tempSecond).attr('fill','orange');
	}
	
	tempFirst = firstOrder;
	tempSecond = secondOrder;
	//left downside node color change logic
	while(true){
		tempFirst--;
		
		if(tempFirst<0) break;
		
		$('.real'+'.circleOrder'+tempFirst+'-'+tempSecond).attr('fill','orange');
	}
	
}

function treeNodeHoverFunction(first, second, zero, className, color){

	var firstObj = {x : $('#'+first).attr('cx')*1,y : $('#'+first).attr('cy')*1};
	var secondObj = {x : $('#'+second).attr('cx')*1,y : $('#'+second).attr('cy')*1};
	var thisObj = {x : $(zero).attr('cx')*1, y : $(zero).attr('cy')*1};
	
	var yVal1, yVal12, yVal2, yVal22;
	var xVal1, xVal2;
	var plusCrossDot, minusCrossDot;
	
	yVal1 = firstObj.y - firstObj.x*plusAxis;
	yVal12 = firstObj.y - firstObj.x*minusAxis;
	
	yVal2 = secondObj.y - secondObj.x*minusAxis;
	yVal22 = secondObj.y - secondObj.x*plusAxis;
	
	plusCrossDot = {
			x : (yVal1 - minusYxis)/(minusAxis - plusAxis),
			y : minusAxis*((yVal1 - minusYxis)/(minusAxis - plusAxis))+minusYxis
	};
	
	minusCrossDot = {
			x : (yVal2 - plusYxis)/(plusAxis - minusAxis),
			y : plusAxis*((yVal2 - plusYxis)/(plusAxis - minusAxis)) + plusYxis
	};
	
	drawLine(treeInit.svg, 
			firstObj.x, firstObj.y, 
			plusCrossDot.x, plusCrossDot.y, 
			0.8, color, className);
	drawLine(treeInit.svg, 
			secondObj.x, secondObj.y, 
			minusCrossDot.x, minusCrossDot.y, 
			0.8, color, className);
	
	
	if(first != second){
		
		plusCrossDot = {
				x : (plusYxis - yVal12)/(minusAxis - plusAxis),
				y : minusAxis*(((plusYxis - yVal12)/(minusAxis - plusAxis)))+yVal12
		};
		
		minusCrossDot = {
				x : (minusYxis - yVal22)/(plusAxis - minusAxis),
				y : plusAxis*((minusYxis - yVal22)/(plusAxis - minusAxis)) + yVal22
		};
		
		drawLine(treeInit.svg, 
				firstObj.x, firstObj.y, 
				plusCrossDot.x, plusCrossDot.y, 
				0.8, color, className);
		drawLine(treeInit.svg, 
				secondObj.x, secondObj.y, 
				minusCrossDot.x, minusCrossDot.y, 
				0.8, color, className);
	}
	
}

function getSimilarityCircleData(){
	var similarityArr = [];
	var length = treePerson.length;
	
	for(var i=0; i<treePerson.length; i++){
		var arr = [];
		
		for(var j=0; j<treePerson.length-i; j++){
			var name = treeNameList[j+i];
			var first = name.substring(0,1);
			
			if(first == 'M')
				name = first.toLowerCase() + name.substring(1, name.length);
			
			var value = treePerson[j][name];
			arr.push(value);
		}
		similarityArr.push(arr);
	}
	
	return similarityArr;
}

// user define function
// matrix
function init(){
	
	var width = $('#matrixArea').width()*1;
	var height = $('#matrixArea').height()*1;
	var padding = 20;
	var graphW = width - padding*2 - 30;
	var graphH = height - 40;
	
	var svg = d3.select('#matrixArea').append('svg').attr({
		width : width,
		height : height
	});
	
	var matrixRoot = svg.append('rect').attr({
		x : padding + 30,
		y : 20,
		width : graphW,
		height : graphH,
		fill : 'none',
		stroke : 'none',
		id : 'matrixSvg'
	});
	
	var phaseGraphRoot = svg.append('rect').attr({
		x : padding + 30,
		y : 2,
		width : graphW,
		height : 12,
		fill : 'none',
		stroke : 'none',
		id : 'phaseSvg'
	});
	
	return {
		svg : svg,
		matrixRoot : matrixRoot,
		padding : padding,
		graphW : graphW,
		graphH : graphH,
		phaseGraphRoot : phaseGraphRoot
	}
}

function drawPhaseGraph(init, dif){
	var x = init.phaseGraphRoot.attr('x')*1;
	var y = init.phaseGraphRoot.attr('y')*1;
	var width = init.phaseGraphRoot.attr('width');
	var height = init.phaseGraphRoot.attr('height');
	
	phaseDif = {
			xDif : dif.xDif,
			yDif : height/2
	};
	drawPhaseGuideLine(init);
}

function drawPhaseGuideLine(init){
	var x = init.phaseGraphRoot.attr('x')*1;
	var y = init.phaseGraphRoot.attr('y')*1;
	var width = init.phaseGraphRoot.attr('width')*1;
	var height = init.phaseGraphRoot.attr('height')*1;
	
	var phaseList = ['SMI', 'MCI VCI','AD SVD'];
	var phaseColor = [leftGuideTextColor,leftGuideTextColor,leftGuideTextColor];
	
	for(var i=0; i<3; i++){
		drawLine(init.svg, 
				x, y+phaseDif.yDif*i, 
				x+rectWidth, y+phaseDif.yDif*i, 
				0.5, phaseGuideLineColor, 'phaseGraphGuideLine '+phaseList[i]);
		
		drawText(init.svg, 
				x-5, y+phaseDif.yDif*i-(phaseDif.yDif/3*2), 
				phaseDif.yDif, 
				phaseColor[i], 'phaseGraphText', phaseList[i])
				.attr({'text-anchor' : 'end'})
				.style({'font-size' : '7px'});
	}
	
	drawPhaseLine(init);
}

function drawPhaseLine(init){
	var order = ['first','second','third','fourth','fifth'];
	
	for(var i=0; i<personList.length; i++){
		var person = personList[i];
		var array = [];
		
		for(var j=0; j<order.length; j++){
			if(person[order[j]] != null){
				array.push(person[order[j]].dx2);
			}else{
				
			}
		}
		drawPersonGraph(changeIntegerValue(array), i);
	}
}

function drawPersonGraph(array, index){
	var x = init.phaseGraphRoot.attr('x')*1;
	var quarters = rectWidth/5;
	var gTag = init.svg.append('g').attr('id',personList[index].first.id+'NameGraph');
	var line;
	var rect = $('#'+personList[index].id).attr('x')*1;
	var topLine = $('.SMI').attr('y1')*1;
	var middleLine = $('.MCI').attr('y1');
	var bottomLine = $('.AD').attr('y1')*1;
	
	drawRect(gTag, 
			x+dif.xDif*(index), topLine, 
			rectWidth, bottomLine-topLine, 
			phaseBackgroundRectColor, 'phaseBackgroundRect', '', 100)
			.on('mouseover',function(){
				var parent = $(this).parent().attr('id');
				parent = parent.substring(0, parent.length-('NameGraph').length);
				treeNodeHoverFunction(parent, parent, $('.'+parent+'And'+parent), 
						'Hover',dotHoverEventColor);
				guideCircleColorChange($('.'+parent+'And'+parent).attr('class').split(' ')[3]);
				$(this).parent().find('.phase').attr('stroke','rgba(255,165,0,1)');
				var guideHeight = $('.'+parent+'.smallRect.order0').parent().find('rect').attr('height')*1;
				var guideX = $('.'+parent+'.smallRect.order0').parent().find('rect').attr('x')*1;
				var guideY = $('.'+parent+'.smallRect.order0').parent().find('rect').attr('y')*1;
				drawRect(init.svg, 
						guideX, guideY, 
						rectWidth, (guideHeight+1.8)*questions.length, 
						'none', 'Hover', '').attr('stroke','orange');
			}).on('mouseout',function(){
				$('.Hover').remove();
				d3.selectAll('.similarityCircle').attr('fill','rgba(53,158,131,0)');
				d3.selectAll('.real').attr('fill',nodeColor);
				$(this).parent().find('.phase').attr('stroke',phaseGraphLineColor);
			});
	
	drawLine(gTag, 
			x+dif.xDif*(index), topLine, 
			x+dif.xDif*(index), bottomLine, 
			0.5, phaseGuideLineColor, 'verticalPhaseGuide');
	
	drawLine(gTag, 
			x+dif.xDif*(index)+rectWidth, topLine, 
			x+dif.xDif*(index)+rectWidth, bottomLine, 
			0.5, phaseGuideLineColor, 'verticalPhaseGuide');
	
	for(var i=1; i<5; i++){
		drawLine(gTag, 
				x+dif.xDif*(index)+quarters*i, topLine, 
				x+dif.xDif*(index)+quarters*i, bottomLine, 
				0.5, phaseGuideLineColor, 'verticalPhaseGuide');
	}
	if(index != 0){
		drawLine(gTag, 
				x+dif.xDif*(index), topLine, 
				x+dif.xDif*(index)+rectWidth, topLine, 
				0.5, phaseGuideLineColor, 'parallelPhaseGuide');
		drawLine(gTag, 
				x+dif.xDif*(index), middleLine, 
				x+dif.xDif*(index)+rectWidth, middleLine, 
				0.5, phaseGuideLineColor, 'parallelPhaseGuide');
		drawLine(gTag, 
				x+dif.xDif*(index), bottomLine, 
				x+dif.xDif*(index)+rectWidth, bottomLine, 
				0.5, phaseGuideLineColor, 'parallelPhaseGuide');
	}
	
	
	for(var i=0; i<array.length; i++){
		//here!
		
		line = drawLine(gTag, 
				x+dif.xDif*(index) + (quarters*(i)), array[i], 
				x+dif.xDif*(index) + (quarters*(i+1)), array[i], 
				'1', phaseGraphLineColor, 'phase');
		if(i != array.length-1){
			drawLine(gTag, 
					x+dif.xDif*(index) + (quarters*(i+1)), array[i], 
					x+dif.xDif*(index) + (quarters*(i+1)), array[i+1], 
					'1', phaseGraphLineColor, 'phase');
		}
	}
}

function changeIntegerValue(array){
	var result = [];
	var back;
	
	for(var i=0; i<array.length; i++){
		
		if(array[i].search('SMI') != -1){
			back = $('.SMI').attr('y1')*1;
			result.push(back);
		}else if(array[i].search('MCI') != -1 || 
				 array[i].search('VCI') != -1){
			back = $('.MCI').attr('y1')*1;
			result.push(back);
		}else if(array[i].search('AD') != -1 ||
				 array[i].search('SVD') != -1){
			back = $('.AD').attr('y1')*1;
			result.push(back);
		}
	}
//	console.log(result);
	return result;
}

function ajaxCall(url, init, dif, cb){
	$.ajax({
		url : url,
		dataType : 'json',
		success : function(data){
			cb(data);
		},
		error : function(err){
			console.log(err.message);
		}
	});
}

function makePatientRect(init, dif){
	var width = $('#matrixSvg').attr('width')*1;
	var height = $('#matrixSvg').attr('height')*1;
	var x = $('#matrixSvg').attr('x')*1;
	var y = $('#matrixSvg').attr('y')*1;
	
	var list = [];
	switch(selected){
		case 'kmmseList' : break;
		case 'kdsqlList' : 
			list = ['q_kdsq_1','q_kdsq_3','q_kdsq_4','q_kdsq_5','q_kdsq_11','q_kdsq_12']; 
			break;
		case 'siadlList' : 
			list = ['a_siadl_c1','a_siadl_c2','a_siadl_c8','a_siadl_c13','a_siadl_c14','a_siadl_c15'];
			break;
		case 'npiList' : break;
		case 'cdrList' : break;
		case 'ksfList' : list = ['b_ksf_gds_9','b_ksf_gds_14']; break;
		case 'overallList' : list = questionsList['overallList']; break;
	}
	for(var i=0; i<personList.length; i++){
		var gTag = init.svg.append('g').attr({
			id : personList[i].first.id+' rect',
			'class' : 'verticalOrder'+i
		});
		
		for(var j=0; j<questions.length; j++){
			var rect ;
			if(j<list.length && questions[j] == list[j]){
				rect = drawRect(gTag,
						x+dif.xDif*i, y+dif.yDif*j, 
//						dif.xDif - 3.5, dif.yDif - 1.8, 'rgba(215,235,146,1)', 
						dif.xDif - 3.5, dif.yDif - 1.8, compareOkColor, 
						personList[i].first.id+' rectangle '+questions[j]+' compareOk', ''); 
			}else{
				rect = drawRect(gTag,
						x+dif.xDif*i, y+dif.yDif*j, 
//						dif.xDif - 3.5, dif.yDif - 1.8, 'rgba(215,235,146,1)', 
						dif.xDif - 3.5, dif.yDif - 1.8, compareNoColor,
						personList[i].first.id+' rectangle '+questions[j], ''); 
			}
			
			rect.on('mouseover', function(){
				var objId = $(this).parent().attr('id');
				var id = objId.split(' ')[0];
				
				var className = $('#'+id).attr('class');
				var split = className.split('And');
				var first = split[0];
				var second = (split[1].split(' '))[0];
				
				$('#'+id).attr('fill','orange');
				treeNodeHoverFunction(first, second, $('#'+id), 'Hover', dotHoverEventColor);
				$('#'+id+'NameGraph').find('.phase').attr('stroke','orange');

				drawRect(init.svg, 
						$(this).parent().find('.rectangle').attr('x'), 
						$(this).parent().find('.rectangle').attr('y'), 
						rectWidth, dif.yDif*questions.length, 
						'none', 'rectHoverVerticalGuide', '').attr('stroke','orange');
				$(this).parent().find('.meaningful').attr('fill','orange');
				var thisClass = $(this).attr('class');
				var qName = thisClass.split(' ')[2];
				$('text.'+qName).attr('fill','orange');
				
				drawRect(init.svg, 
						init.matrixRoot.attr('x')*1, $(this).attr('y')*1, 
						dif.xDif*personList.length-3.5, dif.yDif, 
						'none', 'rectHoverParallelGuide', '').attr('stroke','orange');
				
				split = split[1].split(' ');
				guideCircleColorChange(split[split.length-1]);
				if(first != second){
					var firstClass = $('#'+first).attr('class');
					var secondClass = $('#'+second).attr('class');
					split = firstClass.split(' ');
					guideCircleColorChange(split[split.length-1]);
					split = secondClass.split(' ');
					guideCircleColorChange(split[split.length-1]);
				}

			}).on('mouseout', function(){
//				d3.selectAll('.similarityCircle').attr('fill','rgb(53,158,131)');
				d3.selectAll('.similarityCircle').attr('fill','rgba(53,158,131,0)');
				d3.selectAll('.real').attr('fill',nodeColor);
				var objId = $(this).parent().attr('id');
				var id = objId.split(' ')[0];
				
				$('#'+id+'NameGraph').find('.phase').attr('stroke',phaseGraphLineColor);
				var thisClass = $(this).attr('class');
				var qName = thisClass.split(' ')[2];
				$('text.'+qName).attr('fill',leftGuideTextColor);
				
				$(this).parent().find('.meaningful').attr('fill',smallRectColor);
				$('.Hover').remove();
				$('.rectHoverVerticalGuide').remove();
				$('.rectHoverParallelGuide').remove();
			}).on('click', function(){
//				d3.selectAll('.compareOk').attr('fill','rgba(221,214,197,0.5)');
//				d3.selectAll('.compareSmallCell').attr('fill','rgba(54,163,135,0.5)');
				var parent = $(this).parent()
				if((parent.attr('toggle') == null || parent.attr('toggle') == 'no') &&
						$('#compareButton').val() == 'reset'){
					parent.find('.compareOk').attr('fill',compareOkColor);
					parent.find('.compareSmallCell').attr('fill',smallRectColor);
					parent.attr('toggle','yes');
				}else if((parent.attr('toggle') != null || parent.attr('toggle') == 'yes') &&
						$('#compareButton').val() == 'reset'){
					parent.find('.compareOk').attr('fill',compareNoColor);
					parent.find('.compareSmallCell').attr('fill',smallRectNoColor);
					parent.attr('toggle','no');
				}
			});;
		}
		drawPatientRectGuideLine(gTag, init, i, rect);
	}
}

function drawVariableText(init, dif){
	var x = init.matrixRoot.attr('x')*1;
	var y = init.matrixRoot.attr('y')*1;
	console.log(questions.length);
	for(var i=0; i<questions.length; i++){
		console.log('init.svg='+init.svg);
		var gTag = init.svg.append('g').attr({
			id : 'parallelGuideLine'+i
		});
		
		drawText(gTag, 
				x-7, dif.yDif*i-(dif.yDif/3)+y, 
				dif.yDif, leftGuideTextColor,
				questions[i], questions[i])
				.attr({'text-anchor' : 'end'})
				.style({'font-size' : '7px'});
		
		drawVariableGuideLine(init, questions[i], i, gTag);
	}
}

function drawVariableGuideLine(init, question, order, gTag){
	
	var range;
	var x = init.matrixRoot.attr('x')*1;
	var y = init.matrixRoot.attr('y')*1;
	var width = init.matrixRoot.attr('width')*1;
	var rectHeight = $('.rectangle').attr('height')*1;
	
	if(question.search('km_') != -1){range = 1;}
	else if(question.search('q_kdsq') != -1){range = 2;}
	else if(question.search('a_siadl') != -1){range = 3;}
	else if(question.search('b_cga_npi') != -1){range = 4;}
	else if(question.search('g_cdr') != -1){range = 3;}
	else if(question.search('rf_his') != -1){range = 3;}
	else if(question.search('b_ksf_gds') != -1){range = 3;}
	
	for(var i=0; i<range; i++){
		drawLine(gTag, 
				x, y+dif.yDif*order + (rectHeight/range*i), 
				x+width, y+dif.yDif*order + (rectHeight/range*i), 
//				0.5, 'rgba(82,86,97,1)', question+' order'+i); rgba(28,28,28,1)
				0.5, phaseBackgroundRectColor, question+' order'+i);
	}
}

function drawPatientRectGuideLine(gTag, init, order, rect){

	var width = rect.attr('width')*1;
	var x = rect.attr('x')*1;

	var bigY = init.matrixRoot.attr('y')*1;
	var bigHeight = init.matrixRoot.attr('height')*1;
	var quarter = width/5;
	rectWidth = width;
	
	for(var i=0; i<5; i++){
		drawLine(gTag, 
				x + quarter*(i+1), bigY, 
				x + quarter*(i+1), bigY+bigHeight, 
//				0.5, 'rgba(82,86,97,1)', 'verticalGuideLine order'+i); rgba(28,28,28,1)
				0.5, phaseBackgroundRectColor, 'verticalGuideLine order'+i);
//				0.5, 'rgba(223,227,187,1)', 'verticalGuideLine order'+i);
	}
}

function dataInputMatrix(init){
	var orderList = ['first', 'second', 'third', 
	                 'fourth', 'fifth'];
	for(var i=0; i<personList.length; i++){
		var gTag = d3.select('.verticalOrder'+i);
		drawSmallVarGraph(init, gTag, personList[i], orderList, i);
	}
}

function drawSmallVarGraph(init, gTag, person, orderList, order){
	var list = [];
	var index = 0;
	switch(selected){
		case 'kmmseList' : break;
		case 'kdsqlList' : 
			list = ['q_kdsq_1','q_kdsq_3','q_kdsq_4','q_kdsq_5','q_kdsq_11','q_kdsq_12']; 
			break;
		case 'siadlList' : 
			list = ['a_siadl_c1','a_siadl_c2','a_siadl_c8','a_siadl_c13','a_siadl_c14','a_siadl_c15'];
			break;
		case 'npiList' : break;
		case 'cdrList' : break;
		case 'ksfList' : 
			list = ['b_ksf_gds_9','b_ksf_gds_14'];
			break;
		case 'overallList' : 
			list = questionsList['overallList'];
			break;
			//here!!
	}
	for(var i=0; i<questions.length; i++){
		var rect = gTag.select('.'+questions[i]);
//		console.log(rect);
		var x = rect.attr('x')*1;
		var y = rect.attr('y')*1;
		var width = rect.attr('width')*1;
		var height = rect.attr('height')*1;
		var phasePattern = [];
		var meaningful = [];
//		console.log(person.length);
		for(var j=0; j<5; j++){
//			console.log(person[orderList[j]]['dx2']);
//			console.log(person[orderList[j]]);
			if(person[orderList[j]] != undefined){
				switch(person[orderList[j]].dx2){
				case 'SMI or Healthy subject' :  
				case 'SMI' : 
					phasePattern.push(3);
					break;
				case 'MCI' : 
				case 'VCI' : 
					phasePattern.push(2);
					break;
				case 'AD' : 
				case 'SVD' : 
					phasePattern.push(1);
					break;
				}
			}
		}
		
//		console.log(meaningful);
		
		for(var j=0; j<orderList.length; j++){
			if(person[orderList[j]] != null){
				var originalValue = person[orderList[j]][questions[i]];
				if(person[orderList[j]][questions[i]] != 9 && 
						person[orderList[j]][questions[i]] != 'NA'){
					var value = person[orderList[j]][questions[i]];
					
					value = changeValueToYPos(questions[i], value, height)
					var rect;

					if(value != 0){
						if(i<list.length && questions[i] == list[i]){
							
							rect = drawRect(gTag, 
									x + width/5*j, y+(height - value), 
									width/5, value,
									smallBarGraphColor[0]+'1)', person[orderList[j]].id+' smallRect '+questions[i]+' order'+i+' compareSmallCell', '');
						}else{
							rect = drawRect(gTag, 
									x + width/5*j, y+(height - value), 
									width/5, value,
									smallBarGraphColor[0]+'0.5)', person[orderList[j]].id+' smallRect '+questions[i]+' order'+i, '');
						}
						
					}else{
						rect = drawRect(gTag, 
								x + width/5*j, y+(height - value), 
								width/5, value, 
								nullValueColor, person[orderList[j]].id+' smallRect '+questions[i]+' order'+i, '');
					}
				}else if(person[orderList[j]][questions[i]] != 9 || 
						person[orderList[j]][questions[i]] != 'NA'){
					rect = drawRect(gTag, 
							x+width/5*j, y, 
							width/5, height, 
							nullValueColor, person[orderList[j]].id+' smallRect '+questions[i]+' order'+i+' nullValue', '');
				}
				meaningful.push({
					value : originalValue,
					rect : rect
				});
			}else{
				rect = drawRect(gTag, 
						x+width/5*j, y, 
						width/5, height, 
//						'rgba(49,58,66,1)', 'smallRect order'+i, '');
						nullValueColor, person[orderList[0]].id+' smallRect '+questions[i]+' order'+i+' nullValue', '');
			}
			
		}
		
		if(findMeaningfulVariable(meaningful,phasePattern)){
			for(var j=0; j<meaningful.length; j++){
				var meanClass = meaningful[j].rect.attr('class');
				meaningful[j].rect.attr('class',meanClass+' meaningful');
			}
//			console.log('im in!');
		}
		
		
		for(var j=0; j<meaningful.length; j++){
			meaningful[j].rect.on('mouseover', function(){
				var objId = $(this).parent().attr('id');
				var id = objId.split(' ')[0];
				
				var className = $('#'+id).attr('class');
				var split = className.split('And');
				var first = split[0];
				var second = (split[1].split(' '))[0];
				
				
				$('#'+id).attr('fill','orange');
				treeNodeHoverFunction(first, second, $('#'+id), 'Hover', dotHoverEventColor);
				$('#'+id+'NameGraph').find('.phase').attr('stroke','orange');
				
				drawRect(init.svg, 
						$(this).parent().find('.rectangle').attr('x'), 
						$(this).parent().find('.rectangle').attr('y'), 
						rectWidth, dif.yDif*questions.length, 
						'none', 'rectHoverVerticalGuide', '').attr('stroke','orange');
				
				//가로 가이드라인!
				var thisClass = $(this).attr('class');
				var thisOrder = thisClass.split(' ')[3];
				thisOrder = thisOrder.substring('order'.length, thisOrder.length)*1;
				$('#parallelGuideLine'+thisOrder).find('text').attr('fill','orange');
				var parallelSplit = $(this).attr('class').split(' ');
				drawRect(init.svg, 
						init.matrixRoot.attr('x')*1, $('.'+parallelSplit[0]+'.'+parallelSplit[2]).attr('y')*1, 
						dif.xDif*personList.length-3.5, dif.yDif, 
						'none', 'rectHoverParallelGuide', '').attr('stroke','orange');
				//here
				
				split = split[1].split(' ');
				guideCircleColorChange(split[split.length-1]);
				if(first != second){
					var firstClass = $('#'+first).attr('class');
					var secondClass = $('#'+second).attr('class');
					split = firstClass.split(' ');
					guideCircleColorChange(split[split.length-1]);
					split = secondClass.split(' ');
					guideCircleColorChange(split[split.length-1]);
				}
				
				$(this).parent().find('.meaningful').attr('fill','orange');

			}).on('mouseout', function(){
				d3.selectAll('.similarityCircle').attr('fill','rgba(53,158,131,0)');
				d3.selectAll('.real').attr('fill',nodeColor);
				var objId = $(this).parent().attr('id');
				var id = objId.split(' ')[0];
				
				$('#'+id+'NameGraph').find('.phase').attr('stroke',nameGraphColor);
				
				var thisClass = $(this).attr('class');
				var thisOrder = thisClass.split(' ')[3];
				thisOrder = thisOrder.substring('order'.length, thisOrder.length)*1;
				$('#parallelGuideLine'+thisOrder).find('text').attr('fill',leftGuideTextColor);
				
				$(this).parent().find('.meaningful').attr('fill',smallRectColor);
				$('.rectHoverVerticalGuide').remove();
				$('.rectHoverParallelGuide').remove();
				$('.Hover').remove();
			}).on('click', function(){
//				d3.selectAll('.compareOk').attr('fill','rgba(221,214,197,0.5)');
//				d3.selectAll('.compareSmallCell').attr('fill','rgba(54,163,135,0.5)');
				var parent = $(this).parent()
				if((parent.attr('toggle') == null || parent.attr('toggle') == 'no') &&
						$('#compareButton').val() == 'reset'){
					parent.find('.compareOk').attr('fill',compareOkColor);
					parent.find('.compareSmallCell').attr('fill',smallRectColor);
					parent.attr('toggle','yes');
				}else if((parent.attr('toggle') != null || parent.attr('toggle') == 'yes') &&
						$('#compareButton').val() == 'reset'){
					parent.find('.compareOk').attr('fill',compareNoColor);
					parent.find('.compareSmallCell').attr('fill',smallRectNoColor);
					parent.attr('toggle','no');
				}
			});
		}
		
		meaningful = [];
		
		
		
	}
}


function findMeaningfulVariable(meaningful,phasePattern){
	var one = [];
	var two = [];
	var three = [];
	var plag1 = true;
	var plag2 = true;
	var plag3 = true;
	
	for(var i=0; i<meaningful.length; i++){
		if(meaningful[i].value == 'NA' || meaningful[i].value == '9') {
			return false;
		}
	}
	
	for(var i=0; i<phasePattern.length; i++){
		switch(phasePattern[i]){
			case 1 : one.push(i); break;
			case 2 : two.push(i); break;
			case 3: three.push(i); break;
		}
	}
	
	for(var i=0; i<one.length; i++){
		if(meaningful[one[i]].value != meaningful[one[0]].value) {
			plag1=false; break;		
		}
	}
	
	for(var i=0; i<two.length; i++){
		if(meaningful[two[i]].value != meaningful[two[0]].value) {
			plag1=false; break;		
		}
	}
	
	for(var i=0; i<three.length; i++){
		if(meaningful[three[i]].value != meaningful[three[0]].value) {
			plag1=false; break;		
		}
	}
	
	if(plag1&&plag2&&plag3){
		if(one.length != 0 && two.length !=0){
			if(meaningful[one[0]].value == meaningful[two[0]].value) plag1=false;
		}else if(one.length != 0 && three.length !=0){
			if(meaningful[one[0]].value == meaningful[three[0]].value) plag1=false;
		}else if(two.length != 0 && three.length !=0){
			if(meaningful[two[0]].value == meaningful[three[0]].value) plag1=false;
		}
	}
	
	return (plag1&&plag2&&plag3);
}

function changeValueToYPos(question, value, height){
	var range;

	if(question.search('km_') != -1){range = 1;}
	else if(question.search('q_kdsq') != -1){range = 2;}
	else if(question.search('a_siadl') != -1){range = 3;}
	else if(question.search('b_cga_npi') != -1){range = 5;}
	else if(question.search('g_cdr') != -1){range = 3;}
	else if(question.search('rf_his') != -1){range = 3;}
	else if(question.search('b_ksf_gds') != -1){range = 3;}
	
	return height/range*value;
	
	
}
$(document).ready(function(){
	$('#buttonList').change(function(){
		var thisObj = $(this).find(':selected');
		var rect = $('#matrixArea > svg > matrixSvg');
		
		var dendro = $('#dendroSelect option:selected').val();
//		if(dendro == 'testDendro'){
//			$('#treeArea > svg').fadeOut('slow', function(){
//				drawBasicTriangle(treeInit);
//				//now here!
//			});
//		}else{
//			
//		}
		
		$('#matrixArea > svg').fadeOut('slow',function(){
			$('#matrixArea > svg').empty();
			selected = thisObj.val();
			questions = questionsList[selected];
			
			init.svg.append('rect').attr({
				x : init.padding + 30,
				y : 20,
				width : init.graphW,
				height : init.graphH,
				fill : 'none',
				stroke : 'none',
				id : 'matrixSvg'
			});
			if(selected != 'kmmseList'){
	    		dif = {
	    	    	xDif : init.graphW/nameList.length,
	    	    	//yDif : init.graphH/questions.length
	    	    	yDif : init.graphH/(questionsList['kmmseList'].length-5)
	    	    }
	    	}else{
	    		dif = {
	    			xDif : init.graphW/nameList.length,
	    	    	yDif : init.graphH/questions.length
	    		}
	    	}
		    	makePatientRect(init, dif);
		    	drawVariableText(init, dif);
		    	dataInputMatrix(init);
		    	drawPhaseGraph(init, dif);
		    	d3.selectAll('.verticalGuideLine').moveToFront();
		    	$('#matrixArea > svg').fadeIn('slow',function(){
		    		
		    	});
		    	$('#compareButton').attr('toggle','no');
		    	$('#compareButton').val('compare');
		});
		
		
		
	});
	
	$('#compareButton').click(function(){
		if($(this).attr('toggle') == 'no'){
			$(this).val('reset');
			$(this).attr('toggle','yes');
			d3.selectAll('.compareOk').attr('fill',compareNoColor);
			d3.selectAll('.compareSmallCell').attr('fill',smallRectNoColor);
		}else{
			$(this).val('compare');
			$(this).attr('toggle','no');
			d3.selectAll('.compareOk').attr('fill',compareOkColor);
			d3.selectAll('.compareSmallCell').attr('fill',smallRectColor);
		}
		
	});
	
	$('#changeColor').click(function(){
		if($(this).attr('toggle') == 'no'){
			$(this).val('click!');
			$(this).attr('toggle','yes');
			
			d3.selectAll('circle, rect, line, text').attr('class', function(){
				return d3.select(this).attr('class')+' active';
			});
			
			$('.active').click(function(){
				
				var thisClass = $(this).attr('class');
				var color,val;

				if(thisClass.search('similarityCircle real') != -1 || thisClass.search('similarityCircle') != -1){
					//원인 경우
					color = $(this).attr('fill');
					val = prompt('change color!',color);
					d3.selectAll('.similarityCircle real').attr('fill',val);
					nodeColor = val;
				}else if(thisClass.search('phase') != -1){
					//네임 그래프
					color = $(this).attr('stroke');
					val = prompt('change color!',color);
					d3.selectAll('.phase').attr('stroke',val);
					nameGraphColor = val;
				}else if(thisClass.search('smallRect') != -1){
					//바 그래프 색상
					if(thisClass.search('nullValue') == -1){
						//값이 0 이상인 바 그래프
						color = $(this).attr('fill');
						val = prompt('change color!',color);
						d3.selectAll('.smallRect').attr('fill',val);
						d3.selectAll('.nullValue').attr('fill',nullValueColor);
						// smallRectColor = 'rgba(54,163,135,1)';
					}else if(thisClass.search('nullVlaue') != -1){
						//값이 null인 바 그래프
						color = $(this).attr('fill');
						val = prompt('change color!',color);
						d3.selectAll('.nullValue').attr('fill',val);
						nullValueColor = val;
					}
				}else if(thisClass.search('rectangle') != -1){
					//배경 사각형! matrix에서 바탕을 나타내는 사각형
					if(thisClass.search('compareOk') != -1){
						//opacity가 100%인 배경 사각형
						color = $(this).attr('fill');
						val = prompt('change color!',color);
						d3.selectAll('.compareOk').attr('fill',val);
						compareOkColor = val;
					}else{
						//opacity가 50%인 배경 사격형
						color = $(this).attr('fill');
						val = prompt('change color!',color);
						d3.selectAll('.rectangle').attr('fill',val);
						d3.selectAll('.compareOk').attr('fill',compareOkColor);
						compareNoColor = val;
					}
				}
			});
			
		}else if($(this).attr('toggle') == 'yes'){
			$(this).val('changeColor');
			$(this).attr('toggle','no');
			
			$('.active').click(null);
			
			d3.selectAll('circle, rect, line, text').attr('class', function(){
				var thisClass = d3.select(this).attr('class');
				return thisClass.substring(0, thisClass.length - (' active').length);
			});
			
		}
	});
	
	$('#dendroSelect').change(function(){
		var dendro = $(this).val();
		if(dendro == 'wholeDendro'){
			async.waterfall([
			    function(cb){
			    	$('#treeArea > svg').fadeOut('slow', function(){
						$(this).empty();
						var treeRoot = treeInit.svg.append('rect').attr({
							x : treeInit.padding + 30,
							y : 10,
							width : treeInit.graphW,
							height : treeInit.graphH+5,
							fill : 'none',
							stroke : 'none',
							id : 'treeSvg'
						});
						
						treeInit.treeRoot = treeRoot;
						$(this).show();
						cb(null)
					});
			    }, function(cb){
			    	$('#matrixArea > svg').fadeOut('slow',function(){
						$(this).empty();
						var root = init.svg.append('rect').attr({
							x : init.padding + 30,
							y : 20,
							width : init.graphW,
							height : init.graphH,
							fill : 'none',
							stroke : 'none',
							id : 'matrixSvg'
						});
						
						init.matrixRoot = root;
						$(this).show();
						cb(null, 'end');
			    	});
			    }
			], function(err, result){
				firstSetting(function(){
					console.log(result);
				});
			});
		}
	});
});


	
