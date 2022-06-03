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
    let playableMovesObject = pl.getAllPlayableCards(turnCards);

    let ourPossibleMoves = playableMovesObject['cards'];
    let canWin = playableMovesObject['W'];

    if (!canWin) {
        console.log("WE LITERALLY CANNOT WIN (╯°□°）╯︵ ┻━┻");
    }

    if (turnCards.length == 3 || !canWin) {
        return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
    }

    if (ourPossibleMoves.length == 1) {
        return ourPossibleMoves[0];
    }

    // check if any card not yet played can beat our card
    let allValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    for (let i = 0; i < ourPossibleMoves.length; i++) {
        let thisCard = ourPossibleMoves[i];
        let unplayedCards = [];

        for (let j = 0; j < allValues.length; j++) {
            let newCard = new Card(allValues[i] + thisCard.suit.code);

            //check if this card is in history or in our deck
            let found = false;

            pl.history.forEach(c => {
                if (c.equals(thisCard)) {
                    found = true;
                }
            });

            pl.cards.forEach(c => {
                if (c.equals(thisCard)) {
                    found = true;
                }
            });

            if (!found) {
                unplayedCards.push(newCard);
            }
        }

        // check if any unplayed card is higher ranked than this card
        let unplayedHigher = unplayedCards.filter(c => c.rank.value > thisCard.rank.value);
        if (unplayedHigher.length == 0) {
            return thisCard;
        }
    }
    return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
}