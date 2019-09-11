let time = 0;
let path = [];
let speed = 0.02;
let sliderNumCircles;
let sliderSpeed;
let signalX = [];
let signalY = [];
let fourierX;
let fourierY;

function setup() {
    createSliders();
    createCanvas(1200,1400);
    setupDrawingPoints();
}

function setupDrawingPoints() {
    const skip = 15;
    for(let i = 0; i < drawing.length; i += skip) {
        signalX.push(drawing[i].x);
        signalY.push(drawing[i].y);
    }
    
    fourierX = dft(signalX); 
    fourierY = dft(signalY); 

    fourierX.sort((a,b) => b.amplitude - a.amplitude);
    fourierY.sort((a,b) => b.amplitude - a.amplitude);
}

function draw() {
    background(0);
    translate(200, 200);
    
    vx = drawEpiCylces(350,-100, fourierX, 0);
    vy = drawEpiCylces(-20,250, fourierY, HALF_PI);
    v = createVector(vx.x, vy.y);
    path.unshift(v);

    drawConnection(vx.x, vx.y, v.x, v.y);
    drawConnection(vy.x, vy.y, v.x, v.y);
    drawSinusoide(path);

    updateTime();

    clearDraw();
}

function createSliders() {
    sliderNumCircles = createSlider(1, 15, 2);
    sliderSpeed = createSlider(1, 10, 4);
}

function drawEpiCylces(x, y, fourier, rotation) {
    for(let i = 0; i < fourier.length; i++){
        let prevx = x;
        let prevy = y;
        [x, y, radius] = setupXYFourier(x, y, i, fourier, rotation);
        if(i == fourier.length - 1) 
            path.unshift(y);
            
        drawCircle(i, prevx, prevy, radius);
        drawConnection(prevx, prevy, x, y);
        drawDot(x, y);
    }

    return createVector(x, y);
}

function setupXYFourier(x, y, i, fourier, rotation) {
    let freq = fourier[i].freq;
    let radius = fourier[i].amplitude;
    let phase = fourier[i].phase;

    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    return [x, y, radius]
}

function drawCircle(i, prevx, prevy, radius) {
    stroke(255, 100);
    noFill();
    if (radius > 5)
        ellipse(i + prevx, i + prevy, radius * 2);
}

function drawConnection(prevx, prevy, x, y) {
    stroke(200);
    noFill(255);
    line(prevx, prevy, x, y);
}

function drawDot(x, y) {
    noFill();
    ellipse(x, y, 2);
}

function drawSinusoide(path) {
    beginShape();
    translate(0, 0); 
    for(let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();
}

function updateTime() {
    const dt = TWO_PI / fourierY.length;
    time += dt;
}

function clearDraw() {
    if(time > TWO_PI) {
        time = 0;
        path = [];
    }
}