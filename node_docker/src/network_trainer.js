import * as fs from 'fs';
import {
    NN
} from './NeuralNetwork.js';

// const fileData = fs.readFileSync('src/data/biddingData1.txt', 'utf8');
const fileData = fs.readFileSync('src/biddingData.txt', 'utf8');

let parsedJson = JSON.parse(fileData);

let cards = [];
let bids = [];

parsedJson.forEach(element => {
    cards.push(element.card);
    bids.push(element.wins);
});

bids = bids.map(bid => {
    let newBid = [];
    for (let i = 0; i < 8; i++) {
        newBid.push(0);
    }
    newBid[bid - 1] = 1;
    return newBid;
});

function cardToInteger(cardString) {
    let val = cardString[0];
    let suit = cardString[1];

    if (val === 'T') {
        val = 9;
    } else if (val === 'J') {
        val = 10;
    } else if (val === 'Q') {
        val = 11;
    } else if (val === 'K') {
        val = 12;
    } else {
        val = parseInt(val) - 1;
    }

    if (suit === 'C') {
        suit = 0;
    } else if (suit === 'D') {
        suit = 1;
    } else if (suit === 'H') {
        suit = 2;
    } else if (suit === 'S') {
        suit = 3;
    }

    //return value from 0 to 51 based on card value and suit
    return val + suit * 13;
}

let integerCards = [];
cards.forEach(card => {
    integerCards.push(card.map(cardToInteger));
});

let nnInput = [];
integerCards.forEach(c => {
    let newCards = [];
    for (let i = 0; i < 52; i++) {
        newCards.push(0);
    }
    c.forEach(ca => {
        newCards[ca] = 1;
    });
    nnInput.push(newCards);
});


// const model = tf.sequential({
//     layers: [
//         tf.layers.dense({
//             inputShape: [52],
//             units: 64,
//             activation: 'sigmoid'
//         }),
//         tf.layers.dense({
//             units: 8,
//             activation: 'sigmoid'
//         }),
//     ]
// });

let nnData = fs.readFileSync('src/bidder.json', 'utf8');


let data = nnInput;
let labels = bids;

let allData = [];
data.forEach((d, i) => {
    allData.push({
        input: d,
        output: labels[i]
    });
});


let epochs = 15;
let brain = new NN(52, 64, 8, 2);
brain = NN.deserialize(JSON.parse(nnData));

function shuffle(array) {
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


console.log(brain.predict(allData[0].input));
for (let i = 0; i < epochs; i++) {
    shuffle(allData);
    console.log(i);
    for (let j = 0; j < allData.length; j++) {
        brain.train(allData[j].input, allData[j].output);
    }
}

fs.writeFileSync("src/bidder.json", JSON.stringify(brain, null, 2));


// const data = tf.tensor2d([
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ]);
// const labels = tf.tensor2d([
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0]
// ]);

// tf.tidy(() => {
//     const model = tf.loadLayersModel('file://bidder_model/model.json').then(model => {
//         model.compile({
//             optimizer: 'sgd',
//             loss: 'meanSquaredError',
//             metrics: ['accuracy']
//         });
//         model.fit(data, labels, {
//             epochs: 5,
//             batchSize: 32,
//             shuffle: true,
//         }).then(info => {
//             console.log('Final accuracy', info.history.acc);
//             let result = model.save('file://bidder_model');
//             let testData = tf.tensor2d([nnInput[0]]);
//             let pred = model.predict(testData);
//             console.log(typeof pred);
//             pred = pred.dataSync();
//             console.log(pred, pred.indexOf(Math.max(...pred)));
//         });
//     });
// });