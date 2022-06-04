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

    let disturbingCards = [];

    for (let i = 0; i < ourPossibleMoves.length; i++) {
        let thisCard = ourPossibleMoves[i];
        let unplayedCards = [];

        for (let j = 0; j < allValues.length; j++) {
            let newCard = new Card(allValues[j] + thisCard.suit.code);

            //check if this card is in history or in our deck
            let found = false;

            pl.history.forEach(c => {
                if (c.equals(newCard)) {
                    // console.log("FOUND IN HISTORY");
                    found = true;
                }
            });

            pl.cards.forEach(c => {
                if (c.equals(newCard)) {
                    // console.log("FOUND IN DECK");
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
            console.log("WE CAN WIN");
            return thisCard;
        }
        //add to disturbing cards
        disturbingCards.push(unplayedHigher);
    }

    console.log("No heuristsics succeeded");

    // try to bait the opponent into throwing disturbing cards
    //filter disturbing cards by the length == 1
    let toBait = disturbingCards.filter(c => c.length == 1);
    console.log(toBait.length);
    if (toBait.length > 0) {
        for (let i = 0; i < toBait.length; i++) {
            let toBaitCard = toBait[i][0];
            // play the second highest card for the suit of the toBait card from ourPossibleMoves
            let ourPossibleMovesSuit = ourPossibleMoves.filter(c => c.suit.code == toBaitCard.suit.code);
            let ourPossibleMovesSuitSorted = ourPossibleMovesSuit.sort((a, b) => b.rank.value - a.rank.value);
            if (ourPossibleMovesSuitSorted.length > 1) {
                console.log("BAITING OPPONENT");
                return ourPossibleMovesSuitSorted[1];
            }
        }
    }
    return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
}