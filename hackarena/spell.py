# -*- coding: utf-8 -*-
from hackarena.game_objects import BaseGameObject


class Spell(BaseGameObject):

    def __init__(self, spell_type, start_position, end_position):
        self.spell_type = spell_type
        self.start_position = start_position
        self.end_position = end_position

    @classmethod
    def create_spell(cls, spell_type, position_x, position_y, direction):
        # Assume top left is (0, 0)
        if direction == 'UP':
            end_position = {'x': position_x, 'y': position_y - 10}
        elif direction == 'RIGHT':
            end_position = {'x': position_x + 10, 'y': position_y}
        elif direction == 'DOWN':
            end_position = {'x': position_x, 'y': position_y + 10}
        elif direction == 'LEFT':
            end_position = {'x': position_x - 10, 'y': position_y}

        return cls(
            spell_type=spell_type,
            start_position={
                'x': position_x,
                'y': position_y,
            },
            end_position=end_position,
        )
