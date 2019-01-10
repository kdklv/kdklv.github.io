

const line = new LeaderLine(
  document.querySelector('.box-1'),
document.querySelector('.grid__item-bg'),    
    { 
      size: 1,
     path : 'straight',
     color : '#999',
     startPlug : 'disc',
     endPlug : 'disc',
      startSocket: 'right', 
      endSocket: 'left'
  } 
);
 addEventListener('scroll', AnimEvent.add(function() {
  if (line) { line.position(); }
 }), true);

