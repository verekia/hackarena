# -*- coding: utf-8 -*-
from hackarena.game_objects import BaseGameObject
#from hackarena.player import Player


class Team(BaseGameObject):

    def __init__(self, color):
        self.color = color
        self.kills = 0
        self.building_hp = 600
        self.players = []
        # Front-End is not ready for it yet.
        # Player(
        #     username='HQ',
        #     character_class='hq',
        #     team=color,
        # )]

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, player):
        self.players.remove(player)
