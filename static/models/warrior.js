Warrior = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'WARRIOR';
    this.maxHealth = 100;
    this.maxMoveDelay = 8;

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ninja');
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.constructor = Warrior;