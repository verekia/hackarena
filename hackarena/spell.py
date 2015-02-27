# -*- coding: utf-8 -*-
from hackarena.game_objects import BaseGameObject
import hackarena.constants as constants

SPELL_COOLDOWNS = {
    constants.Spell.MAGE_DIRECT_DAMAGE: 1000,
    constants.Spell.TANK_ATTACK: 1000,
    constants.Spell.HEALER_DIRECT_DAMAGE: 1000,
    constants.Spell.MAGE_AOE: 5000,
    constants.Spell.TANK_AOE: 5000,
    constants.Spell.HEALER_HEAL: 1000,
}

SPELL_RANGES = {
    constants.Spell.MAGE_DIRECT_DAMAGE: 10 * 16,
    constants.Spell.TANK_ATTACK: 4 * 16,
    constants.Spell.HEALER_DIRECT_DAMAGE: 6 * 16,
    constants.Spell.HEALER_HEAL: 6 * 16,

    # TODO: make these ranges meaningful
    constants.Spell.TANK_AOE: 4 * 16,
    constants.Spell.MAGE_AOE: 10 * 16,
}

SPELL_DMG = {
    constants.Spell.BIG_DMG: 35,
    constants.Spell.NORMAL_DMG: 20,
    constants.Spell.HEALING: 15,
}


class Spell(BaseGameObject):

    def __init__(self, spell_type, start_position, end_position, direction):
        self.spell_type = spell_type
        self.start_position = start_position
        self.end_position = end_position
        self.direction = direction
        self.cooldown = SPELL_COOLDOWNS[spell_type]

    @classmethod
    def create_spell(cls, spell_type, position_x, position_y, direction):
        # TODO: add support for different spell abilities other than lazer

        # Assume top left is (0, 0)
        if direction == 'UP':
            end_position = {'x': position_x, 'y': position_y - SPELL_RANGES[spell_type]}
        elif direction == 'RIGHT':
            end_position = {'x': position_x + SPELL_RANGES[spell_type], 'y': position_y}
        elif direction == 'DOWN':
            end_position = {'x': position_x, 'y': position_y + SPELL_RANGES[spell_type]}
        elif direction == 'LEFT':
            end_position = {'x': position_x - SPELL_RANGES[spell_type], 'y': position_y}

        return cls(
            spell_type=spell_type,
            start_position={
                'x': position_x,
                'y': position_y,
            },
            end_position=end_position,
            direction=direction,
        )
