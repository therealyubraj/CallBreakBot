import {
    Player
} from "./player.js";
import {
    Card
} from "./card.js";

/**
 * 
 * @param {Player} pl 
 * @param {Card[]} turnCards 
 */
export function bestMoveChooser(pl, turnCards) {
    let ourPossibleMoves = pl.getAllPlayableCards(turnCards);

    if (turnCards.length == 3) {
        return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
    } else if (turnCards.length == 0) {
        return ourPossibleMoves[Math.floor(Math.random() * ourPossibleMoves.length)];
    } else {
        return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? a : b);
    }
}