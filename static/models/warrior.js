Warrior = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'WARRIOR';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: {id: 'TANK_ATTACK', display_name:'Attack'},
        2: {id: 'TANK_AOE', display_name:'Spin'}
    }

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ninja');
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.constructor = Warrior;