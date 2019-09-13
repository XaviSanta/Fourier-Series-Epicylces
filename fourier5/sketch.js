let time = 0;
let path = [];
let speed = 0.02;
let signalX = [];
let fourierX;

function setup() {
    createCanvas(windowWidth,windowHeight);
    setupDrawingPoints();
}

function setupDrawingPoints() {
    const skip = 20;
    for(let i = 0; i < drawing.length; i += skip) {
        const c = new Complex(drawing[i].x, drawing[i].y);
        signalX.push(c);
    }
    
    fourierX = dft(signalX); 
    console.log(fourierX);  

    fourierX.sort((a,b) => b.amplitude - a.amplitude);
}

function draw() {
    background(255);
    
    let v = drawEpicylces(width / 2, height / 2, fourierX, 0);
    path.unshift(v);
    drawImage(path);

    updateTime();

    clearDraw();
}

function drawEpicylces(x, y, fourier, rotation) {
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
    const dt = TWO_PI / fourierX.length;
    time += dt;
}

function clearDraw() {
    if(time > TWO_PI) {
        time = 0;
        path = [];
    }
}