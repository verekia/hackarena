Healer = function(game, characterName, isLocalPlayer, messageCallback, initX, initY) {
    this.characterClass = 'HEALER';
    this.maxHealth = 100;
    this.maxMoveDelay = 4;

    Hero.call(this, game, characterName, isLocalPlayer, messageCallback, initX, initY);
};

Healer.prototype = Object.create(Hero.prototype);
Healer.constructor = Healer;