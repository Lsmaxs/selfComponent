/* 
* @Author: Marte
* @Date:   2016-08-27 18:43:58
* @Last Modified by:   Marte
* @Last Modified time: 2016-08-27 20:11:27
*
* 
*/
 var footboot = (function(){
    var RequestAnimattFrame = (function(callback){
       return  window.requestAnimationFrame||
        window.webkitRequestAnimationFrame||
        window.mozRequestAnimationFrame||
        function(callback){
            setTimeout(callback, 1000/60);
        }
    })();
     var can , ctx , images,ball;
     function Ball(ballimages,options){
        this.width = options.width;
        this.height = options.height;
        this.x = options.left;
        this.y = options.top;
        this.image = ballimages;
        this.gravity = 0.4; //重力系数
        this.vy = 0.8;//Y的增量
        this.vx = 4;
        this.vyAdjust = -15;//校准参数
        this.vxAdjust = 0.25;
        this.factor = 0.65;//衰减因子
        this.end = false;
        this.degree=0;
     }
     Ball.prototype.draw = function(){
        ctx.save();
        this.rotate();
        ctx.drawImage(this.image, 0, 0, 100, 100,this.x,this.y,this.width,this.height);
        ctx.restore();

        if(this.vx>0){
            this.degree += 1 * this.vx;
        }
     }
     Ball.prototype.hit = function(){
        this.vy = this.vyAdjust;
     }
     Ball.prototype.rotate = function(){
        ctx.translate(this.x +this.width /2, this.y+ this.height/2);
        ctx.rotate(Math.PI / 180 * this.degree);
        ctx.translate(-this.x-this.width /2, - this.y - this.height/2);
        
     }
     Ball.prototype.move = function(){
        this.y +=this.vy;
        this.vy += this.gravity;

        if(this.vx>0){
            this.x+=this.vx;
        }

        if((this.y+this.height) > can.height){
            this.hit();
            this.vyAdjust=(this.vyAdjust * this.factor);
            this.vx = this.vx - this.vxAdjust;
        }
        if(this.vx<-0.1){
            this.end = true;
        }

     }

     function loop(){
        upDate();

        if(!ball.end){
         RequestAnimattFrame(loop);
        }
       
     }

     function upDate(){
       ctx&&ctx.clearRect(0, 0, can.width, can.height);
        ball.move();
        ball.draw();
     }

     function loadBall(){
         ball = new Ball(images,{
            width:100,
            height:100,
            left:0,
            top:0
        })
        loop();
     }

    function init(){
        can = document.getElementById("can")
        ctx = can.getContext("2d");
        images = new Image();
        images.onload = loadBall;
        images.src = "pic.png";
    }

    var footboot = {

        play:function(){
            init();
        }
    }
    return footboot;

})();
