// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d')
    let image = new Image();
    image.src = '../../../assets/background/cropped.jpg';

    //------------------------------------------------------------------
    //
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.clear();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through to save the canvas context.
    //
    //------------------------------------------------------------------
    function saveContext() {
        context.save();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through the restore the canvas context.
    //
    //------------------------------------------------------------------
    function restoreContext() {
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Rotate the canvas to prepare it for rendering of a rotated object.
    //
    //------------------------------------------------------------------
    function rotateCanvas(center, rotation) {
        context.translate(center.x * canvas.width, center.y * canvas.width);
        context.rotate(rotation);
        context.translate(-center.x * canvas.width, -center.y * canvas.width);
    }

    function drawText(message){
        context.fillStyle = 'red';
        context.font = '24px serif';
        context.fillText(message.message, message.position.x*4800, message.position.y*4800);
    }

    //------------------------------------------------------------------
    //
    // Draw an image into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawImage(texture, center, size) {
        let localCenter = {
            x: center.x * 4800,
            y: center.y * 4800
        };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height
        };

        context.drawImage(texture,
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width,
            localSize.height);
    }

    //------------------------------------------------------------------
    //
    // Draw an image out of a spritesheet into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawImageSpriteSheet(spriteSheet, spriteSize, sprite, center, size) {
        let localCenter = {
            x: center.x * 4800,
            y: center.y * 4800
        };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height
        };

        context.drawImage(spriteSheet,
            sprite * spriteSize.width, 0,                 // which sprite to render
            spriteSize.width, spriteSize.height,    // size in the spritesheet
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);
    }

    //------------------------------------------------------------------
    //
    // Draw a circle into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawCircle(center, radius, color) {
        context.beginPath();
        context.arc(center.x * 4800, center.y * 4800, 2 * .0025 * canvas.width, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }

    function drawAimer(startPos, direction){
        context.save();
        context.beginPath();
        let xVector = Math.cos(direction);
        let yVector = Math.sin(direction);
        context.moveTo(startPos.x * 4800, startPos.y * 4800);
        context.lineTo((startPos.x * 4800) + (xVector * 200), (startPos.y * 4800) + (yVector * 200));
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.setLineDash([10, 15]);
        context.stroke();
        context.fill();
        context.closePath();
        context.restore();

    }

    function drawVision(vision){
        context.save();
        context.beginPath();
        context.arc(vision.x*4800, vision.y*4800, vision.radius*canvas.width, vision.start, vision.end);
        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#808080";
        context.fill();
        context.stroke();
    }

    function drawWorldBoundary(width, height){
        context.beginPath();
        context.rect(0, 0, width, height);
        context.strokeStyle = 'red';
        context.stroke();
        context.closePath();
    }
    
    function drawHealthBar(position, size, health){
        let localPosition = {
            x: position.x * 4800,
            y: position.y * 4800
        };
        let localSize = {
            width: size.width * canvas.width,
            height: size.height * canvas.height
        };

        context.save();
        context.beginPath();
        let healthFraction = health/100;
        let missingFraction = 1 - healthFraction;
        context.fill();
        context.rect(localPosition.x - (localSize.width/2), localPosition.y + (localSize.height/2), localSize.width*healthFraction, localSize.height/8);
        context.fillStyle = 'green';
        context.fill();
        context.closePath();
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Function for enabling clipping vision for the player
    //
    //------------------------------------------------------------------

    function enableClipping(player, clip){
        if(!clip.clipping){
            context.save();
            clip.clipping = true;

            context.beginPath();
            context.arc(player.vision.x*4800, player.vision.y*4800, player.vision.radius*canvas.width, player.vision.start, player.vision.end);
            context.closePath();
            context.clip();
        }
    }

    //------------------------------------------------------------------
    //
    // Function for enabling clipping vision for the player
    //
    //------------------------------------------------------------------

    function disableClipping(clip){
        if(clip.clipping){
            context.restore();
            clip.clipping = false;
        }
    }

    // reference: https://stackoverflow.com/questions/16919601/html5-canvas-camera-viewport-how-to-actally-do-it
    function setCamera(player, minX, maxX, minY, maxY){
        context.setTransform(1,0,0,1,0,0);
        context.clear();
        let camX = clamp((-player.position.x * 4800) + (canvas.width/2), minX, maxX - (canvas.width));
        let camY = clamp((-player.position.y * 4800) + (canvas.height/2), minY, maxY - (canvas.height));
        console.log('camera:', camX , ' ', camY);
        context.translate(camX, camY);

    }

    function clamp(value, min, max){
        if(-value < min) return min;
        else if(-value > max) return -max;
        return value;
    }

    function drawBackground(){
        context.drawImage(MyGame.assets['background'], 0, 0, 4800, 4800); //should be 0,0,4800,4800?
    }

    return {
        clear: clear,
        saveContext: saveContext,
        restoreContext: restoreContext,
        rotateCanvas: rotateCanvas,
        drawImage: drawImage,
        drawImageSpriteSheet: drawImageSpriteSheet,
        drawAimer: drawAimer,
        drawCircle: drawCircle,
        drawVision: drawVision,
        enableClipping : enableClipping,
        disableClipping : disableClipping,
        drawHealthBar: drawHealthBar,
        drawCircle: drawCircle,
        drawText: drawText,
        setCamera: setCamera,
        drawWorldBoundary: drawWorldBoundary,
        drawBackground: drawBackground
    };
}());
