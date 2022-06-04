from bot import get_play_card
from card import card_history


player_turn = 3

cards = [
    "QS",
    "9S",
    "3S",
    "KH",
    "9H",
    "8H",
    "1C",
    "6C",
    "3C",
    "1D",
    "KD",
    "8D",
    "6D"
]

played = [
    "9D", "TD", "QD"
]

history = [
    { "started": 3, "cards": ["1H", "KH", "2H", "7H"], "ended": 3 },
    { "started": 3, "cards": ["2C", "1C", "8C", "5C"], "ended": 0 },
    { "started": 0, "cards": ["1D", "2D", "3D", "JD"], "ended": 0 },
    { "started": 0, "cards": ["3C", "TC", "KC", "7C"], "ended": 2 },
    { "started": 2, "cards": ["QH", "3H", "8H", "4H"], "ended": 2 },
    { "started": 2, "cards": ["6H", "5H", "9H", "JH"], "ended": 1 },
]

temp = []
for x in history:
    temp.append(tuple(x.values()))
history = temp

for i in history:
    for j in i[1]:
        cur_card = j
        if cur_card in cards:
            cards.remove(cur_card)


game_board = card_history()
for i in history:
    game_board.update_history(cards=i[1])


play_card = get_play_card(
    played_str_arr=played, 
    cards_str_arr=cards,
    history=history,
    game_board=game_board
)

print(play_card)