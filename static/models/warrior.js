Warrior = function(game, characterName, isLocalPlayer, messageCallback, initX, initY) {
    this.characterClass = 'WARRIOR';
    this.maxHealth = 100;
    this.speed = 4;

    Hero.call(this, game, characterName, isLocalPlayer, messageCallback, initX, initY);
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.constructor = Warrior;