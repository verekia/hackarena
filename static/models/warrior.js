Warrior = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'WARRIOR';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: 'TANK_ATTACK',
        2: 'TANK_AOE'
    }

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ninja');
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.constructor = Warrior;