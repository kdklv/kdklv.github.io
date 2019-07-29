// Split it yo!
Splitting();

// Get my stuff
var myText = document.querySelector("h1");
var gammaText = document.getElementById('gamma');
var msg = document.getElementById('test');

// Check I can do the thing
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', deviceOrientationHandler, false)
}

// doing the things
function deviceOrientationHandler(evt) {
	
	// Minimum & Maximum font variation values
	const minFontWidth = 125;
	const maxFontWidth = 75;
	
	const minFontSlant = 0;
	const maxFontSlant = 1;
	
	// Minimum and Maximum gamma values
	const minGamma = -40;
	const maxGamma = 40;
	
	const minWidthGamma = -50;
	const maxWidthGamma = 0;
	
	// Get gamma value
	const currentGamma = evt.gamma;
	//gammaText.innerHTML = evt.gamma;
	
	//Scale within a range - Slant
	const percent = (currentGamma - minGamma) / (maxGamma - minGamma);
	const roundedSlantScale = Math.round((percent * (minFontSlant - maxFontSlant) + maxFontSlant) * 100) / 100

	//Scale within a range - Width
	const percentWidth = (currentGamma - minWidthGamma) / (maxWidthGamma - minWidthGamma);
	const roundedWidthScale = Math.round((percentWidth * (minFontWidth - maxFontWidth) + maxFontWidth) * 100) / 100
	
	// msg.innerHTML = roundedWeightScale;
	myText.style.setProperty("--width", roundedWidthScale);    	
	myText.style.setProperty("--slant", roundedSlantScale);

	if (currentGamma < -50) {
		 myText.classList.add('drop');
	} else {
		 myText.classList.remove('drop');
	}
}