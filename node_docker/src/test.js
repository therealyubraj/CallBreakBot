let time = {};
import {
    performance
} from 'perf_hooks';

import {
    Board
} from './board.js';

import {
    monteCarlo
} from './search.js';

let playerCard = ['5D', '6D'];

let otherCard = ['TD', '2D'];

let unplayedCards = ['1D', 'KD', 'JD'];

let mainBoard = new Board();
let playerOrder = ['Bot 1', 'Bot 2', 'Bot 3', 'Bot 4'];

mainBoard.setPlayersOrder(playerOrder);
mainBoard.setPlayerCards(playerOrder[1], playerCard);
mainBoard.setPlayerCards(playerOrder[2], otherCard);

mainBoard.unplayedCards = unplayedCards;
mainBoard.handStarter = playerOrder[0];

let turnCards = ['QD'];
mainBoard.setThrownCards(turnCards, playerOrder[1]);
let move = monteCarlo(mainBoard, 100, playerOrder[1]);
console.log(move);