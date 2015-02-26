var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var land;
var shadow;
var hero;
var cursors;
var currentSpeed;

function preload() {
    game.load.image('hero', 'static/sprites/hero.png');
    game.load.spritesheet('earth', 'static/sprites/map.png', 10, 10, 10);
}


function create() {
    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our hero
    hero = game.add.sprite(0, 0, 'hero', 'hero');
    hero.anchor.setTo(0.5, 0.5);
    hero.animations.add('move', ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(hero, Phaser.Physics.ARCADE);
    hero.body.drag.set(0.2);
    hero.body.maxVelocity.setTo(200, 200);
    hero.body.collideWorldBounds = true;


    //  A shadow below our hero
    shadow = game.add.sprite(0, 0, 'hero', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    hero.bringToTop();

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    if (cursors.left.isDown) {
        hero.angle -= 4;
    }
    else if (cursors.right.isDown) {
        hero.angle += 4;
    }

    if (cursors.up.isDown) {
        //  The speed we'll travel at
        currentSpeed = 300;
    }
    else {
        if (currentSpeed > 0) {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0) {
        game.physics.arcade.velocityFromRotation(hero.rotation, currentSpeed, hero.body.velocity);
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;


    if (game.input.activePointer.isDown) {

    }


}

function render () {
    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('woot', 32, 32);
}

