var Spell = function(game, spellData) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.startPosition = spellData.start_position;
    this.endPosition = spellData.end_position;
    this.spellType = spellData.spell_type;
    this.range = spellData.range;
    this.game.add.existing(this);

    // Quick fix, hero anchor moved to top-left
    this.startPosition.x += 0.5;
    this.startPosition.y += 0.5;
    this.endPosition.x += 0.5;
    this.endPosition.y += 0.5;

    if (this.startPosition.x === this.endPosition.x) {
        this.direction = 'vertical';
    } else {
        this.direction = 'horizontal';
    }

    var sound = 'simple_spell';

    if (this.spellType === 'TANK_AOE') {
        this.drawTankAOE();
        sound = 'spell';
    } else if (this.spellType === 'MAGE_DIRECT_DAMAGE') {
        this.drawFireball();
        sound = 'railgun';
    } else if (this.spellType === 'MAGE_AOE') {
        this.drawFireAOE();
        sound = 'spell';
    } else if (this.spellType === 'HEALER_HEAL') {
        this.drawHeal();
        sound = 'heal';
    } else if (this.spellType === 'HEALER_DIRECT_DAMAGE') {
        this.drawHealerDamage();
    } else if (this.spellType === 'TANK_ATTACK') {
        this.drawTankAttack();
        sound = 'punch';
    } else {
        this.drawLine();
    }
    this.sound = this.game.add.sound(sound);
    this.sound.play();

    this.frame = 15;
    this.frameMax = 15;

    this.maxWidth = this.width;
    this.maxHeight = this.height;
    //setTimeout(this.destroy.bind(this), 100);
};

Spell.prototype = Object.create(Phaser.Graphics.prototype);
Spell.prototype.constructor = Spell;

Spell.prototype.drawLine = function() {
    this.clear();
    this.lineStyle(5, Math.floor(Math.random() * 16777215), 1);
    this.moveTo(this.startPosition.x * 16, this.startPosition.y * 16);
    this.lineTo(this.endPosition.x * 16, this.endPosition.y * 16);
};

Spell.prototype.drawFireball = function() {
    this.clear();
    this.lineStyle(5, 16729088, 1);
    this.moveTo(this.startPosition.x * 16, this.startPosition.y * 16);
    this.lineTo(this.endPosition.x * 16, this.endPosition.y * 16);
};

Spell.prototype.drawFireAOE = function() {
    this.lineStyle(5, 16729088, 0.8);
    this.beginFill(16769024, 0.5);
    this.drawCircle(this.startPosition.x * 16, this.startPosition.y * 16, this.range * 2 * 16);
};

Spell.prototype.drawHeal = function() {
    this.clear();
    this.lineStyle(5, 57876, 1);
    this.moveTo(this.startPosition.x * 16, this.startPosition.y * 16);
    this.lineTo(this.endPosition.x * 16, this.endPosition.y * 16);
};

Spell.prototype.drawHealerDamage = function() {
    this.clear();
    this.lineStyle(5, 16364288, 1);
    this.moveTo(this.startPosition.x * 16, this.startPosition.y * 16);
    this.lineTo(this.endPosition.x * 16, this.endPosition.y * 16);
};

Spell.prototype.drawTankAttack = function() {
    this.clear();
    this.lineStyle(5, 11184810, 1);
    this.moveTo(this.startPosition.x * 16, this.startPosition.y * 16);
    this.lineTo(this.endPosition.x * 16, this.endPosition.y * 16);
};

Spell.prototype.drawTankAOE = function() {
    this.lineStyle(5, 11184810, 0.8);
    this.beginFill(13421772, 0.5);
    this.drawCircle(this.startPosition.x * 16, this.startPosition.y * 16, this.range * 2 * 16);
};

Spell.prototype.update = function() {
    if (!(this.spellType === 'TANK_AOE' || this.spellType === 'MAGE_AOE')) {
        if (this.direction === 'vertical') {
            this.startPosition.y = this.startPosition.y + (this.endPosition.y - this.startPosition.y) * ((this.frameMax - this.frame) / this.frameMax);
        } else {
            this.startPosition.x = this.startPosition.x + (this.endPosition.x - this.startPosition.x) * ((this.frameMax - this.frame) / this.frameMax);
        }

        if (this.spellType === 'MAGE_DIRECT_DAMAGE') {
            this.drawFireball();
        } else if (this.spellType === 'HEALER_HEAL') {
            this.drawHeal();
        } else if (this.spellType === 'HEALER_DIRECT_DAMAGE') {
            this.drawHealerDamage();
        } else if (this.spellType === 'TANK_ATTACK') {
            this.drawTankAttack();
        } else {
            this.drawLine();
        }
    }
    this.frame--;
};
