Mage = function(game, characterName, isLocalPlayer, initX, initY) {
    this.characterClass = 'MAGE';
    this.maxHealth = 75;
    this.maxMoveDelay = 6;

    Hero.call(this, game, characterName, isLocalPlayer, initX, initY, 'ranger');
};

Mage.prototype = Object.create(Hero.prototype);
Mage.constructor = Mage;