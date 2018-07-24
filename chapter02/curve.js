(function(){

var canvas = document.getElementById('canvas');
var quadratic = canvas.className.trim() == 'quadratic';
var code = document.getElementById('code');
var ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
var points = {};
function init(){
	points = {
		p1: {x:100,y:250},
		p2: {x:400,y:250},
	};
	if(quadratic){
		points.cp1={x:150,y:100};
	}else{
		points.cp1={x:150,y:100};
		points.cp2={x:350,y:100};
	}
	canvas.onmousedown = dragStart;
	canvas.onmousemove = dragging;
	canvas.onmouseup = dragEnd;
	draw();
}
init();

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.moveTo(points.p1.x, points.p1.y);
	if(quadratic){
		ctx.quadraticCurveTo(points.cp1.x,points.cp1.y,
							points.p2.x,points.p2.y);
	}else{
		ctx.bezierCurveTo(points.cp1.x,points.cp1.y,
							points.cp2.x,points.cp2.y,
							points.p2.x,points.p2.y);
	}
	ctx.lineWidth = 6;
	ctx.strokeStyle = 'black';
	ctx.lineCap = 'round';
	ctx.stroke();
	controlsLine();
	for(var p in points){
		circle(points[p].x, points[p].y, 10);
	}
	showCode();
}

function circle(x, y, radius){
	ctx.beginPath();
	ctx.lineWidth=2;
	ctx.arc(x, y, radius, 0, Math.PI*2);
	ctx.fill();
	ctx.stroke();
}

//画控制线
function controlsLine(){
	ctx.beginPath();
	ctx.lineWidth=1;
	ctx.strokeStyle='red'
	ctx.moveTo(points.p1.x, points.p1.y);
	ctx.lineTo(points.cp1.x, points.cp1.y);
	ctx.moveTo(points.p2.x, points.p2.y);
	if(quadratic){
		ctx.lineTo(points.cp1.x, points.cp1.y);
	}
	else{
		ctx.lineTo(points.cp2.x, points.cp2.y);
	}
	ctx.stroke();
}

function showCode(){
	code.innerHTML  = '\
canvas = document.getElementById("canvas");\n\
ctx = canvas.getContext("2D");\n\
ctx.lineWidth = 6;\n\
ctx.strokeStyle = "black";\n\
ctx.beginPath();\n\
ctx.moveTo(' +
	[points.p1.x, points.p1.y].join()
+ ');\ncontext.bezierCurveTo('+
	(quadratic? 
		[points.cp1.x, points.cp1.y, points.p2.x, points.p2.y].join()
		:[points.cp1.x, points.cp1.y, points.cp2.x, points.cp2.y, points.p2.x, points.p2.y].join())
+');\n\
ctx.stroke();\n\
'
}

var mousePos, drag;
// onmousedown
function dragStart(event){
	mousePos = getMousePos(event);
	for(var p in points){
		var x=mousePos.x - points[p].x;
		var y=mousePos.y - points[p].y;
		if(x*x + y*y < 100){
			drag = p;
			return;
		}
	}
}

// onmousemove
function dragging(event){
	if(drag){
		// 获得现在鼠标所在位置
		// 拖拽的点的位置加上鼠标位置的变化量
		var curPos = getMousePos(event);
		
		points[drag].x += curPos.x-mousePos.x;
		points[drag].y += curPos.y-mousePos.y;
		//console.log(points[drag]);
		mousePos = curPos;
		
		canvas.style.cursor='move';
		draw();
	}
}

//onmouseleave
function dragEnd(event){
	if(drag){
		drag=null;
		canvas.style.cursor='default'
		draw();
	}
}

// 鼠标在画布上的位置
function getMousePos(event){
	return {
		x:event.clientX - canvas.getBoundingClientRect().left,
		y:event.clientY - canvas.getBoundingClientRect().top
	}
}

}());