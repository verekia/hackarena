Healer = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'HEALER';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: {id: 'HEALER_HEAL', display_name:'Heal'},
        2: {id: 'HEALER_DIRECT_DAMAGE', display_name:'Laser'}
    }

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'healer');
};

Healer.prototype = Object.create(Hero.prototype);
Healer.constructor = Healer;