import json

from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/hi", methods=["GET"])
def hi():
    """
    This function is required to check for the status of the server.
    When docker containers are spun, this endpoint is called continuously
    to check if the docker container is ready or not.  
    Alternatively, if you need to do some pre-processing,
    do it first and then add this endpoint.
    """
    return jsonify({"value": "hello"})


@app.route("/bid", methods=["POST"])
def bid():
    """
    Bid is called at the starting phase of the game in callbreak.
    You will be provided with the following data:
    {
        "matchId": "M1",
        "playerId": "P3",
        "cards": ["1S", "TS", "8S", "7S", "6S", "4S", "3S", "9H", "6H", "5H", "1C", "1D", "JD"],
        "context": {
            "round": 1,
            "players": {
            "P3": {
                "totalPoints": 0,
                "bid": 0
            },
            "P0": {
                "totalPoints": 0,
                "bid": 3
            },
            "P2": {
                "totalPoints": 0,
                "bid": 3
            },
            "P1": {
                "totalPoints": 0,
                "bid": 3
            }
            }
        }
    }

    This is all the data that you will require for the bidding phase.
    """

    body = request.get_json()
    print(json.dumps(body, indent=2))

    ####################################
    #     Input your code here.        #
    ####################################

    # return should have a single field value which should be an int reprsenting the bid value
    return jsonify({"value": 3})


@app.route("/play", methods=["POST"])
def play():
    """
    Play is called at every hand of the game where the user should throw a card.
    Request data format:
    {
        "playerId": "P1",
        "playerIds": ["P0", "P1", "P2", "P3"],
        "cards": [ "QS", "9S", "2S", "KH", "JH", "4H", "JC", "9C", "7C", "6C", "8D", "6D", "3D"],
        "played": [
            "2H/0",
            "8H/0"
        ],
        "history": [
            [3, ["QS/0", "6S/0", "TH/0", "2S/0"], 3],
            [1, ["TS/0", "KS/0", "1S/0", "5S/0"], 3],
        ]
    }
    The `played` field contins all the cards played this turn in order.
    'history` field contains an ordered list of cards played from first hand.
    Format: `start idx, [cards in clockwise order of player ids], winner idx`
        `start idx` is index of player that threw card first
        `winner idx` is index of player who won this hand
    `playerId`: own id,
    `playerIds`: list of ids in clockwise order (always same for a game)
    """
    body = request.get_json()
    print(json.dumps(body, indent=2))

    ####################################
    #     Input your code here.        #
    ####################################

    # return should have a single field value
    # which should be an int reprsenting the index of the card to play
    #  e.g> {"value": "QS"}
    #  to play the card "QS"
    return jsonify({"value": "QS"})


# Docker image should always listen in port 7000
app.run(port=7000)
