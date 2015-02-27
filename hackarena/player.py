# -*- coding: utf-8 -*-
import hackarena.constants
from hackarena.constants import Classes
from hackarena.constants import Spell
from hackarena.game_objects import BaseGameObject


AVAILABLE_SPELLS = {
    Classes.TANK: [Spell.TANK_ATTACK, Spell.TANK_AOE],
    Classes.MAGE: [Spell.MAGE_DIRECT_DAMAGE, Spell.MAGE_AOE],
    Classes.HEALER: [Spell.HEALER_DIRECT_DAMAGE, Spell.HEALER_HEAL],
    Classes.HQ: [],
}

MAX_HP = 130


class Player(BaseGameObject):

    def __init__(
        self,
        username,
        character_class,
        team,
        hp=MAX_HP,
        last_death=0,
    ):
        self.MAX_HP = MAX_HP

        self.username = username
        self.character_class = character_class
        self.available_spells = AVAILABLE_SPELLS[character_class]
        self.spell_cast_times = dict((spell, 0) for spell in self.available_spells)
        self.team = team
        self.reset()
        self.last_death = last_death

    def reset(self):
        self.hp = MAX_HP
        self.position = {
            'x': 2 if self.team == 'blue' else hackarena.constants.MAP_TILES_WIDTH - 2,
            'y': 2 if self.team == 'blue' else hackarena.constants.MAP_TILES_HEIGHT - 2,
        }
