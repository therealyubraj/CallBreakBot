import {
    Player
} from "./player.js";
import {
    Card,
    Rank
} from "./card.js";

import {
    Board
} from "./board.js";

/**
 * 
 * @param {Board} mainBoard 
 * @param {Integer} iterations 
 */
export function monteCarlo(mainBoard, iterations, pID) {
    for (let i = 0; i < iterations; i++) {
        let current = mainBoard;

        while (current.expanded) {
            // choose child with highest UCB
            if (current.children.length == 0) {
                break;
            }
            let bestChild = current.children[0];
            let bestUCB = current.children[0].getUCB(i);
            for (let i = 1; i < current.children.length; i++) {
                let childUCB = current.children[i].getUCB(i);
                if (childUCB > bestUCB) {
                    bestChild = current.children[i];
                    bestUCB = childUCB;
                }
                if (childUCB == Infinity) {
                    break;
                }
            }
            current = bestChild;
        }

        if (current.visits != 0) {
            current.readyChildren();
            if (current.children.length != 0) {
                current = current.children[0];
            }
        }

        //rollout
        if (!current) {
            console.log(current);
        }
        let score = current.rollOut(pID);

        //backpropagate
        while (current != null) {
            current.visits++;
            current.score += score;
            current = current.parent;
        }
    }

    let bestChild = mainBoard.children[0];
    for (let i = 1; i < mainBoard.children.length; i++) {
        let child = mainBoard.children[i];
        if (child.score / child.visits > bestChild.score / bestChild.visits) {
            bestChild = child;
        }
    }
    console.log(bestChild.score);
    return bestChild.thrownCards[mainBoard.thrownCards.length % 4];
}

// /**
//  * 
//  * @param {Player} pl 
//  * @param {Card[]} turnCards 
//  */
// export function bestMoveChooser(pl, turnCards) {
//     let playableMovesObject = pl.getAllPlayableCards(turnCards);

//     let ourPossibleMoves = playableMovesObject['cards'];
//     let canWin = playableMovesObject['W'];


//     if (!canWin) {
//         console.log("WE LITERALLY CANNOT WIN (╯°□°）╯︵ ┻━┻");
//     }

//     if (turnCards.length == 3 || !canWin) {
//         return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
//     }

//     if (ourPossibleMoves.length == 1) {
//         return ourPossibleMoves[0];
//     }

//     // check if the win is by playing spades on other suits
//     if (turnCards.length > 0) {
//         let origSuit = new Card(turnCards[0]).suit;
//         if (origSuit.code != 'S') {
//             // check if we can win by playing spades on other suits
//             let spades = ourPossibleMoves.filter(c => c.suit.code == 'S');
//             if (spades.length > 0) {
//                 // return lowest spade
//                 return spades.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
//             }
//         }
//     }

//     //if this is the first turn, play spades if we have acheived our bid
//     if (turnCards.length == 0 && pl.calledBid <= pl.wonHands) {
//         let spades = ourPossibleMoves.filter(c => c.suit.code == 'S');
//         if (spades.length > 0) {
//             console.log("Playing spades to fuck opponenets");
//             return spades[0];
//         }
//     }

//     console.log("HERUSITSICS");
//     // check if any card not yet played can beat our card
//     let allValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

//     let disturbingCards = [];
//     let sureWinnings = [];

//     for (let i = 0; i < ourPossibleMoves.length; i++) {
//         let thisCard = ourPossibleMoves[i];
//         let unplayedCards = [];

//         for (let j = 0; j < allValues.length; j++) {
//             let newCard = new Card(allValues[j] + thisCard.suit.code);

//             //check if this card is in history or in our deck
//             let found = false;

//             pl.history.forEach(c => {
//                 if (c.equals(newCard)) {
//                     // console.log("FOUND IN HISTORY");
//                     found = true;
//                 }
//             });

//             pl.cards.forEach(c => {
//                 if (c.equals(newCard)) {
//                     // console.log("FOUND IN DECK");
//                     found = true;
//                 }
//             });

//             if (!found) {
//                 unplayedCards.push(newCard);
//             }
//         }

//         // check if any unplayed card is higher ranked than this card
//         let unplayedHigher = unplayedCards.filter(c => c.rank.value > thisCard.rank.value);
//         if (unplayedHigher.length == 0) {
//             console.log("WE CAN WIN");
//             sureWinnings.push(thisCard);
//         }
//         //add to disturbing cards
//         if (unplayedHigher.length > 0 && thisCard.rank.value >= Rank.QUEEN.value) {
//             disturbingCards.push(unplayedHigher);
//         }
//     }

//     // try to bait the opponent into throwing disturbing cards
//     //filter disturbing cards by the min length 
//     if (disturbingCards.length > 0) {
//         let minLength = disturbingCards.reduce((a, b) => a.length < b.length ? a : b).length;
//         let toBait = disturbingCards.filter(c => c.length == minLength);
//         if (toBait.length > 0) {
//             for (let i = 0; i < toBait.length; i++) {
//                 let toBaitCard = toBait[i][0];
//                 // play the second highest card for the suit of the toBait card from ourPossibleMoves
//                 let ourPossibleMovesSuit = ourPossibleMoves.filter(c => c.suit.code == toBaitCard.suit.code);
//                 let ourPossibleMovesSuitSorted = ourPossibleMovesSuit.sort((a, b) => b.rank.value - a.rank.value);
//                 if (ourPossibleMovesSuitSorted.length > 1 && ourPossibleMovesSuitSorted[0].rank.value < toBaitCard.rank.value) {
//                     console.log("BAITING OPPONENT");
//                     return ourPossibleMovesSuitSorted[ourPossibleMovesSuitSorted.length - 1];
//                 }
//             }
//         }
//     }


//     // run out of non-spade cards if their count < 3 and its ourn turn to start 
//     if (turnCards.length == 0 && pl.cardNumbers['S'] > 0) {
//         let lowestSuit = '',
//             leastNumber = 3;
//         for (let i = 0; i < Object.keys(pl.cardNumbers).length; i++) {
//             let suit = Object.keys(pl.cardNumbers)[i];
//             // check if this suit is in sureWinnings
//             let sureWinningsSuit = sureWinnings.filter(c => c.suit.code == suit);
//             if (suit != 'S' && pl.cardNumbers[suit] < leastNumber && pl.cardNumbers[suit] > 0 && sureWinningsSuit.length == 0) {
//                 lowestSuit = suit;
//                 leastNumber = pl.cardNumbers[suit];
//             }
//         }
//         // play lowest card of this suit
//         let ourPossibleMovesSuit = ourPossibleMoves.filter(c => c.suit.code == lowestSuit);
//         if (ourPossibleMovesSuit.length > 0) {
//             console.log("RUNNING OUT OF NON-SPADES");
//             return ourPossibleMovesSuit.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
//         }

//     }

//     //play smallest card of a suit that is not in sureWinnings except spades
//     if (turnCards.length == 0) {
//         let suitsInSureWinnings = {
//             'H': false,
//             'D': false,
//             'C': false
//         };
//         for (let i = 0; i < sureWinnings.length; i++) {
//             let thisCard = sureWinnings[i];
//             if (thisCard.suit.code != 'S') {
//                 suitsInSureWinnings[thisCard.suit.code] = true;
//             }
//         }

//         let suitsNotInSureWinnings = [];
//         for (let i = 0; i < Object.keys(pl.cardNumbers).length; i++) {
//             let suit = Object.keys(pl.cardNumbers)[i];
//             if (!suitsInSureWinnings[suit]) {
//                 suitsNotInSureWinnings.push(suit);
//             }
//         }
//         console.log("DELAYING!!");
//         if (suitsNotInSureWinnings.length > 0) {
//             let smallestCard = ourPossibleMoves.filter(c => suitsNotInSureWinnings.includes(c.suit.code));
//             if (smallestCard.length > 0) {
//                 return smallestCard.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
//             }
//         }
//     }

//     // play the sure winnings
//     if (sureWinnings.length > 0) {
//         console.log("PLAYING SURE WINNINGS");
//         return sureWinnings.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
//     }

//     return ourPossibleMoves.reduce((a, b) => a.rank.value > b.rank.value ? b : a);
// }