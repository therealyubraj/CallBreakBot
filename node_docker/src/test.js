import {
    Board
} from './board.js';

import {
    Card
} from './card.js';

import {
    monteCarlo
} from './search.js';


let cards2 = ["5S", "3S", "1H", "JH", "9C", "8C", "3C", "KD", "QD", "JD", "9D", "7D", "5D"];

//13 cards random please
let cards1 = ["JS", "TS", "8S", "KH", "9H", "6H", "5H", "3H", "2H", "1C", "7C", "6C", "5C"];

let turnCards = [

];

let history = [];

let playerIds = ["Bot 1", "Uvryptic1", "Bot 0", "Uvryptic2"];

let mainBoard = new Board();

if (mainBoard.playersOrder.length == 0) {
    mainBoard.setPlayersOrder(playerIds);
    mainBoard.startNewGame();
}
mainBoard.setPlayerCards('Uvryptic1', cards1);

let bidValue1 = mainBoard.getBid('Uvryptic1');

if (mainBoard.playersOrder.length == 0) {
    mainBoard.setPlayersOrder(playerIds);
    mainBoard.startNewGame();
}
mainBoard.setPlayerCards('Uvryptic2', cards2);

let bidValue2 = mainBoard.getBid('Uvryptic2');

console.log(bidValue1, bidValue2);

mainBoard.startNewHand();
mainBoard.setThrownCards(turnCards, "Uvryptic1");
mainBoard.readyChildren();
let bestMove = monteCarlo(mainBoard, 100, "Uvryptic1");
console.log(
    mainBoard.children.map(child => {
        {
            return {
                cards: child.thrownCards.map(card => card.toString()).join(", "),
                score: child.score,
                visits: child.visits,
            }
        }
    }));

console.log(bestMove);