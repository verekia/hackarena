# -*- coding: utf-8 -*-
from hackarena.game_objects import BaseGameObject
from hackarena.constants import Spell as SpellConstants


class Spell(BaseGameObject):

    def __init__(self, spell_type, start_position, end_position, direction):
        self.spell_type = spell_type
        self.start_position = start_position
        self.end_position = end_position
        self.direction = direction
        self.cooldown = SpellConstants.SPELL_COOLDOWNS[spell_type]
        self.damage = SpellConstants.SPELL_DMG[spell_type]
        self.range = SpellConstants.SPELL_RANGES[spell_type]
        self.aoe = SpellConstants.SPELL_AOE_ENABLED[spell_type]

    @classmethod
    def create_spell(cls, spell_type, position_x, position_y, direction):
        # TODO: add support for different spell abilities other than lazer

        # Assume top left is (0, 0)
        if direction == 'UP':
            end_position = {'x': position_x, 'y': position_y - SpellConstants.SPELL_RANGES[spell_type]}
        elif direction == 'RIGHT':
            end_position = {'x': position_x + SpellConstants.SPELL_RANGES[spell_type], 'y': position_y}
        elif direction == 'DOWN':
            end_position = {'x': position_x, 'y': position_y + SpellConstants.SPELL_RANGES[spell_type]}
        elif direction == 'LEFT':
            end_position = {'x': position_x - SpellConstants.SPELL_RANGES[spell_type], 'y': position_y}

        return cls(
            spell_type=spell_type,
            start_position={
                'x': position_x,
                'y': position_y,
            },
            end_position=end_position,
            direction=direction,
        )
