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
    createCanvas(windowWidth,windowHeight);
    createSliders();
    textSize(30);
    setupDrawingPoints();
}

function setupDrawingPoints() {
    const skip = 20;
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
    background(255);
    drawTextSliders();
    translate(200, 200);
    
    vx = drawEpiCylces(350,-100, fourierX, 0);
    vy = drawEpiCylces(-20,250, fourierY, HALF_PI);
    v = createVector(vx.x, vy.y);
    path.unshift(v);

    drawConnection(vx.x, vx.y, v.x, v.y);
    drawConnection(vy.x, vy.y, v.x, v.y);
    drawImage(path);

    updateTime();

    clearDraw();
}

function createSliders() {
    // sliderSkipPoints = createSlider(1, 15, 2);
    // sliderSkipPoints.position(250, 20);

    // sliderSpeed = createSlider(1, 10, 4);
    // sliderSpeed.position(250, 50);
}

function drawTextSliders() {
    // text(sliderSkipPoints.value(), sliderSkipPoints.x + sliderSkipPoints.width, 35);
    // text('Skip Points', 20, 35);
    
    // text(sliderSpeed.value(), sliderSpeed.x + sliderSpeed.width, 65);
    // text('Speed Rotation', 20, 65);
}

function drawEpiCylces(x, y, fourier, rotation) {
    for(let i = 0; i < fourier.length; i++){
        let prevx = x;
        let prevy = y;
        [x, y, radius] = setupXYFourier(x, y, i, fourier, rotation);
        if(i == fourier.length - 1) 
            path.unshift(y);
            
        drawCircle(prevx, prevy, radius);
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

function drawCircle(prevx, prevy, radius) {
    stroke(0, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
}

function drawConnection(prevx, prevy, x, y) {
    stroke(200);
    noFill();
    line(prevx, prevy, x, y);
}

function drawDot(x, y) {
    noFill(0);
    stroke(100);
    ellipse(x, y, 2);
}

function drawImage(path) {
    stroke(0);
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