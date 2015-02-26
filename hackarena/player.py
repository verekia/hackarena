# -*- coding: utf-8 -*-
import hackarena.constants
from hackarena.game_objects import BaseGameObject


class Player(BaseGameObject):

    def __init__(
        self,
        username,
        character_class,
        team,
        hp=130,
        last_death=0,
    ):
        self.username = username
        self.character_class = character_class
        self.team = team
        self.position = {
            'x': 2 if team == 'blue' else hackarena.constants.MAP_TILES_WIDTH - 2,
            'y': 2 if team == 'blue' else hackarena.constants.MAP_TILES_HEIGHT - 2,
        }
        self.hp = hp
        self.last_death = last_death
