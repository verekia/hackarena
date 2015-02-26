# -*- coding: utf-8 -*-
from hackarena.game_objects import BaseGameObject


class Team(BaseGameObject):

    def __init__(self):
        self.kills = 0
        self.building_hp = 600
        self.players = []

    def add_player(self, player):
        self.players.append(player)
