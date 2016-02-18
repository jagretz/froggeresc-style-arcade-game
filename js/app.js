/**
 * TODO:
 * Collision detection
 * Do not reset character until after hitting the game board edge or hitting a exit location.
 * Randomize enemy spawn times
 * Add character selection
 * Add ability to choose a random character
 * Add obstacles when generating game board
 * Add gems to collect to game board
 * Add score
 * Add lives
 * Add sound
 * Add music with options for volume adjustment and mute
 * Add multiple different songs to choose from.
 */
//------------------------------------------------------------------------//
// Global variable
// var game = {};
// var enemies = [];
// var player = {};
var BLOCK_SIZE_X = 101,
    BLOCK_SIZE_Y = 83,
    characterSelect = 0;
    
// Variable for setting the starter point of the player.
var playerStartX = 2 * BLOCK_SIZE_X,
    playerStartY = 5 * BLOCK_SIZE_Y - 10; // less 20 because last block is slightly longer

//------------------------------------------------------------------------//
// Game Piece
//------------------------------------------------------------------------//

/**
 * Any game peice that can be displayed on screen. Provides x & y coordinates with defualts to
 * off screen values so the peice is not displayed.
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 * @constructor
 */
var GamePiece = function (x, y) {
    this.width = 101; // one step onto the game board horizontally
    this.height = 171; // one step onto the game board vertically
    
    // set x, default to off screen
    if (x) {
        this.x = x;
    } else {
        this.x = -101;
    }
    
    // set y, or default to off screen
    if (y) {
        this.y = y;
    } else {
        this.y = -171;
    }
};

/**
 * Updates x, y coordinate of any GamePiece object
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 */
GamePiece.prototype.updateCoordinates = function (x, y) {
    this.x = x;
    this.y = y;
};

//------------------------------------------------------------------//
// Enemy
//------------------------------------------------------------------//

/**
 * Enemies our player must avoid. Variables applied to each of our instances go here.
 * @constructor
 */
var Enemy = function() {
    // The image/sprite for our enemies, this uses a helper provided in engine.js to easily load images
    this.sprite = 'images/enemy-bug.png';    
    this.reset();
};

/** 
 * Update the enemy's position, required method for game.
 * @param {number} dt a time delta (date/time) between ticks (since last frame). dt keeps the
 * movement speed consistant between different machines / computers.
 */
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter to ensure the game runs at the same speed for all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > BLOCK_SIZE_X * 5) {
        this.reset();
    }
};

/**
 * Reset the enemy back to a random starting position at a random speed.
 * 
 * x-axis: Start enemy completely off screen along the x-axis.
 * y-axis: 
 * 1) Take a random number and multiply it by 3. This will give you the 1st, 2nd, & 3rd blocks 
 * along the y axis.
 * 2) The random number will be a float so get the closest int value. This will result in n blocks 
 * along the y-axis at either position 1, 2, or 3.
 * 3) Multiple by the vertical block size (y) to get correct y-axis positioning.
 * 4) Finally, add 55 to the total because the last block is 55px larger that every other block and would 
 * cause the enemy to appear off-center on the row (block images).   
 */
Enemy.prototype.reset = function() {
    this.x = 0 - BLOCK_SIZE_X;
    this.y = 55 + Math.floor(Math.random() * 3) * BLOCK_SIZE_Y;
    this.speed = Math.floor(Math.random() * 500) + 100;    
}

/**
 * Draw the enemy on the screen; required method for game.
 */ 
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//------------------------------------------------------------------------//
// Player
//------------------------------------------------------------------------//

/**
 * Player object for sprite animation and movement.
 * @constructor
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    // this.x = playerStartX;
    // this.y = playerStartY;
    this.reset();
};

    // canvas.width = 505;
    // canvas.height = 606;
/**
 * @param {Date} dt a time delta (date/time) between clicks (frame refresh).
 */
Player.prototype.update = function() {
    // reset char to starting position. Why -20?
    if (this.y <= -10) {
        // this.x = playerStartX;
        // this.y = playerStartY;
        console.log('you won, good job, resetting character position');
        this.reset();
    // think this should be first? hitting an enemy should be checked before eog
    } else if (collisionDetect()) {
        // this.x = playerStartX;
        // this.y = playerStartY;
        console.log('YOU JUST GOT RAILED!');
        this.reset();
    } 
    // otherwise nothing happens
};

// jag fn: reset the player to starting coordinates 
Player.prototype.reset = function() {
    this.x = playerStartX;
    this.y = playerStartY;
}

// @return {boolean} true if player and enemy collide.
function collisionDetect() {
    // get player space/collision ares (x,y) only once for each enemy
    var playerCollisionArea = {
        x: Math.floor(player.x / BLOCK_SIZE_X),
        y: Math.floor(player.y / BLOCK_SIZE_Y)
    }
    // console.log(playerCollisionArea.x + ',' + playerCollisionArea.y);
    
    // loop through all existing enemies
    
    // enemies.forEach(function(enemy){
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        var enemyCollisionArea = {
            x: Math.floor(enemy.x / BLOCK_SIZE_X),
            y: Math.floor(enemy.y / BLOCK_SIZE_Y)
        }
        // enemy space roughly the equals player space. This is not the most accurate
        // if enemy and player x,y match -> collision
        var collision = enemyCollisionArea.x === playerCollisionArea.x &&
                        enemyCollisionArea.y === playerCollisionArea.y;
                                
        if (collision) {
            //  reset player starting position.
            return true; // true/collision
        }
    };
    // otherwise no collision 
    return false;
}

/**
 * Draw the currently selected player sprite at x, y coordinates
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @param {string} value string representation of the key press.
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x < BLOCK_SIZE_X) {
                this.x = this.x;
            } else {
                this.x = this.x - BLOCK_SIZE_X;
            }
            break;
        case 'up':
            if (this.y < BLOCK_SIZE_Y - 20) {
                this.y = this.y;
            } else {
                this.y = this.y - BLOCK_SIZE_Y;
            }
            break;
        case 'right':
            if (this.x > BLOCK_SIZE_X * 3) {
                this.x = this.x;
            } else {
                this.x = this.x + BLOCK_SIZE_X;
            }
            break;
        case 'down':
            if (this.y > BLOCK_SIZE_Y * 4) {
                this.y = this. y;
            } else {
                this.y = this.y + BLOCK_SIZE_Y;
            }
            break;
    }
    collisionPosition(this);
    enemies.forEach(function(e) {
        collisionPosition(e);
    }, this);
    console.log('-------------------------------');
};

function collisionPosition(target) {
    console.log(Math.floor(target.x / BLOCK_SIZE_X) + ',' + Math.floor(target.y / BLOCK_SIZE_Y));
}

//------------------------------------------------------------------//
// Other
//------------------------------------------------------------------//

// Now instantiate your objects.
// Place all enemy objects in an array called enemies
// Place the player object in a variable called player
var enemies = [];
var player = new Player();

// For generate new enemy every 3 seconds then stop.
function generateEnemy(){
    var enemy = new Enemy();
    enemies.push(enemy);
    if (enemies.length > 2) {
        clearInterval(randomEnemy);
    }
}

generateEnemy();
var randomEnemy = setInterval(generateEnemy, 3000);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
