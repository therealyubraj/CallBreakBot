/**
 * This code simulates the actual game using the game.json file.
 */

// import json from './game.json';
/**
 * Sample data
 * {
  players: [ 'Uvryptic', 'Uvryptic', 'Bot 0', 'Bot 1' ],
  rounds: [
    {
      dealer: 3,
      cards: [Array],
      bids: [Array],
      errors: [Object],
      actions: [Array],
      scores: [Array],
      responseTimes: [Array]
    }
  ],
  ranks: [
    -3, 1, -3, 1,
    -3, 1, -3, 1
  ]
}
 */

import * as fs from 'fs';
import {
    Board
} from './board.js';
import {
    monteCarlo
} from './search.js';

const data = fs.readFileSync('src/game.json', 'utf8');


let parsedJson = JSON.parse(data);

let playerOrder = parsedJson['players'];
let playerToSimulate = 'Uvryptic1';
let playerIndex = playerOrder.indexOf(playerToSimulate);

let playerCards = {};
let playerContext = {};
playerOrder.forEach((player, i) => {
    playerCards[player] = parsedJson['rounds'][0]['cards'][i];
    playerContext[player] = {
        totalPoints: 0,
        bid: 0,
        won: 0
    }
});

if (Object.keys(playerCards).length < 4) {
    throw new Error("Make sure to give each player unique identity in the JSON.");
}

let gameHistory = parsedJson['rounds'][0]['actions'];

console.log(playerCards);

let mainBoard = new Board();
mainBoard.setPlayersOrder(playerOrder);
mainBoard.setPlayerCards(playerToSimulate, playerCards[playerToSimulate]);
mainBoard.setPlayerCards('Uvryptic2', playerCards['Uvryptic2']);

console.log("The bid is :", mainBoard.getBid(playerToSimulate));

gameHistory.forEach((action, i) => {
    if (i != 0) {
        mainBoard.addToHistory(gameHistory[i - 1]['cards']);
    }
    mainBoard.startNewHand();
    mainBoard.updatePlayerInfo(playerContext);


    //get the cards played till playerToSimulate turn

    let turnStarter = action['started'];
    let cardsToSlice = 0;
    while (turnStarter != playerIndex) {
        turnStarter = (turnStarter + 1) % 4;
        cardsToSlice++;
    }
    let playedCards = action['cards'].slice(0, cardsToSlice);
    let winnerId = playerOrder[action['ended']];

    if (winnerId == null) {
        playedCards = action['cards'].filter(c => c != null);
    }

    mainBoard.setThrownCards(playedCards, playerToSimulate);
    // console.log(mainBoard.unplayedCards);
    mainBoard.readyChildren();
    let playCard = monteCarlo(mainBoard, 100, playerToSimulate);
    mainBoard.playCard(playCard, playerToSimulate);
    console.log('We played: ', playCard.toString());
    console.log(mainBoard.players[playerToSimulate].cards.map(card => card.toString()).join(", "));
    if (winnerId != null) {

        playerContext[winnerId]['won'] += 1;
    }
});

// console.log(playerOrder, playerCards);