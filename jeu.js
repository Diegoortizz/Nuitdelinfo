var game2 = new Phaser.Game(1356, 95, Phaser.Canvas, 'phaser-example-2', { preload: preload2, create: create2 });
var game = new Phaser.Game(1356, 900, Phaser.Canvas, 'phaser-example', { preload: preload, create: create, update: update });


function preload() {

    game.load.image('bas', 'Graphics/bas.png');
    game.load.image('face', 'Graphics/haut.png');
    game.load.image('gauche', 'Graphics/gauche.png');
    game.load.image('droite', 'Graphics/droite.png');

    game.load.image('baie', 'Graphics/baie.png');
    game.load.image('batterie', 'Graphics/batterie.png');
    game.load.image('cactus', 'Graphics/cactus.png');
    game.load.image('eau', 'Graphics/eau.png');
    game.load.image('rocher', 'Graphics/rocher.png');
    game.load.image('panneau', 'Graphics/panneau.png');

    game.load.image('carte', 'Graphics/map.png');

    game.load.image('base', 'Graphics/base.png');

    game.load.image('rejouer', 'Graphics/rejouer.png');

}

function preload2() {

    game2.load.image('drink_bar', 'Graphics/drink_bar.png');
    game2.load.image('eat_bar', 'Graphics/eat_bar.png');
    game2.load.image('energy_bar', 'Graphics/energy_bar.png');
    game2.load.image('batterie', 'Graphics/batterie.png');
    game2.load.image('panneau', 'Graphics/panneau.png');


}

var sprite;
var group;
var cursors;

var timer;

var playerSpeed = 250;

var eatbar;
var drinkbar;
var energybar;

var maxLenBar = 500;

var day;
var timer2;
var generatedItem;

var bmpText;
var items = ["baie","batterie","eau","panneau"];

var restartButton;
var flag = false;

var totalEnergy = 0;
var food;
var water;
var energy;
var nbBatteries = 0;
var txtNbBatteries;

function create2() {
    game2.add.sprite(game2.width-75, game2.height/2,'batterie');
    game2.add.sprite(game2.width-50, game2.height/2,'panneau');
    
    game2.stage.backgroundColor = "#eee";

    eatbar = game2.add.sprite(0, 0, 'eat_bar');
    eatbar.cropEnabled = true;

    drinkbar = game2.add.sprite(0, 30, 'drink_bar');
    drinkbar.cropEnabled = true;

    energybar = game2.add.sprite(0, 60, 'energy_bar');
    energybar.cropEnabled = true;


    timer = game2.time.create(false);

    timer.loop(600, updateDay, this);
    timer.loop(1, update_eatbar, this);
    timer.loop(1, update_drinkbar, this);
    timer.loop(1, update_energybar, this);


    timer.start();

    var style = { font: "16px Arial", fill: "BLACK" };
    day = 121;
    bmpText = game2.add.text(game2.width/2, 16, "JOURS RESTANTS : " + day, style);
    food = game2.add.text(5, 4, "Nourriture", style);
    water = game2.add.text(5, 33, "Eau", style);
    energy = game2.add.text(5, 62, "Energie", style);
    txtNbBatteries = game2.add.text(game2.width-30, game2.height/2, "x "+nbBatteries, style);

}

function create() {   

    game.world.scale.setTo(1.5, 1.5);

    game.add.tileSprite(0, 0, game.width, game.height, "carte");

    cursors = game.input.keyboard.createCursorKeys();

    game.physics.startSystem(Phaser.Physics.ARCADE);


    sprite = game.add.sprite(game.width/2, game.height/2+50, 'bas');

    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON,0.1, 0.1);

    game.physics.enable(sprite);

    group = game.add.physicsGroup();

    generatedItem = generateObj(100);

    generateSameItem('cactus',50);
    generateSameItem('rocher', 30);

    timer2 = game.time.create(false);

    timer2.loop(game.rnd.between(800, 2000), showObjet, this);

    timer2.start();

    var base = group.create(650,300,'base');
    base.id="base";
    base.body.immovable=true;

    cursors = game.input.keyboard.createCursorKeys();
}

function showObjet(){
    var obj = generatedItem.shift();
    var c = group.create(obj[0], obj[1], obj.id);
    c.id = obj.id;
    c.body.immovable = true;
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
            unique[i].id = items[randomInRange(0,items.length)];
        }
    }

    return unique;
}

function generateSameItem(itemID, n){
    for(var i=0; i<n; i++){
        var c = group.create(randomInRange(0, game.width), randomInRange(0, game.height), itemID);
        c.id = itemID;
        c.body.immovable = true;
    }
}



function checkIfAlive(){
    if(eatbar.width <= 0 || energybar.width <= 0 || drinkbar.width <= 0){
        gameOver("LOSE");
    }
}

function update() {
    //game.time.events.add(Phaser.Timer.SECOND * game.rnd.between(1,5), generateItem(items));
    game.world.wrap(sprite, 0, true);

    checkIfAlive();

    game.physics.arcade.collide(sprite, group, collisionHandler, processHandler, this)

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown) {
        sprite.body.velocity.x = -playerSpeed;
        sprite.loadTexture("gauche", 0, false)
    }
    else if (cursors.right.isDown) {
        sprite.body.velocity.x = playerSpeed;
        sprite.loadTexture("droite", 0, false)
    }

    if (cursors.up.isDown) {
        sprite.body.velocity.y = -playerSpeed;
        sprite.loadTexture("face", 0, false)
    }
    else if (cursors.down.isDown) {
        sprite.body.velocity.y = playerSpeed;
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

        case "panneau":
        case "batterie":
            totalEnergy += 50;
            nbBatteries++;
            txtNbBatteries.text = "x "+nbBatteries;
            veg.kill();
            break;

        case "eau":
            drinkbar.width = (drinkbar.width + 50 > maxLenBar)? maxLenBar : drinkbar.width + 50;
            veg.kill();
            break;

        case "base":
            energybar.width = (energybar.width + totalEnergy > maxLenBar)? maxLenBar : energybar.width + totalEnergy;
            totalEnergy = 0;
            nbBatteries = 0;
            txtNbBatteries.text = "x "+nbBatteries;
    }
}

function update_drinkbar() { // 15
    // console.log("drink");
    drinkbar.width -= 0.35;
}

function update_eatbar() { // 10
    // console.log("eat");
    eatbar.width -= 0.25;;
}

function update_energybar() { // 5
    // console.log("energy");
    energybar.width -= 0.15;;
}

function randomnbr(a, b, n) {
    return (Math.random() * ((a / 10) - (b / 10)) + (b / 10)).toFixed(n);
}


function updateDay() {
    if(day !== 0){
        day--;
        bmpText.text = "JOURS RESTANTS : " + day;
    }else{
        gameOver("WIN");
    }
}
   
function restartGame(){
        flag = false;
        totalEnergy = 0;
        restartButton.destroy();
        game.state.restart();
        game2.state.restart();
}

function gameOver(result){ 
        var message;
        var textX;
        var textY;

        game.world.scale.setTo(1, 1);

        if(result === "WIN"){
            message = "FELICITATIONS !";
            
            sprite.x = game.width/2;
            sprite.y = game.height/2;

            textX = game.width/3;
            textY = game.height/2 - 30;
        }else if(result === "LOSE"){
            message = "VOUS ETES MORT";

            textX = game.width/3;
            textY = game.height/2 - 30;
        }

        var fontSize = 72;
        var style = { font: fontSize+"px Arial", fill: "BLACK", align: "center"  };

        var text = game.add.text(textX, textY, message, style);
        
        if(!flag){
            restartButton = game.add.button(game.world.centerX - 95, game.world.centerY + 50, 'rejouer', restartGame, this);
            flag = true;
            console.log(restartButton);
        }

        timer.stop();
        timer2.stop();

        game.physics.arcade.isPaused = true;
        game2.physics.arcade.isPaused = true;

    }


// Phaser version 2.4.8
// HealthBar 