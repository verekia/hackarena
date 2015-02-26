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
            'x': 20 if team == 'blue' else hackarena.constants.map_width - 20,
            'y': 20 if team == 'blue' else hackarena.constants.map_height - 20,
        }
        self.hp = hp
        self.last_death = last_death
