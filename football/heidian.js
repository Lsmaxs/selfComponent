/* 
* @Author: Marte
* @Date:   2017-01-03 11:09:49
* @Last Modified by:   Marte
* @Last Modified time: 2017-01-03 11:48:29
*/

window.onload = function(){
    var menu = {
        init:function(){
            this.touch();
        },
        touch:function(){
            var self = this;
            var spacing = 10px;
            var Elem = document.querySelector('box'); 
            var startX,startY,endX,endY,
            wW = window.outerWidth;
            wH = window.outerHeight;
            splitLineX = wW/2;
            Elem.addEventListener('touchstar', function(ev){
                rightStart = self.getStyle(this,'right');
                bottomStart = self.getStyle(this,'bottom');
                startX = ev.changedTouches[0].clinetX;
                startY = ev.changedTouches[0].clientY;
            }, !1);
            Elem.addEventListener('touchmove',function(ev){
                moveX = ev.changedTouches[0].clientX;
                moveY = ev.changedTouches[0].clinetY;
                endPost = {
                    x:moveX-startX,
                    y:moveY-startY
                };
                rightStart = rightStart != ''? parseInt(rightStart):0;
                bottomStart = bottomStart != ''? parseInt(bottomStart):0;
                this.style.right = rightStart-endPost.x;
                this.style.right = bottomStart - endPost.y;

            },!1);
            Elem.addEventListener('touchend',function(ev){
                endX = ev.changedTouches[0].clientX;
                endY = ev.changedTouches[0].clientY;
                if(endX>=splitLineX){
                    this.style.right = spacing + 'px';
                }else{
                    this.style.right = (self.wW-50-spacing) + 'px'
                }

                if(endY>(self.wH-50-spacing)){
                    this.style.bottom = spacing + 'px';
                }else{
                    this.style.bottom = (self.wH-50-spacing) + 'px'
                }
            },!1)

             
            getStyle:function(obj,prop){
                var redio;
                if(obj.currentStyle[prop]){
                    return obj.currentStyle[prop];
                }else if(window.getComputedStyle){
                    prop.replace(/([A-Z])/g,'-$1');
                    prop.toLowerCase();

                    var result = document.defaultView.getComputedStyle(obj,null)[prop];
                    if(result.indexof('%')>-1){
                        result = parseInt(result)/100;
                        if(prop=='bottom'){
                            redio = wH
                        }else{
                            redio = wW
                        }
                        result = parseInt(result*redio);
                    }
                    return result 
                }
            }
        }
        
    }
    menu.init();

}