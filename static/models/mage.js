Mage = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'MAGE';
    this.maxHealth = 75;
    this.maxMoveDelay = 18;

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ranger');
};

Mage.prototype = Object.create(Hero.prototype);
Mage.constructor = Mage;