Healer = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'HEALER';
    this.maxHealth = 100;
    this.maxMoveDelay = 8;

    this.actions = {
        1: 'HEALER_HEAL',
        2: 'HEALER_DIRECT_DAMAGE'
    }

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'healer');
};

Healer.prototype = Object.create(Hero.prototype);
Healer.constructor = Healer;