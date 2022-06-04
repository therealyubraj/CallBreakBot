import {
    Player
} from './player.js';

import {
    bestMoveChooser
} from './search.js';

let cards = [
    "QS",
    "9S",
    "KC",
    "4C",
    "2C",
    "KD",
    "9D"
];

let turnCards = [
    "7D"
];


let a = new Player(cards);
console.log(bestMoveChooser(a, turnCards));