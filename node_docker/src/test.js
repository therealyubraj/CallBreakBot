import {
    Player
} from './player.js';

import {
    monteCarlo
} from './search.js';

let cards = ["7S", "6S", "3S", "2S", "1H", "JH", "5H", "JC", "TC", "2C"];

let turnCards = [

];

let history = [
    "5C",
    "1D"
];

let a = new Player(cards);
a.calledBid = 4;
a.wonHands = 2;
a.addToHistory(history);
console.log(a.getBid());
console.log(monteCarlo(a, turnCards));