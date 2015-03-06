var Mage = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'MAGE';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: {id: 'MAGE_DIRECT_DAMAGE', display_name:'Fireball'},
        2: {id: 'MAGE_AOE', display_name:'Explosion'}
    };

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'ranger');
};

Mage.prototype = Object.create(Hero.prototype);
Mage.constructor = Mage;

//OVERRIDE THIS ONE
Mage.prototype.setCoolDown = function(attackType){
    this.isAttacking = true;
    if(attackType === 'MAGE_DIRECT_DAMAGE'){
        this.nameStyle.fill = '#666666';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function(){
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
            this.isAttacking = false;
        }.bind(this), 1000);
    }
    if(attackType === 'MAGE_AOE'){
        this.nameStyle.fill = '#666666';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function(){
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
            this.isAttacking = false;
        }.bind(this), 5000);
    }
};
