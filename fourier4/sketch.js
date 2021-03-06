const USER = 0;
const FOURIER = 1;

let time = 0;
let path = [];
let speed = 0.02;
let signalX = [];
let signalY = [];
let fourierX;
let fourierY;

let uDrawing = [];
let state = -1;

function mousePressed() {
    state = USER;
    restart();
}

function mouseReleased() {
    state = FOURIER;
    setupDrawingPoints(); 
}

function setup() {
    createCanvas(windowWidth,windowHeight);
}

function setupDrawingPoints() {
    const skip = 1;
    for(let i = 0; i < uDrawing.length; i += skip) {
        signalX.push(uDrawing[i].x);
        signalY.push(uDrawing[i].y);
    }
    
    fourierX = dft(signalX); 
    fourierY = dft(signalY); 

    fourierX.sort((a,b) => b.amplitude - a.amplitude);
    fourierY.sort((a,b) => b.amplitude - a.amplitude);
}

function draw() {
    if (state == USER) {
        userDraw();
    } else if(state == FOURIER) {
        fourierDraw();
    }

}

function userDraw() {
    let point = createVector(mouseX - width/2, mouseY - height/2);
    uDrawing.push(point);
    stroke(0);
    noFill();
    beginShape();
    for(let v of uDrawing) {
        vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
}

function fourierDraw() {
    epicycle();
    drawImage(path);
    updateTime();
    clearDraw();
}

function epicycle() {
    vx = drawEpiCylces(width / 2, 100, fourierX, 0);
    vy = drawEpiCylces(100, height / 2, fourierY, HALF_PI);
    v = createVector(vx.x, vy.y);
    path.unshift(v);

    drawConnection(vx.x, vx.y, v.x, v.y);
    drawConnection(vy.x, vy.y, v.x, v.y);
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

function restart() {
    uDrawing = [];
    signalX = [];
    signalY = [];
    time = 0;
    path = [];
}