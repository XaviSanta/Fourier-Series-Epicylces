let time = 0;
let wave = [];
let speed = 0.02;
let sliderNumCircles;
let sliderSpeed;

function setup() {
    createSliders();
    createCanvas(1200,400);
}

function draw() {
    background(0);
    translate(200, 200);
    
    setupCircles(0,0);
    drawSinusoide(wave);

    time += sliderSpeed.value() * 0.01;

    clearDots(wave);
}

function createSliders() {
    sliderNumCircles = createSlider(1, 15, 2);
    sliderSpeed = createSlider(1, 10, 4);
}

function setupCircles(x, y) {
    for(let i = 0; i < sliderNumCircles.value(); i++){
        let prevx = x;
        let prevy = y;
        [x, y, radius] = setupXYFourier(x, y, i);
        if(i == sliderNumCircles.value() - 1) wave.unshift(y);
        
        drawCircle(i, prevx, prevy, radius);
        drawConnection(prevx, prevy, x, y);
        drawDot(x, y);
    }

    line(x, y, 100, y);
}

function setupXYFourier(x, y, i) {
    
    let n = i * 2 + 1; // 1, 3, 5, 7...
    let radius = 50 * (4 / (n * PI));
    
    x += radius * cos(n * time);
    y += radius * sin(n * time);

    return [x, y, radius]
}

function drawCircle(i, prevx, prevy, radius) {
    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
}

function drawConnection(prevx, prevy, x, y) {
    stroke(255, 203, 20);
    fill(255);
    line(prevx, prevy, x, y);
}

function drawDot(x, y) {
    noFill();
    ellipse(x, y, 2);
}

function drawSinusoide(wave) {
    beginShape();
    translate(100, 0); 
    for(let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();
}

function clearDots(wave) {
    if (wave.length > 800) {
        wave.pop();
    }
}