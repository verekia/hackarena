var Healer = function(game, characterName, team, isLocalPlayer, initX, initY) {
    this.characterClass = 'HEALER';
    this.maxHealth = 130;
    this.maxMoveDelay = 8;

    this.actions = {
        1: {id: 'HEALER_HEAL', display_name:'Heal'},
        2: {id: 'HEALER_DIRECT_DAMAGE', display_name:'Laser'}
    };

    Hero.call(this, game, characterName, team, isLocalPlayer, initX, initY, 'healer');
};

Healer.prototype = Object.create(Hero.prototype);
Healer.constructor = Healer;

//OVERRIDE THIS ONE
Healer.prototype.setCoolDown = function(attackType){
    this.isAttacking = true;
    if(attackType === 'HEALER_HEAL'){
        this.nameStyle.fill = '#666666';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function(){
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
            this.isAttacking = false;
        }.bind(this), 1000);
    }
    if(attackType === 'HEALER_DIRECT_DAMAGE'){
        this.nameStyle.fill = '#666666';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function(){
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
            this.isAttacking = false;
        }.bind(this), 1000);
    }
};
