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

    console.log("HERUSITSICS");
    // check if any card not yet played can beat our card
    let allValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    for (let i = 0; i < ourPossibleMoves.length; i++) {
        let thisCard = ourPossibleMoves[i];
        let unplayedCards = [];

        for (let j = 0; j < allValues.length; j++) {
            let newCard = new Card(allValues[j] + thisCard.suit.code);

            //check if this card is in history or in our deck
            let found = false;

            console.log(newCard.toString());
            pl.history.forEach(c => {
                if (c.equals(newCard)) {
                    console.log("FOUND IN HISTORY");
                    found = true;
                }
            });

            pl.cards.forEach(c => {
                if (c.equals(newCard)) {
                    console.log("FOUND IN DECK");
                    found = true;
                }
            });

            if (!found) {
                unplayedCards.push(newCard);
            }
        }

        console.log(unplayedCards);
        // check if any unplayed card is higher ranked than this card
        let unplayedHigher = unplayedCards.filter(c => c.rank.value > thisCard.rank.value);
        if (unplayedHigher.length == 0) {
            console.log("WE CAN WIN");
            return thisCard;
        }
    }

    console.log("No heuristsics succeeded");
    return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
}