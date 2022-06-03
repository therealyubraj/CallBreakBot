import {
    Player
} from './player.js';

import {
    monteCarlo
} from './search.js';

let cards = [
    "QS",
    "9S",
    "KC",
    "4C",
    "2C",
    "1D",
    "JD"
];

let turnCards = [
    "5D",
    "TD",
    "3D"
];


let a = new Player(cards);
console.log(monteCarlo(a, turnCards));