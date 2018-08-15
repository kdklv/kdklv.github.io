// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine;
var world;
var boxes = [];


function setup(){
  createCanvas(800, 800);
  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);

}

function mousePressed() {
  boxes.push(new Box(mouseX, mouseY, 10, 10 ));

}

function draw() {
  background(180);
  for (var i = 0; i < boxes.lenght; i++){
  boxes[i].show();
  }
 }
