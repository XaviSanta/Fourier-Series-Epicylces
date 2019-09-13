const USER = 0;
const FOURIER = 1;

let time = 0;
let path = [];
let speed = 0.02;
let signalX = [];
let fourierX;

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
        signalX.push(new Complex(uDrawing[i].x, uDrawing[i].y));
    }
    
    fourierX = dft(signalX); 

    fourierX.sort((a,b) => b.amplitude - a.amplitude);
}

function keyTyped() {
    if (key === 'r') {
        background(255);
    }
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
    let v = drawEpiCylces(width / 2,  height / 2, fourierX, 0);
    path.unshift(v);
}

function drawEpiCylces(x, y, fourier, rotation) {
    for(let i = 0; i < fourier.length; i++){
        let prevx = x;
        let prevy = y;
        [x, y, radius] = setupXYFourier(x, y, i, fourier, rotation);
        if(i == fourier.length - 1) {
            path.unshift(y);
        }else if(i < 5){
            drawCircle(i, prevx, prevy, radius);
            drawConnection(prevx, prevy, x, y);
        }
        
            
        //drawDot(x, y);
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
    stroke(255,0,0);
    noFill();
    line(prevx, prevy, x, y);
}

function drawDot(x, y) {
    stroke(0);
    ellipse(x, y, 3);
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

function restart() {
    uDrawing = [];
    signalX = [];
    time = 0;
    path = [];
}