var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var $screen = document.querySelector('.screen');

var lineOptions = {
  size: 1,
  startSocket: 'right',
  path: 'straight',
  endSocket: 'left',
  startPlug: 'behind',
  endPlug: 'behind' };


var dragOptions = {
  autoScroll: $screen };

  

var $box1 = document.querySelector('#box-1');
var $box2 = document.querySelector('#box-2');
var $box3 = document.querySelector('#box-3');

var line1 = new LeaderLine(
$box1.querySelector('.anchor.is-out'),
$box2.querySelector('.anchor.is-in'), _extends({},

lineOptions, {
  color: '#000' }));




var line2 = new LeaderLine(
$box1.querySelector('.anchor.is-out'),
$box3.querySelector('.anchor.is-in'), _extends({},

  lineOptions, {
    color: '#000',
    endPlugColor: '#BA2525',
    gradient: true }));





var dragBox1 = new PlainDraggable($box1, _extends({}, dragOptions));
var dragBox2 = new PlainDraggable($box2, _extends({}, dragOptions));
var dragBox3 = new PlainDraggable($box3, _extends({}, dragOptions));

dragBox1.onMove = function () {
  line1.position();
};
dragBox2.onMove = function () {
  line1.position();
  line2.position();
};
dragBox3.onMove = function () {
  line2.position();
};

$screen.addEventListener('scroll', AnimEvent.add(function () {
  line1.position();
  line2.position();
}), false);