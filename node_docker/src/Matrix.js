export function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

export function DSigmoid(y) {
    return y * (1 - y);
}

export function ReLU(x) {
    if (x <= 0) return 0;
    if (x >= 255) return 255;
    return x;
}


export function DReLU(y) {
    if (y <= 0) return 0;
    return 1;
}

export function crossEntropyLoss(truth, pred) {
    let reciPred = Matrix.reciprocal(pred);
    let loss = Matrix.hadamardMult(reciPred, truth);
    loss.scalarMult(-1);
    return loss;
}

export function normalizeArr(arr) {
    let sum = arr.reduce((a, b) => a + b);
    if (sum == 0) {
        sum = 1;
    }
    let newArr = arr.map((a) => a / sum);
    return newArr;
}

export class Matrix {
    constructor(width, height, init = true) {
        this.matrix = [];
        this.width = width;
        this.height = height;
        if (init) {
            for (let i = 0; i < width * height; i++) {
                this.matrix[i] = 0;
            }
        }
    }

    static matrixSum(a, b) {
        if (a.width != b.width || a.height != b.height) {
            console.error("Matrices are not compatible for sum.");
        }
        let summed = new Matrix(a.width, a.height);

        for (let i = 0; i < a.matrix.length; i++) {
            summed.matrix[i] = a.matrix[i] + b.matrix[i];
        }
        return summed;
    }

    static matrixSub(a, b) {
        if (a.width != b.width || a.height != b.height) {
            console.error("Matrices are not compatible for subtraction.");
        }
        let subbed = new Matrix(a.width, a.height, false);

        for (let i = 0; i < a.matrix.length; i++) {
            subbed.matrix[i] = a.matrix[i] - b.matrix[i];
        }
        return subbed;
    }

    static hadamardMult(a, b) {
        if (a.width != b.width || a.height != b.height) {
            console.error("Matrices are not compatible for subtraction.");
        }
        let hadaMult = new Matrix(a.width, a.height, false);

        for (let i = 0; i < a.matrix.length; i++) {
            hadaMult.matrix[i] = a.matrix[i] * b.matrix[i];
        }
        return hadaMult;
    }

    static matrixMult(a, b) {
        if (a.width != b.height) {
            console.error("Matrices are not compatible for cross product.");
        }
        let crossed = new Matrix(b.width, a.height, false);
        for (let i = 0; i < a.height; i++) {
            let aRow = a.matrix.slice(i * a.width, (i + 1) * a.width);
            for (let j = 0; j < b.width; j++) {
                let bCol = [];
                for (let k = j; k < b.matrix.length; k += b.width) {
                    bCol.push(b.matrix[k]);
                }

                let prod = aRow.map((x, i) => x * bCol[i]);
                let sum = prod.reduce((a, b) => a + b);
                crossed.matrix[j + i * b.width] = sum;
            }
        }
        return crossed;
    }

    static transpose(a) {
        let transposed = new Matrix(a.height, a.width, false);

        for (let i = 0; i < a.width; i++) {
            for (let j = 0; j < a.height; j++) {
                let aInd = i + j * a.width;

                transposed.matrix.push(a.matrix[aInd]);
            }
        }
        return transposed;
    }

    static toArray(m) {
        return m.matrix.slice(0, m.matrix.length);

    }

    static fromArray(arr, w, h) {
        if (w * h != arr.length) {
            console.error("Cannot convert array to matrix of the provided dimensions.");
            return;
        }

        let m = new Matrix(w, h, false);
        m.matrix = arr.slice(0, arr.length);
        return m;
    }

    static copyMatrix(a) {
        let copied = new Matrix(a.width, a.height, false);

        for (let i = 0; i < a.matrix.length; i++) {
            copied.matrix[i] = a.matrix[i];
        }
        return copied;
    }

    static matrixMap(a, f) {
        let mapped = new Matrix(a.width, a.height, false);
        for (let i = 0; i < a.matrix.length; i++) {
            mapped.matrix[i] = f(a.matrix[i]);
        }
        return mapped;
    }

    static reciprocal(a) {
        let reci = new Matrix(a.width, a.height, false);
        for (let i = 0; i < a.matrix.length; i++) {
            reci.matrix[i] = 1 / a.matrix[i];
            if (a.matrix[i] == 0) {
                reci.matrix[i] = 0;
            }
        }
        return reci;
    }


    randomize() {
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] = Math.random() * 2 - 1;
        }
    }

    scalarAdd(n) {
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] += n;
        }
    }

    scalarMult(n) {
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] *= n;
        }
    }

    matrixSum(b) {
        if (b.width != this.width || b.height != this.height) {
            console.error("Matrices not compatible for addition.");
            return;
        }
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] += b.matrix[i];
        }
    }

    matrixSub(b) {
        if (b.width != this.width || b.height != this.height) {
            console.error("Matrices not compatible for addition.");
            return;
        }
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] -= b.matrix[i];
        }
    }

    mutate(mr) {
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] += randomGaussian(0, mr);
        }
    }

    rotate() {
        let rotated = new Matrix(this.height, this.width, false);

        for (let i = 0; i < this.width; i++) {
            for (let j = this.height - 1; j >= 0; j--) {
                rotated.matrix.push(this.matrix[i + j * this.width]);
            }
        }

        return rotated;
    }

    rotate180() {
        let rotated180 = new Matrix(this.width, this.height, false);
        rotated180.matrix = this.matrix.slice(0, this.matrix.length).reverse();
        return rotated180;
    }

    clip(min, max) {
        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i] = Math.min(max, Math.max(min, this.matrix[i]));
        }
    }

    avg() {
        return this.matrix.reduce((a, b) => a + b) / this.matrix.length;
    }

    softmax() {
        if (this.matrix.length == 1) {
            return;
        }

        let max = Math.max(...this.matrix);
        this.scalarAdd(-max);

        let exponential = this.matrix.map(Math.exp);
        let sumOfExp = exponential.reduce((a, b) => a + b);
        if (sumOfExp == 0) {
            sumOfExp = 1; //do normal normalization if sum is 0?
        }
        this.scalarMult(1 / sumOfExp);
    }

    static deserialize(matrixObj) {
        let m = new Matrix(matrixObj.width, matrixObj.height, false);
        m.matrix = matrixObj.matrix;
        return m;
    }
}