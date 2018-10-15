var draw = SVG('canvas').size('100%', '100%'),
    elements = document.getElementsByClassName('box'),
    lines = [];

// store the size and position of the elements
var elementsPos = [];
for (var i = 0, len = elements.length; i < len; i++) {
  var elemPos = elements[i].getBoundingClientRect();
  elementsPos.push(elemPos);
}

// initially draw a line per element
// start with 1 to leave out reference element
for (var i = 1, len = elementsPos.length; i < len; i++) {
  var line = draw.line(
    elementsPos[0].left + elementsPos[0].width / 2, elementsPos[0].top + elementsPos[0].height / 2, 
    elementsPos[i].left + elementsPos[i].width / 2, elementsPos[i].top + elementsPos[i].height / 2
  ).stroke({ width: 1, color: '#fff' });
  
  lines.push(line);
}

var updateLines = function() {
  // loop through lines to update each of it
  for (var i = 0, len = lines.length; i < len; i++) {
    lines[i].plot([
      [elementsPos[0].left + elementsPos[0].width / 2, elementsPos[0].top + window.pageYOffset + elementsPos[0].height / 2],
      // we have elements.length-1 lines, so we always draw lines from the fixed element to the targets
      [elementsPos[i+1].left + elementsPos[i+1].width / 2, elementsPos[i+1].top + elementsPos[i+1].height / 2]
    ]);
  }
}

// update position and size of elements (needed on window resize)
var updateElemPos = function () {
  for (var i = 0, len = elementsPos.length; i < len; i++) {
    elementsPos[i] = elements[i].getBoundingClientRect();
  }
}

window.addEventListener('scroll', function() {
  updateLines();
});

window.addEventListener('resize', function() {
  updateElemPos();
  updateLines();
});