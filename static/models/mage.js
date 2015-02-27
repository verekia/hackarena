Mage = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'MAGE';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: {id: 'MAGE_DIRECT_DAMAGE', display_name:'Fireball'},
        2: {id: 'MAGE_AOE', display_name:'Explosion'}
    }

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ranger');
};

Mage.prototype = Object.create(Hero.prototype);
Mage.constructor = Mage;