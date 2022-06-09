import * as fs from 'fs';

import {
    createServer
} from "http";
import {
    Board
} from "./board.js";
import {
    monteCarlo
} from './search.js';

import {
    Card,
    cardToInteger
} from "./card.js";
import {
    NN
} from "./NeuralNetwork.js";

// import * as tf from '@tensorflow/tfjs-node';

/**
 * @type Object.<string, Board>
 */
let allBoards = {};
let time = {};
let nnData = fs.readFileSync('src/bidder.json', 'utf8');
let brain = new NN(52, 64, 8, 2);
brain = NN.deserialize(JSON.parse(nnData));

//load bidder model
// let modelLoaded = false;
// const model = tf.loadLayersModel('file://bidder_model/model.json').then(model => {
//     model.compile({
//         optimizer: 'sgd',
//         loss: 'meanSquaredError',
//         metrics: ['accuracy']
//     });
// });



const server = createServer((req, res) => {
    if (req.url) res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        res.end();
        return;
    }

    let payload = "";
    req.on("data", (chunk) => {
        payload += chunk;
    });

    req.on("end", () => {
        let result = {
            error: "Unknown request"
        };
        if (req.url.endsWith("hi")) {
            // if (modelLoaded) {
            result = hi(payload);
            res.write(JSON.stringify(result));
            // }
        } else if (req.url.endsWith("bid")) {
            result = bid(payload);
            res.write(JSON.stringify(result));
        } else if (req.url.endsWith("play")) {
            result = play(payload);
            res.write(JSON.stringify(result));
        }

        res.end();
    });
});

/**
 * This function is required to check for the status of the server.
 * When docker containers are spun, this endpoint is called continuously
 * to check if the docker container is ready or not.
 * Alternatively, if you need to do some pre-processing,
 * do it first and then add this endpoint.
 */
function hi(payload) {
    console.log("hi called");
    return {
        value: "hello"
    };
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function bid(payload) {
    /*
    Bid is called at the starting phase of the game in callbreak.
    You will be provided with the following data:
    {
      "playerId": "P3",
      "playerIds": ["P3', "P0", "P2", "P1"].
      "cards": ["1S", "TS", "8S", "7S", "6S", "4S", "3S", "9H", "6H", "5H", "1C", "1D", "JD"],
      "context": {
        "round": 1,
        "players": {
          "P3": {
            "totalPoints": 0,
            "bid": 0,
            "won": 0,
          },
          "P0": {
            "totalPoints": 0,
            "bid": 3,
            "won": 0
          },
          "P2": {
            "totalPoints": 0,
            "bid": 3,
            "won": 0
          },
          "P1": {
            "totalPoints": 0,
            "bid": 3,
            "won": 0
          }
        }
      }
    }
    Context has metadata about the current round:
      `ruond`: the current round [1 - 5]
      `totalPoints`: the points accumulated till this round (dhoos is also subtracted)
      `bid`: bid of current round
      `won`: total hands won this round upto this point

    This is all the data that you will require for the bidding phase.
    If you feel that the data provided is insufficient, let us know in our discord server.
    */

    // time.bidStartTime = performance.now();
    console.log("Bid called");
    let json = JSON.parse(payload);
    // console.log(JSON.stringify(json, null, 2));

    /*
    ####################################
    #     Input your code here.        #
    ####################################
    */

    // if anything other than playerIds is in allBoards, delete it
    Object.keys(allBoards).forEach(key => {
        if (!json.playerIds.includes(key)) {
            delete allBoards[key];
        }
    });


    allBoards[json.playerId] = new Board();
    let mainBoard = allBoards[json.playerId];
    mainBoard.setPlayersOrder(json.playerIds);

    Object.keys(allBoards).forEach(playerId => {
        allBoards[playerId].setPlayerCards(json.playerId, json.cards.map(card => new Card(card)));
    });

    // let bid = pred.indexOf(Math.max(...pred));

    let integerCards = json.cards.map(cardToInteger);
    let nnIp = [];
    for (let i = 0; i < 52; i++) {
        nnIp.push(0);
    }
    integerCards.forEach(card => {
        nnIp[card] = 1;
    });

    let nnOp = brain.predict(nnIp).map(x => x.toFixed(4));
    let bidValue = indexOfMax(nnOp) + 1;

    bidValue += mainBoard.getBid(json.playerId);
    bidValue = Math.floor(bidValue / 2);

    console.log(nnOp, bidValue);

    // return should have a single field value which should be an int reprsenting the bid value
    // time.bidEndTime = performance.now();
    return {
        value: bidValue
    };
}

function play(payload) {
    /*
    Play is called at every hand of the game where the user should throw a card.
    Request data format:
      {
        "playerId": "P1",
        "playerIds": ["P0", "P1", "P2", "P3"],
        "cards": [ "QS", "9S", "2S", "KH", "JH", "4H", "JC", "9C", "7C", "6C", "8D", "6D", "3D"],
        "played": [
          "2H",
          "8H"
        ],
        "history": [
          [1, ["TS", "KS", "1S", "5S"], 3],
          [3, ["QS", "6S", "TH", "2S"], 3],
        ],
        "context": {
          "round": 1,
          "players": {
            "P3": {
              "totalPoints": 0,
              "bid": 0,
              "won": 0,
            },
            "P0": {
              "totalPoints": 0,
              "bid": 3,
              "won": 0
            },
            "P2": {
              "totalPoints": 0,
              "bid": 3,
              "won": 0
            },
            "P1": {
              "totalPoints": 0,
              "bid": 3,
              "won": 2
            }
          }
        }
      }
    The `played` field contins all the cards played this turn in order.
      'history` field contains an ordered list of cards played from first hand.
      Format: `start idx, [cards in clockwise order of player ids], winner idx`
          `start idx` is index of player that threw card first
          `winner idx` is index of player who won this hand
      `playerId`: own id,
      `playerIds`: list of ids in clockwise order (always same for a game)
    `context` is same as in bid. Refer to it in the bid function.

    This is all the data that you will require for the playing phase.
    If you feel that the data provided is insufficient, let us know in our discord server.
    */
    const json = JSON.parse(payload);


    /*
    ####################################
    #     Input your code here.        #
    ####################################
    */


    //  return should have a single field value
    //  which should be an int reprsenting the index of the card to play
    //  e.g> {"value": "QS"}
    //  to play the card "QS"
    // console.log(time);

    // if (json.timeBudget < 0) {
    //     console.log("Time budget is negative");
    //     return {
    //         value: -1
    //     };
    // }
    let mainBoard = allBoards[json.playerId];

    if (json.history.length != 0) {
        mainBoard.addToHistory(json.history[json.history.length - 1][1].map(card => new Card(card)));
    }
    mainBoard.startNewHand();
    mainBoard.updatePlayerInfo(json.context.players);
    mainBoard.setThrownCards(json.played.map(card => new Card(card)), json.playerId);
    // console.log(mainBoard.unplayedCards);
    mainBoard.readyChildren();

    let childrenToTime = {
        1: 50,
        2: 50,
        3: 50,
        4: 75,
        5: 75,
        6: 75,
        7: 75,
        8: 75,
        9: 150,
        10: 150,
        11: 150,
        12: 150,
        13: 150
    }

    let playCard = monteCarlo(mainBoard, childrenToTime[mainBoard.children.length], json.playerId);
    // let playCard = bestMoveChooser(mainBoard.players[json.playerId], json.played, mainBoard.unplayedCards);

    Object.keys(allBoards).forEach(playerId => {
        allBoards[playerId].playCard(playCard, json.playerId);
    });
    return {
        value: playCard.toString(),
    };
}

// Docker image should always listen in port 7000
server.listen(7000, () => {
    console.log("Server listening at port 7000");
});