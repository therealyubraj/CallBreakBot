import {
    Player
} from './player.js';

import {
    bestMoveChooser
} from './search.js';

let cards = [
    "QS",
    "9S",
    "KD",
    "JD",
    "4D"
];

let turnCards = [
];

let history = [
    "1D",
];

let a = new Player(cards);
a.addToHistory(history);
console.log(bestMoveChooser(a, turnCards));