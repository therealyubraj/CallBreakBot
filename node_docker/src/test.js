import {
    Player
} from './player.js';

import {
    bestMoveChooser
} from './search.js';

let cards = ["QS", "7S", "6S", "3S", "2S", "TH", "9H", "8H", "5H", "1C", "TC"];

let turnCards = [
    "2D"
];

let history = [

];

let a = new Player(cards);
a.addToHistory(history);
console.log(a.getBid());
console.log(bestMoveChooser(a, turnCards));