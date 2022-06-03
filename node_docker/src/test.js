import {
    Player
} from './player.js';

let cards = [
    "QS",
    "9S",
    "KC",
    "4C",
    "2C",
    "7D",
    "JD"
];

let turnCards = [
    "5D",
    "TD",
    "3D"   
];


let a = new Player(cards);
console.log(a.getAllPlayableCards(turnCards).map(String).join(" "));