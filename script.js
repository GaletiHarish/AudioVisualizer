// Create WaveSurfer instance
const waveSurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple',
    barWidth: 2,
});

// Initialize drag-and-drop functionality
document.addEventListener('DOMContentLoaded', () => {
    const waveform = document.querySelector('#waveform');
    waveform.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    waveform.addEventListener('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleAudioFile(files[0]);
    });
});

// Handle audio file upload using the file input element
const audioUpload = document.getElementById('audio-upload');
audioUpload.addEventListener('change', (e) => {
    handleAudioFile(e.target.files[0]);
});

// Handle the uploaded audio file
function handleAudioFile(file) {
    if (file) {
        const fileURL = URL.createObjectURL(file);
        waveSurfer.load(fileURL);
        waveSurfer.on('ready', initializeWebAudioAPI);
    }
}
let audioContext;
let analyzerNode;

// Initialize the Web Audio API components
function initializeWebAudioAPI() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzerNode = audioContext.createAnalyser();
    waveSurfer.backend.setFilter(analyzerNode);
}

// Extract the frequency data from the audio
function getFrequencyData() {
    const bufferLength = analyzerNode.frequencyBinCount;
    const frequencyDataArray = new Uint8Array(bufferLength);
    analyzerNode.getByteFrequencyData(frequencyDataArray);
    return frequencyDataArray;
}

// Extract the time domain data from the audio
function getTimeDomainData() {
    const bufferLength = analyzerNode.fftSize;
    const timeDomainDataArray = new Uint8Array(bufferLength);
    analyzerNode.getByteTimeDomainData(timeDomainDataArray);
    return timeDomainDataArray;
}

// Global variables for p5.js and visualization
let canvas;
let bars = [];

// p5.js setup function
function setup() {
    canvas = createCanvas(800, 400);
    canvas.parent('visualization-canvas');
    noStroke();
    colorMode(HSB);
}

// p5.js draw function
function draw() {
    background(0);
    const frequencyData = getFrequencyData();
    drawBars(frequencyData);
    function draw() {
        background(0);
        const frequencyData = getFrequencyData();
        drawBars(frequencyData);
    
        if (isCapturing) {
            capturer.capture(canvas.elt);
        }
    }
}

// Draw bars based on frequency data
function drawBars(frequencyData) {
    const barWidth = width / frequencyData.length;
    for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = map(frequencyData[i], 0, 255, 0, height);
        const hue = map(i, 0, frequencyData.length, 0, 360);
        fill(hue, 255, 255);
        rect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
}
const startButton = document.getElementById('start-btn');
startButton.addEventListener('click', startVisualization);

function startVisualization() {
    if (waveSurfer.isPlaying()) {
        waveSurfer.pause();
        noLoop(); // Pause the p5.js draw loop
    } else {
        waveSurfer.play();
        loop(); // Resume the p5.js draw loop
    }
}

// WaveSurfer playback event listeners
waveSurfer.on('play', () => {
    loop(); // Resume the p5.js draw loop
});

waveSurfer.on('pause', () => {
    noLoop(); // Pause the p5.js draw loop
});
// Global variables for ccapture.js
let capturer;
let isCapturing = false;

// Set up ccapture.js
function setupCapturer() {
    capturer = new CCapture({
        format: 'webm',
        framerate: 30,
        verbose: true,
    });
}

// Export Video button event listener
const exportButton = document.getElementById('export-btn');
exportButton.addEventListener('click', () => {
    if (!isCapturing) {
        isCapturing = true;
        setupCapturer();
        capturer.start();
        exportButton.textContent = 'Stop Exporting';
    } else {
        isCapturing = false;
        capturer.stop();
        capturer.save();
        exportButton.textContent = 'Export Video';
    }
});
// Global variables for customization options
const visualizationStyleSelect = document.getElementById('visualization-style');
const barWidthSlider = document.getElementById('bar-width');
const hueRangeSlider = document.getElementById('hue-range');

// p5.js draw function
function draw() {
    background(0);
    const frequencyData = getFrequencyData();

    const visualizationStyle = visualizationStyleSelect.value;
    const barWidth = barWidthSlider.value;
    const hueRange = hueRangeSlider.value;

    if (visualizationStyle === 'bars') {
        drawBars(frequencyData, barWidth, hueRange);
    } else if (visualizationStyle === 'circles') {
        drawCircles(frequencyData, hueRange);
    }
}

// Draw bars based on frequency data
function drawBars(frequencyData, barWidth, hueRange) {
    const numBars = width / barWidth;
    for (let i = 0; i < numBars; i++) {
        const barHeight = map(frequencyData[i], 0, 255, 0, height);
        const hue = map(i, 0, numBars, 0, hueRange);
        fill(hue, 255, 255);
        rect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
}

// Draw circles based on frequency data
function drawCircles(frequencyData, hueRange) {
    const numCircles = frequencyData.length;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < numCircles; i++) {
        const radius = map(frequencyData[i], 0, 255, 0, width / 2);
        const hue = map(i, 0, numCircles, 0, hueRange);
        fill(hue, 255, 255);
        const angle = map(i, 0, numCircles, 0, TWO_PI);
        const x = centerX + radius * cos(angle);
        const y = centerY + radius * sin(angle);
        ellipse(x, y, 10, 10);
    }
}
// Global variables for new customization options
const bgColorPicker = document.getElementById('bg-color');
const animationSpeedSlider = document.getElementById('animation-speed');
const colorPaletteSelect = document.getElementById('color-palette');

// p5.js draw function
function draw() {
    // ...
    const circleSize = circleSizeSlider.value;

    if (visualizationStyle === 'bars') {
        drawBars(frequencyData, barWidth, hueRange);
    } else if (visualizationStyle === 'circles') {
        drawCircles(frequencyData, hueRange, circleSize) 
            // ...
            for (let i = 0; i < numCircles; i++) {
                // ...
                ellipse(x, y, circleSize, circleSize);
            }
    }

    // Existing customization options
    // ...

    const animationSpeed = animationSpeedSlider.value;
    frameRate(animationSpeed);

    // Draw visualization based on selected style
    // ...
}

// Modify the drawBars and drawCircles functions to incorporate the color palette selection
function drawBars(frequencyData, barWidth, hueRange) {
    // ...
    const colorPalette = colorPaletteSelect.value;
    for (let i = 0; i < numBars; i++) {
        // ...
        const hue = getColorFromPalette(i, numBars, hueRange, colorPalette);
        fill(hue, 255, 255);
        // ...
    }
}

function drawCircles(frequencyData, hueRange) {
    // ...
    const colorPalette = colorPaletteSelect.value;
    for (let i = 0; i < numCircles; i++) {
        // ...
        const hue = getColorFromPalette(i, numCircles, hueRange, colorPalette);
        fill(hue, 255, 255);
        // ...
    }
}

// Function to get color based on the selected color palette
function getColorFromPalette(index, total, hueRange, colorPalette) {
    let hue;

    switch (colorPalette) {
        case 'rainbow':
            hue = map(index, 0, total, 0, hueRange);
            break;
        case 'warm':
            hue = map(index, 0, total, 0, hueRange / 2);
            break;
        case 'cool':
            hue = map(index, 0, total, 180, 180 + hueRange / 2);
            break;
    }

    return hue;
}
// Save Settings button event listener
const saveSettingsButton = document.getElementById('save-settings');
saveSettingsButton.addEventListener('click', exportSettings);

// Load Settings button event listener
const loadSettingsButton = document.getElementById('load-settings');
const settingsFileInput = document.getElementById('settings-file');
loadSettingsButton.addEventListener('click', () => {
    settingsFileInput.click();
});
settingsFileInput.addEventListener('change', importSettings);

// Function to export settings as a JSON file
function exportSettings() {
    const settings = {
        visualizationStyle: visualizationStyleSelect.value,
        barWidth: barWidthSlider.value,
        hueRange: hueRangeSlider.value,
        bgColor: bgColorPicker.value,
        animationSpeed: animationSpeedSlider.value,
        colorPalette: colorPaletteSelect.value,
    };

    const settingsBlob = new Blob([JSON.stringify(settings)], {type: 'application/json'});
    const settingsUrl = URL.createObjectURL(settingsBlob);

    const link = document.createElement('a');
    link.href = settingsUrl;
    link.download = 'visualization_settings.json';
    link.click();
}

// Function to import settings from a JSON file
async function importSettings(event) {
    const file = event.target.files[0];
    const settingsJson = await file.text();
    const settings = JSON.parse(settingsJson);

    visualizationStyleSelect.value = settings.visualizationStyle;
    barWidthSlider.value = settings.barWidth;
    hueRangeSlider.value = settings.hueRange;
    bgColorPicker.value = settings.bgColor;
    animationSpeedSlider.value = settings.animationSpeed;
    colorPaletteSelect.value = settings.colorPalette;
}
