Tower = function(game, initX, initY, team) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    if(team === 'red') {
        Phaser.Sprite.call(this, game, initX, initY, 'tower_red');
    } else {
        Phaser.Sprite.call(this, game, initX, initY, 'tower_blue');
    }

    this.game = game;
    this.game.add.existing(this);
    this.teamDisplay;

    if (team == 'blue') {
        this.otherTeamDisplay = 'Red';
    } else {
        this.otherTeamDisplay = 'Blue';
    }

    this.healthBar = new HealthBar(game, this.x - 8, this.y - 6, 64);
};

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.updateTower = function (health, maxHealth) {
    this.health = health;
    this.maxHealth = maxHealth;
    this.healthBar.updateHealthBar(this.health, this.maxHealth);
    if (health <= 0) {
        $('.js-game-over-team').html(this.otherTeamDisplay);
        $('.js-game-over').show();
        setTimeout(function(){
            window.location = '/';
        }, 3000);
    }
}