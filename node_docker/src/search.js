import {
    Player
} from "./player.js";
import {
    Card,
    Rank
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

    // check if the win is by playing spades on other suits
    if (turnCards.length > 0) {
        let origSuit = new Card(turnCards[0]).suit;
        console.log(turnCards, turnCards[0]);
        if (origSuit.code != 'S') {
            // check if we can win by playing spades on other suits
            let spades = ourPossibleMoves.filter(c => c.suit.code == 'S');
            if (spades.length > 0) {
                // return lowest spade
                return spades.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
            }
        }
    }


    console.log("HERUSITSICS");
    // check if any card not yet played can beat our card
    let allValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

    let disturbingCards = [];
    let sureWinnings = [];

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
            sureWinnings.push(thisCard);
            // return thisCard;
        }
        //add to disturbing cards
        if (unplayedHigher.length > 0 && thisCard.rank.value >= Rank.QUEEN.value) {
            disturbingCards.push(unplayedHigher);
        }
    }

    // try to bait the opponent into throwing disturbing cards
    //filter disturbing cards by the min length 
    if (disturbingCards.length > 0) {
        let minLength = disturbingCards.reduce((a, b) => a.length < b.length ? a : b).length;
        let toBait = disturbingCards.filter(c => c.length == minLength);
        if (toBait.length > 0) {
            for (let i = 0; i < toBait.length; i++) {
                let toBaitCard = toBait[i][0];
                // play the second highest card for the suit of the toBait card from ourPossibleMoves
                let ourPossibleMovesSuit = ourPossibleMoves.filter(c => c.suit.code == toBaitCard.suit.code);
                let ourPossibleMovesSuitSorted = ourPossibleMovesSuit.sort((a, b) => b.rank.value - a.rank.value);
                if (ourPossibleMovesSuitSorted.length > 1 && ourPossibleMovesSuitSorted[0].rank.value < toBaitCard.rank.value) {
                    console.log("BAITING OPPONENT");
                    return ourPossibleMovesSuitSorted[1];
                }
            }
        }
    }

    // run out of non-spade cards if their count < 3
    for (let i = 0; i < Object.keys(pl.cardNumbers).length; i++) {
        let suit = Object.keys(pl.cardNumbers)[i];
        if (suit != 'S' && pl.cardNumbers[suit] < 3 && pl.cardNumbers[suit] > 0) {
            // play lowest card of this suit
            let ourPossibleMovesSuit = ourPossibleMoves.filter(c => c.suit.code == suit);
            if (ourPossibleMovesSuit.length > 0) {
                console.log("RUNNING OUT OF NON-SPADES");
                return ourPossibleMovesSuit.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
            }
        }
    }

    // play the sure winnings
    if (sureWinnings.length > 0) {
        console.log("PLAYING SURE WINNINGS");
        return sureWinnings.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
    }

    return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
}