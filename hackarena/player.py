# -*- coding: utf-8 -*-
import hackarena.constants
from hackarena.constants import Classes
from hackarena.game_objects import BaseGameObject


class Player(BaseGameObject):

    def __init__(
        self,
        username,
        character_class,
        team,
        hp=0,
        last_death=0,
    ):
        self.MAX_HP = Classes.MAX_HP[character_class]

        self.username = username
        self.character_class = character_class
        self.available_spells = Classes.AVAILABLE_SPELLS[character_class]
        self.spell_cast_times = dict((spell, 0) for spell in self.available_spells)
        self.team = team
        self.reset()
        self.last_death = last_death

    def reset(self):
        self.hp = Classes.MAX_HP[self.character_class]
        self.position = {
            'x': 2 if self.team == 'blue' else hackarena.constants.MAP_TILES_WIDTH - 2,
            'y': 2 if self.team == 'blue' else hackarena.constants.MAP_TILES_HEIGHT - 2,
        }
