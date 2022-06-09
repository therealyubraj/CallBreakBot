import {
    Matrix,
    sigmoid,
    DSigmoid,
    
} from "./Matrix.js";
export class NN {
    constructor(inputs, hiddens, outputs, noH) {
        this.total = noH + 2;
        this.weights = [];
        this.biases = [];
        this.lr = 0.1;

        this.weights[0] = new Matrix(inputs, hiddens);
        this.weights[this.total - 2] = new Matrix(hiddens, outputs);

        this.biases[0] = new Matrix(1, hiddens);
        this.biases[this.total - 2] = new Matrix(1, outputs);

        for (let i = 1; i < this.total - 2; i++) {
            this.weights[i] = new Matrix(hiddens, hiddens);
            this.biases[i] = new Matrix(1, hiddens);
        }

        for (let i = 0; i < this.total - 1; i++) {
            this.weights[i].randomize();
            this.weights[i].scalarMult(Math.sqrt(2 / this.weights[i].width));
            this.biases[i].randomize();
        }
    }

    predict(ip) {
        let inputs = Matrix.fromArray(ip, 1, ip.length);

        let weightedSums = [];

        weightedSums[0] = Matrix.copyMatrix(inputs);

        for (let i = 1; i < this.total; i++) {
            weightedSums[i] = Matrix.matrixMult(this.weights[i - 1], weightedSums[i - 1]);
            weightedSums[i] = Matrix.matrixSum(weightedSums[i], this.biases[i - 1]);
            weightedSums[i] = Matrix.matrixMap(weightedSums[i], sigmoid);
        }

        let op = Matrix.toArray(weightedSums[this.total - 1]);

        return op;
    }

    train(ip, t, returnError) {
        let inputs = Matrix.fromArray(ip, 1, ip.length);

        let weightedSums = [];

        weightedSums[0] = Matrix.copyMatrix(inputs);

        for (let i = 1; i < this.total; i++) {
            weightedSums[i] = Matrix.matrixMult(this.weights[i - 1], weightedSums[i - 1]);
            weightedSums[i] = Matrix.matrixSum(weightedSums[i], this.biases[i - 1]);
            weightedSums[i] = Matrix.matrixMap(weightedSums[i], sigmoid);
        }

        let output = Matrix.copyMatrix(weightedSums[this.total - 1]);

        let target = Matrix.fromArray(t, 1, t.length);

        let errors = [];

        errors[this.total - 2] = Matrix.matrixSub(target, output);

        for (let i = this.total - 3; i >= 0; i--) {
            let trans = Matrix.transpose(this.weights[i + 1]);
            errors[i] = Matrix.matrixMult(trans, errors[i + 1]);
        }

        let DSigWeightedSums = [];

        for (let i = 0; i < weightedSums.length; i++) {
            DSigWeightedSums[i] = Matrix.matrixMap(weightedSums[i], DSigmoid);
        }

        let gradients = [];
        let weights_deltas = [];

        for (let i = 0; i < this.total - 1; i++) {
            gradients[i] = Matrix.hadamardMult(DSigWeightedSums[i + 1], errors[i]);
            gradients[i].scalarMult(this.lr);
        }

        for (let i = 0; i < this.total - 1; i++) {
            let trans = Matrix.transpose(weightedSums[i]);
            weights_deltas[i] = Matrix.matrixMult(gradients[i], trans);
        }

        for (let i = 0; i < this.total - 1; i++) {
            this.weights[i].matrixSum(weights_deltas[i]);
            this.biases[i].matrixSum(gradients[i]);
        }

        if (returnError) {
            return errors[0];
        }
    }

    mutateNN(mr) {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i].mutate(mr);
            this.biases[i].mutate(mr);
        }
    }

    static copyNN(toCopy) {
        let tmp = new NN();
        tmp.total = toCopy.total;
        for (let i = 0; i < toCopy.weights.length; i++) {
            tmp.weights[i] = Matrix.copyMatrix(toCopy.weights[i]);
            tmp.biases[i] = Matrix.copyMatrix(toCopy.biases[i]);
        }
        return tmp;
    }

    static deserialize(nnObj) {
        //deserialize
        let tmp = new NN();
        tmp.total = nnObj.total;
        for (let i = 0; i < nnObj.weights.length; i++) {
            tmp.weights[i] = Matrix.deserialize(nnObj.weights[i]);
            tmp.biases[i] = Matrix.deserialize(nnObj.biases[i]);
        }
        tmp.lr = nnObj.lr;
        return tmp;
    }
}