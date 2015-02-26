Healer = function(game, characterName, isLocalPlayer, initX, initY) {
    this.characterClass = 'HEALER';
    this.maxHealth = 100;
    this.maxMoveDelay = 18;

    Hero.call(this, game, characterName, isLocalPlayer, initX, initY, 'healer');
};

Healer.prototype = Object.create(Hero.prototype);
Healer.constructor = Healer;