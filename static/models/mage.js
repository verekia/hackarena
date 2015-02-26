Mage = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'MAGE';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: 'MAGE_DIRECT_DAMAGE',
        2: 'MAGE_AOE'
    }

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ranger');
};

Mage.prototype = Object.create(Hero.prototype);
Mage.constructor = Mage;