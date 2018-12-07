var game2 = new Phaser.Game(800, 95, Phaser.Canvas, 'phaser-example-2', { preload: preload2, create: create2 });
var game = new Phaser.Game(1356, 700, Phaser.Canvas, 'phaser-example', { preload: preload, create: create, update: update });


function preload() {

    game.load.image('bas', 'Graphics/bas.png');
    game.load.image('face', 'Graphics/haut.png');
    game.load.image('gauche', 'Graphics/gauche.png');
    game.load.image('droite', 'Graphics/droite.png');

    game.load.image('baie', 'Graphics/baie.png');
    game.load.image('batterie', 'Graphics/batterie.png');
    game.load.image('cactus', 'Graphics/cactus.png');
    game.load.image('eau', 'Graphics/eau.png');

    game.load.image('carte', 'Graphics/map.png');

    game.load.image('base', 'Graphics/base.png');

}

function preload2() {

    game2.load.image('drink_bar', 'Graphics/drink_bar.png');
    game2.load.image('eat_bar', 'Graphics/eat_bar.png');
    game2.load.image('energy_bar', 'Graphics/energy_bar.png');

}
var cst_down = 0.15;
var sprite;
var group;
var cursors;

var timer;


var eatbar;
var drinkbar;
var energybar;

var maxLenBar = 500;

var day;
var timer2;
var timer3;
var generatedItem;

var bmpText;
var items = ["baie","batterie","eau"];

function create2() {


    timer2 = game2.time.events.loop(600, updateDay, this);

    game2.stage.backgroundColor = "#ffffff";

    eatbar = game2.add.sprite(0, 0, 'eat_bar');
    eatbar.cropEnabled = true;

    drinkbar = game2.add.sprite(0, 30, 'drink_bar');
    drinkbar.cropEnabled = true;

    energybar = game2.add.sprite(0, 60, 'energy_bar');
    energybar.cropEnabled = true;


    timer = game2.time.create(false);

    timer.loop(1, update_eatbar, this);
    timer.loop(1, update_drinkbar, this);
    timer.loop(1, update_energybar, this);


    timer.start();

    var style = { font: "16px Arial", fill: "BLACK" };
    day = 121;
    bmpText = game2.add.text(550, 16, "JOURS RESTANTS : " + day, style);
    food = game2.add.text(5, 4, "Nourriture", style);
    water = game2.add.text(5, 33, "Eau", style);
    energy = game2.add.text(5, 62, "Energie", style);

}
function create() {    
    game.world.scale.setTo(1.5, 1.5);

    game.add.tileSprite(0, 0, game.width, game.height, "carte");

    cursors = game.input.keyboard.createCursorKeys();

    game.physics.startSystem(Phaser.Physics.ARCADE);


    sprite = game.add.sprite(game.width/2, game.height/2+50, 'bas');

    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON);

    game.physics.enable(sprite);

    group = game.add.physicsGroup();

    generatedItem = generateObj(100);

    generateCactus(50);

    timer3 = game.time.events.loop(game.rnd.between(500, 3000), showObjet, this);

    var base = group.create(650,300,'base');
    base.id="base";
    base.body.immovable=true;

    cursors = game.input.keyboard.createCursorKeys();

    game.time.events.add(Phaser.Timer.SECOND * 10, end, this);
}

function showObjet(){
    var obj = generatedItem.shift();
    var c = group.create(obj[0], obj[1], obj.id);
    c.id = obj.id;
    c.body.immovable = true;
}

function end() {
    console.log("stop");
}

function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function generateObj(n) {
    var arr = [];

    for (var i = 0; i < n; i++) {
        arr.push([randomInRange(0, game.width), randomInRange(0, game.height)]);
    }


    var unique = arr.map(cur => JSON.stringify(cur))
        .filter(function (curr, index, self) {
            return self.indexOf(curr) == index;
        })
        .map(cur => JSON.parse(cur));

    for (var i = 0; i < unique.length; i++) {
        var x = unique[i][0];
        var y = unique[i][1];
        if (x < 730 && x > 650 && y > 300 && y < 380) {
            unique.splice(i, 1);
        } else {
            unique[i].id = items[randomInRange(0,2)];
        }
    }

    return unique;
}

function generateCactus(n){
    for(var i=0; i<n; i++){
        var c = group.create(randomInRange(0, game.width), randomInRange(0, game.height), 'cactus');
        c.id = 'cactus';
        c.body.immovable = true;
    }
}

function checkBounds(){
    if(sprite.x < 0){sprite.x = game.width}
    if(sprite.x > game.width){sprite.x = 0}
    if(sprite.y < 0){sprite.y = game.height}
    if(sprite.y > game.height){sprite.y = 0}
}

function update() {
    //game.time.events.add(Phaser.Timer.SECOND * game.rnd.between(1,5), generateItem(items));
    checkBounds();

    game.physics.arcade.collide(sprite, group, collisionHandler, processHandler, this)

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown) {
        sprite.body.velocity.x = -200;
        sprite.loadTexture("gauche", 0, false)
    }
    else if (cursors.right.isDown) {
        sprite.body.velocity.x = 200;
        sprite.loadTexture("droite", 0, false)
    }

    if (cursors.up.isDown) {
        sprite.body.velocity.y = -200;
        sprite.loadTexture("face", 0, false)
    }
    else if (cursors.down.isDown) {
        sprite.body.velocity.y = 200;
        sprite.loadTexture("bas", 0, false)
    }
}

function processHandler(player, veg) {
    return true;
}

function collisionHandler(player, veg) {
    switch(veg.id){
        case "baie":
            eatbar.width = (eatbar.width + 50 > maxLenBar)? maxLenBar : eatbar.width + 50;
            veg.kill();
            break;

        case "batterie":
            energybar.width = (energybar.width + 50 > maxLenBar)? maxLenBar : energybar.width + 50;
            veg.kill();
            break;

        case "eau":
            drinkbar.width = (drinkbar.width + 50 > maxLenBar)? maxLenBar : drinkbar.width + 50;
            veg.kill();
            break;
    }
}

function update_drinkbar() { // 15
    // console.log("drink");
    drinkbar.width -= 0.7;
}

function update_eatbar() { // 10
    // console.log("eat");
    eatbar.width -= 0.5;;
}

function update_energybar() { // 5
    // console.log("energy");
    energybar.width -= 0.3;;
}

function randomnbr(a, b, n) {
    return (Math.random() * ((a / 10) - (b / 10)) + (b / 10)).toFixed(n);
}


function updateDay() {
    day--;
    bmpText.text = "JOURS RESTANTS : " + day;

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

// Phaser version 2.4.8
// HealthBar 