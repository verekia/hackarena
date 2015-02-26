Healer = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'HEALER';
    this.maxHealth = 100;
    this.maxMoveDelay = 4;

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'healer');
};

Healer.prototype = Object.create(Hero.prototype);
Healer.constructor = Healer;