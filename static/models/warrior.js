var Warrior = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'WARRIOR';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: {id: 'TANK_ATTACK', display_name:'Attack'},
        2: {id: 'TANK_AOE', display_name:'Spin'},
    };

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ninja');
};

Warrior.prototype = Object.create(Hero.prototype);
Warrior.constructor = Warrior;

//OVERRIDE THIS ONE
Warrior.prototype.setCoolDown = function(attackType) {
    this.isAttacking = true;

    if (attackType === 'TANK_ATTACK') {
        this.nameStyle.fill = '#666666';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function() {
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
            this.isAttacking = false;
        }.bind(this), 1000);
    }

    if (attackType === 'TANK_AOE') {
        this.nameStyle.fill = '#666666';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function() {
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
            this.isAttacking = false;
        }.bind(this), 5000);
    }
};
