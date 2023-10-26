let song; // Variable to hold the audio file
let fft;  // Variable to hold the Fast Fourier Transform (FFT) object
let amp;  // Variable to hold the Amplitude object
let history = []; // An array to store volume history data

// Preload function to load the audio file before the sketch starts
function preload() {
    song = loadSound("audio/sample-visualisation.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(RGB);
    rectMode(CENTER);

    // Initialize the FFT object with a smoothing factor and the number of bins
    fft = new p5.FFT(0.9, 512);

    // Initialize the Amplitude object
    amp = new p5.Amplitude();
}

function draw() {
    background(33); // Set the background color to a dark gray

    // Get the current volume level and add it to the history array
    let vol = amp.getLevel();
    history.push(vol);

    stroke(255);
    noFill();
    beginShape();
    // Draw a history graph of volume levels
    for (let i = 0; i < history.length; i++) {
        let y = map(history[i], 0, 1, height - 60, height / 2 - 155 / 2);
        vertex(i, y);
    }
    endShape();

    if (history.length > width) {
        history.splice(0, 1); // Remove the oldest data point when the history is too long
    }

    let spectrum = fft.analyze();
    push();
    translate(width / 2, height / 2); // Move the origin to the center of the canvas

    // Get the energy within a specific frequency range (20-200 Hz)
    let amp1 = fft.getEnergy(20, 200);

    push();
    if (amp1 > 230) {
        rotate(random(-1, 1)); // Rotate if the amplitude is high
    }
    pop();

    fill(33);
    noStroke();
    colorMode(HSB);

    strokeWeight(3);
    noFill();

    // Adjust the waveform's size based on the mouse position
    let scaleFactor = (mouseX / windowWidth) + 1;

    // Draw the circular waveform using spectrum data
    for (let i = 0; i < spectrum.length; i += 6) {
        let angle = map(i, 1, spectrum.length, 0, 360) - 90;
        let amp2 = spectrum[i];
        let r = map(amp2, 0, 256, 80 * scaleFactor, 250 * scaleFactor);
        let x = r * sin(angle);
        let y = r * cos(angle);

        line(0, 0, x, y);
        line(x * 1.05, y * 1.05, x * 1.06, y * 1.06);
        stroke(i / 1.4, 200, 200);
    }
    noStroke();
    colorMode(RGB);
    fill(33);
    circle(0, 0, 155); // Draw a central circle

    // Get the centroid of the spectrum and display it as text
    let spectralCentroid = fft.getCentroid();

    fill(255);  // Text color is white
    textAlign(CENTER, CENTER);
    text('Centroid: ' + round(spectralCentroid) + ' Hz', 0, 0);
    pop();
    noStroke();
    fill(255);
    text('Please Click to start the music. Move your mouse from left to right to change the size of the circular waveform.', 20, 40);
    text("Don't you think the circular waveform resembles the sun, and the amplitude resembles mountains (or some sort of landscape)?", 20, height - 40);
}

// Function to start or pause the music when the canvas is clicked
function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}
