var cv, ctx, cx, cy, w, h, light;
var points = [];
var td = 100;
light = 0;
var tLight = 0;

var FPS = 60;
var DPI = Math.PI * 2;

function createPoints(total) {
	for (var i =0; i < total; i++) {
		var mass =  random(5,20);
		var p = {
			x : random(0,w),
			y : random(0,h),
			vx : random(-1,1),
			vy : random(-1,1),
			mass : mass,
			tMass : mass,
			cMass : mass
		}
		points.push(p);
		drawCircle(p.x, p.y, p.mass,"#FFFFFF")
	}
}


	window.addEventListener('devicelight', function(event) {
		console.log("event",event)
			tLight = event.value / 100;
	});




function render() {
	
	light += (tLight - light) / 20;
	clearCanvas(0.5);
	var l = points.length;
	for (var i =0; i < l; i++) {
		var p = points[i];

		p.x += p.vx;
		p.y += p.vy;
		testOffScreen(p);
		
		//p.tMass = p;
		//p.cMass += (p.tMass - p.cMass) / 10; 
		if (light > 0) {
			drawCircle(p.x, p.y, p.mass * light,"#FFFFFF");
		}
		else {
			drawCircle(p.x, p.y, p.mass ,"#FFFFFF");		
		}
	}
	
	requestAnimationFrame(render, 1000 / FPS);
}

function init() {
  createCanvas();
  createPoints(50);
  render();
}
init();


//--UTILS-----------------------
function createCanvas() {

  cv = document.getElementById("mycanvas");
  cv.width = document.body.clientWidth;
  console.log(document.body.clientHeight)
  cv.height = window.innerHeight;
  if (cv.getContext) {
    ctx = cv.getContext('2d');
    w = cv.width;
    h = cv.height;
    cx = w / 2;
    cy = h / 2;
  } else {
    alert("This browser does not support canvas");
  }
}

function testOffScreenBounce(p) {
	if (p.y > h || p.y < 0) {
			p.vy *= -1;
	} 
	if (p.x > w || p.x < 0) {
		p.vx *= -1;
	}
}

function testOffScreen(p) {
	if (p.y > h ) {
			p.y = 0;
	} else if (p.y < 0) {
		p.y = h;
	}
	if (p.x > w) {
		p.x = 0;
	} else if (p.x < 0) {
		p.x = w;
	}
}

function createBufferCanvas() {
	
	bcv = document.createElement("canvas");
	bcv.width = w;
	bcv.height = h;
	bctx = bcv.getContext('2d');
}

function loadImage(imageUrl, callback)
{
  var img = new Image();
  img.src = imageUrl	;
  img.onload = function(){
		callback(img);
  }
}

function random(min,max) {
  return Math.random() * (max - min) + min;
}

function clearCanvas(opacity) {
  ctx.globalAlpha = opacity;
  ctx.fillStyle = 0x000000;
  ctx.fillRect(0, 0, w, h);
	ctx.globalAplha = 1;
}


function drawCircle(x, y, radius, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
	ctx.lineWidth = 0.2
  ctx.strokeStyle = "#000000";
  ctx.arc(x, y, radius, 0, DPI, true);
  ctx.closePath();
  ctx.fill();	
	ctx.stroke()
}
function drawPolygon(x,y, rot, radius, sides, colour) {
	ctx.fillStyle = colour;
  ctx.beginPath();
	var step = (360 / sizes) + rot;
	var tx, ty;
  for(var i = 0; i < sides; i++ ) {
		tx = radius * Math.cos((step * i) / RAD);
		ty = radius * Math.sin((step * i) / RAD);
		
	}
  ctx.closePath();
  ctx.fill();	
}

function drawLine(x,y,tx,ty, color, opacity) {
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.lineWidth = 1
  ctx.strokeStyle = color;
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1;
}