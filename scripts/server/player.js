let random = require ('./random');

function createPlayer(){
    let that = {};

    let position = {
        x: random.nextDouble(),
        y: random.nextDouble()
    };

    let size = {
        width: 0.00625,
        height: 0.00625,
        radius: 0.0075
        //may need to change values here
    };

    let direction = random.nextDouble() * 2 * Math.PI; //angle facing at start

    let vision = {
        x : position.x,
        y : position.y,
        radius : .3,
        start : direction - Math.PI/2,
        end : direction + Math.PI/2
    };

    let rotateRate = Math.PI / 1000;
    let speed = .000025;
    let reportUpdate = true;

    let health = 100;
    let playerDamage = 20;
    let state = 'alive';

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    })

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    Object.defineProperty(that, 'radius', {
        get: () => size.radius
    });

    Object.defineProperty(that, 'playerDamage',{
        get: () => playerDamage,
        set: (value) => {playerDamage = value},
        increase: (value) => {playerDamage += value},
        decrease: (value) => {playerDamage -= value}
    });

    Object.defineProperty(that, 'health', {
        get: () => health,
        set: (value) => health = value,
        increase: (value) => {health += value},
        decrease: (value) => {health -= value}
    });

    Object.defineProperty(that, 'vision', {
        get : () => vision,
        set : (value) => vision = value
    });

    Object.defineProperty(that, 'state',{
        get: () => state,
        set: (value) => {state = value}
    })

    that.move = function(elapsedTime) {
        reportUpdate = true;
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        position.x += (vectorX * elapsedTime * speed);
        position.y += (vectorY * elapsedTime * speed);
        if(position.x < 0){
            position.x = 0;
        }
        if(position.x > 1){
            position.x = 1;
        }
        if(position.y < 0){
            position.y = 0;
        }
        if(position.y > 1){
            position.y = 1;
        }
        
        vision.x = position.x;
        vision.y = position.y;
    };

    that.rotateRight = function(elapsedTime){
        reportUpdate = true;
        direction += (rotateRate * elapsedTime);
        if(direction >= 2*Math.PI) direction -= 2*Math.PI;
        vision.start = direction - Math.PI/2;
        vision.end = direction + Math.PI/2;
    };

    that.rotateLeft = function(elapsedTime){
        reportUpdate = true;
        direction -= (rotateRate * elapsedTime);
        if(direction < 0) direction += 2*Math.PI;
        vision.start = direction - Math.PI/2;
        vision.end = direction + Math.PI/2;
    };

    that.missileHit = function(damage){
        health -= damage;
    };

    that.update = function(when){
    };

    that.pushUpdate = function(){
        reportUpdate = true;
    }

    return that;
}

module.exports.create = () => createPlayer();