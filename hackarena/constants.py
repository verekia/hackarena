# -*- coding: utf-8 -*-

MAP_TILES_WIDTH = 63 # 1008px
MAP_TILES_HEIGHT = 38 # 608px

class Classes(object):
    MAGE = 'mage'
    TANK = 'warrior'
    HEALER = 'healer'


class Spell(object):
    MAGE_DIRECT_DAMAGE = 'MAGE_DIRECT_DAMAGE'
    MAGE_AOE = 'MAGE_AOE'

    TANK_ATTACK = 'TANK_ATTACK'
    TANK_AOE = 'TANK_AOE'

    HEALER_HEAL = 'HEALER_HEAL'
    HEALER_DIRECT_DAMAGE = 'HEALER_DIRECT_DAMAGE'

