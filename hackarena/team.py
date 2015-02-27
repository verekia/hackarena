# -*- coding: utf-8 -*-
import hackarena.constants
from hackarena.game_objects import BaseGameObject


class Team(BaseGameObject):

    def __init__(self, color):
        self.color = color
        self.kills = 0
        self.building_max_hp = 1000
        self.building_hp = 1000
        self.building_position = {
            'x': 32 if color == 'blue' else hackarena.constants.MAP_TILES_WIDTH * 16 - 96,
            'y': 32 if color == 'blue' else hackarena.constants.MAP_TILES_HEIGHT * 16 - 96,
        }
        self.building_size = {
            'width': 48,
            'height': 80,
        }
        self.players = []

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, player):
        self.players.remove(player)
