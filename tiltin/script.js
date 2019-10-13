const textItems = [...document.querySelectorAll('.text')];

const SENSITIVITY = 4;
const ITEMS_COUNT = textItems.length + SENSITIVITY;
const DEVICE_BETA_MAX = 180;
const DEVICE_GAMMA_MAX = 90;
const TEXT_BETA_PART = DEVICE_BETA_MAX / ITEMS_COUNT;
const TEXT_GAMMA_PART = DEVICE_GAMMA_MAX / ITEMS_COUNT;

const handleDeviceOrientation = ({ beta, gamma }) => {
  const updateItemFont = (item, index) => {
    const order = beta < 0 ? ITEMS_COUNT - index - 1 - SENSITIVITY : index;
    const divisionNumber = (order) * TEXT_BETA_PART;
    const fontWeight = Math.floor(Math.abs(beta) - divisionNumber);
    const fontVariationValue = `'wght' ${fontWeight * 30}`;
    const skewX = Math.floor(gamma / 5);
    const transformValue = `skewX(${-skewX}deg)`;

    item.style.fontVariationSettings = fontVariationValue;
    item.style.transform = transformValue;
  };
  textItems.forEach(updateItemFont);
};

window.addEventListener('deviceorientation', handleDeviceOrientation);