// Click "Allow" so your browser can use your webcam
// https://github.com/auduno/headtrackr/
var $dot = $('.dot');
var $debug = $('.debug');
var $box = $('.box');
var videoInput = document.getElementById('inputVideo');
  var canvasInput = document.getElementById('inputCanvas');

  var htracker = new headtrackr.Tracker({calcAngles: true});
  htracker.init(videoInput, canvasInput);
  htracker.start();

document.addEventListener('facetrackingEvent', 
  function (event) { 
  		$debug.html(
        "x: " + event.x +
        "<br>y: " + event.y
  );
    $dot.css({
      "left": (event.x - 160) + "px",
      "top": (event.y - 250) + "px",
       "transform" : "rotate(" + (event.angle * (180/3.1415) - 90) + "deg)"
    		});
  
  
  }
);