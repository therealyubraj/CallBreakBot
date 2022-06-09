// first ready the test data
// then train it

import * as fs from 'fs';

const data = fs.readFileSync('src/games/data_1.json', 'utf8');

let parsedJson = JSON.parse(data);

let allGames = parsedJson.gameData;

let neeededData = [];

allGames.forEach(game => {
    let rounds = game.GameRecord.game.rounds;

    rounds.forEach(round => {
        let cards = round.cards;
        let wins = [0, 0, 0, 0];
        let actions = round.actions;
        actions.forEach(action => {
            wins[action.ended]++;
        });
        cards.forEach((card, i) => {
            neeededData.push({
                card: card,
                wins: Math.min(Math.max(wins[i], 1), 8)
            });
        });
    });
});


fs.appendFileSync("src/biddingData.txt", JSON.stringify(neeededData, null, 2));
// console.log(data);