# -*- coding: utf-8 -*-
from hackarena.game_objects import BaseGameObject


class Player(BaseGameObject):

    def __init__(
        self,
        username,
        character_class,
        team,
        position_x=0,
        position_y=0,
        hp=130,
        last_death=0,
    ):
        self.username = username
        self.character_class = character_class
        self.team = team
        self.position = {
            'x': position_x,
            'y': position_y,
        }
        self.hp = hp
        self.last_death = last_death
