# -*- coding: utf-8 -*-
from enum import Enum


class Spell(Enum):
    MAGE_DIRECT_DAMAGE = 'MAGE_DIRECT_DAMAGE'
    MAGE_AOE = 'MAGE_AOE'

    TANK_ATTACK = 'TANK_ATTACK'
    TANK_AOE = 'TANK_AOE'

    HEALER_HEAL = 'HEALER_HEAL'
    HEALER_DIRECT_DAMAGE = 'HEALER_DIRECT_DAMAGE'
