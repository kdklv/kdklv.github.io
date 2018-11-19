const line = new LeaderLine(
  document.querySelector('.box-1'),
document.querySelector('.box-2'),    
    { 
      size: 1,
     path : 'straight',
     color : 'grey',
     startPlug : 'disc',
     endPlug : 'disc',
      startSocket: 'right', 
      endSocket: 'left'
  }

);

const line2 = new LeaderLine(
  document.querySelector('.box-1'),
  document.querySelector('.box-3'), 
    { 
      size: 1,
     path : 'straight',
     color : 'grey',
     startPlug : 'disc',
     endPlug : 'disc',
      startSocket: 'right', 
      endSocket: 'left'
  }

);

const line3 = new LeaderLine(
  document.querySelector('.box-2'),
  document.querySelector('.box-4'), 
    { 
      size: 1,
     path : 'straight',
     color : 'grey',
     startPlug : 'disc',
     endPlug : 'disc',
      startSocket: 'right', 
      endSocket: 'left'
  }

)

const line4 = new LeaderLine(
  document.querySelector('.box-1'),
  document.querySelector('.box-5'), 
    { 
      size: 1,
     path : 'straight',
     color : 'grey',
     startPlug : 'disc',
     endPlug : 'disc',
      startSocket: 'right', 
      endSocket: 'left'
  }

)



addEventListener('scroll', AnimEvent.add(function() {
  if (line) { line.position(); }
}), true);

addEventListener('scroll', AnimEvent.add(function() {
  if (line2) { line2.position(); }
}), true);
addEventListener('scroll', AnimEvent.add(function() {
  if (line3) { line3.position(); }
}), true);

addEventListener('scroll', AnimEvent.add(function() {
  if (line4) { line4.position(); }
}), true);