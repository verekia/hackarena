Warrior = function(game, characterName, isLocalPlayer, messageCallback, initX, initY) {
    this.characterClass = 'WARRIOR';
    this.maxHealth = 100;
    this.maxMoveDelay = 8;

    Hero.call(this, game, characterName, isLocalPlayer, messageCallback, initX, initY);
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.constructor = Warrior;