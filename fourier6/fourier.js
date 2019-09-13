class Complex{
    constructor(a, b) {
        this.re = a;
        this.im = b;
    }

    mult(c) {
        const re = this.re * c.re - this.im * c.im;
        const im = this.re * c.im + this.im * c.re;
        return new Complex(re, im);
    }

    add(c) {
        this.re += c.re;
        this.im += c.im;
    }
}

// Discrete fourier transform
function dft(x) {
    let X = [];
    const N = x.length;

    for (let k = 0; k < N; k++) {
        let sum = new Complex(0, 0);

        for (let n = 0; n < N; n++) {
            const phi = (TWO_PI * k * n ) / N;
            const c = new Complex(cos(phi), -sin(phi));
            sum.add(x[n].mult(c));
            
        }

        // Average the sum
        sum.re = sum.re / N;
        sum.im = sum.im / N;
        
        let freq = k;
        let amplitude = sqrt(sum.re * sum.re + sum.im * sum.im);
        let phase = atan2(sum.im, sum.re);

        X[k] = { re: sum.re, im: sum.re,  freq, amplitude, phase };
    }

    return X;
}