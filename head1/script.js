setTimeout(function(){
  var world = tQuery.createWorld().boilerplate().start().removeCameraControls();
  var object = tQuery.createCube().addTo(world);
  var headTracker = tQuery.createHeadtrackr().start().debugView(true).addEventListener("found", function(event){
    object
    .positionX(event.x)
    .positionY(event.y)
    .rotationX(event.height/10)
    .rotationY(event.width/10)
    .rotationZ((event.angle-Math.PI)/3);
  });
}, 1000);
