var land;
var hero;
var cursors;

function preload() {
    game.load.image('hero', 'static/sprites/hero.png');
    game.load.spritesheet('earth', 'static/sprites/map.png', 10, 10, 10);

    game.load.atlasJSONHash('ranger', 'static/sprites/ranger/ranger.png', 'static/sprites/ranger/ranger.json');
}

function create() {
    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our hero
    //hero = game.add.sprite(0, 0, 'hero', 'hero');
    hero = new Hero(game, 0,0);
    //hero.animations.add('move', ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6'], 20, true);

    //  This will force it to decelerate and limit its speed

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    //var ranger = game.add.sprite(16, 18, 'ranger');
    //ranger.animations.add('r');
    //ranger.animations.play('r', 5, true);
}

function update() {
    hero.update(cursors);
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;

    if (cursors.left.isDown) {
        hero.body.velocity.x = -200;
    }
    else if (cursors.right.isDown) {
        hero.body.velocity.x = 200;
    }

    if (cursors.up.isDown) {
        hero.body.velocity.y = -200;
    }
    else if (cursors.down.isDown) {
        hero.body.velocity.y = 200;
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown) {
        console.log("FIRE");
    }
}

function render() {
    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('woot', 32, 32);
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

