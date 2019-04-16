let p = document.querySelectorAll('p');

if ('ondevicelight' in window) {
  
  window.addEventListener('devicelight', (ev) => {
    output.textContent = ev.value;
  });
  
} else if ('AmbientLightSensor' in window) {

  let sensor = new AmbientLightSensor();
  sensor.start();
    
  sensor.onreading = () => {
    output.textContent = sensor.illuminance;
  };
  
} else {
  p[1].hidden = true;
  p[0].hidden = false;
}