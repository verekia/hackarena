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

//OVERRIDE THIS ONE
Warrior.prototype.setCoolDown = function(attackType){
    if(attackType == 'TANK_ATTACK'){
        this.nameStyle.fill = '#ff00ff';
        this.nameText.setStyle(this.nameStyle);
        setTimeout(function(){
            this.nameStyle.fill = this.nameStyleFillDefault;
            this.nameText.setStyle(this.nameStyle);
        }.bind(this), 1000)
    }
}
