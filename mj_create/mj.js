;(function(global,factory) {
    "use strict";
   if(typeof define === 'function'&&define.amd){
       define.factory(global);
   }else if(typeof exports === 'object'){
        module.exports = factory(global);
    }else {
       global.$ = global.JQ = factory(global);
   }
})( typeof window !== "undefined" ? window:this ,function (window) {
    /*
     * @Author: Lsmax
     * @Date:   2016-10-16 15:44:34
     * @Last Modified by:   Lsmax
     * @Last Modified time: 2017-02-13 21:10:59
     */
    // 将一些全局对象，传到框架中的局部变量中。
    // 好处：提高访问性能。
    var isArray = [],
        push = isArray.push,
        document = window.document;

    // 核心函数
    function JQ(select,context){
        return new JQ.prototype.init(select,context);
    }
    //简写方式
    JQ.fn = JQ.prototype;
    JQ.prototype.init = function(select,context){
        if(select.nodeType===1){
            this[0]=select;
            this.length=1;
            return this;
        }
        var parent = context || document;
        var nodeList = parent.querySelectorAll(select);
        this.length = nodeList.length;
        for(var i=0;i<this.length;i++){
            this[i]=nodeList[i];
        }
        return this;
    }
    // 核心原型
    JQ.fn.init.prototype = JQ.fn;
    // 可扩展方法
    JQ.extend = JQ.fn.extend = function(destination,source){
        //无扩展返回默认
        if(typeof source === 'undefined'){
            source = destination;
            destination = this;
        }
        //拷贝
        for(var property in source){
            if(source.hasOwnProperty(property)){
                destination[property] = source[property];
            }
        }
        return destination;
    }
    // 扩展类型判断方法
    // 所有方法的返回值应为布尔值
    JQ.extend({
        isNull:function(obj){
            return !obj;
        },
        isString:function(str){
            return typeof str === 'string';
        },
        isFunction:function(fun){
            return typeof fun === 'function'
        },
        ismyJQ:function(select){
            return  select === 'object' && "selector" in JQ
        },
        isDOM:function(dom){
            return !!(dom.nodeType);
        },
        isWindow:function(win){
            return typeof win === "object" && "window" in win && win.window === window; 
        },
        isArrayLike:function(arr){
            if(JQ.isWindow(arr)||JQ.isFunction(arr)) return false;
            return typeof arr === 'object' && arr.length > 0 &&"length"in arr
        },
        isHtml:function(html){
            var h = JQ.trim(html);
            return  h.charAt(0) === "<" && h.charAt(h.length-1) === ">" && h.length> 3;
        },
        isUndefined:function (obj) {
            return obj === undefined ;
        },
        isEmpty:function(obj){
            return obj == null || obj == undefined || obj + '' + "";
        },
        isEmptyObject:function (obj) {
            var key;
            for(key in obj) return false;
            return true;
        }
    })

    // 扩展工具方法
    JQ.extend({
        each:function(func){
            var length = this.length;
            for(var i = 0;i<length;i++){
                //将each的回调环境指向到具体的节点内，this即节点
                func.call(this[i],this[i],i);
            }
            return this;
        },
        trim:function(str){
            if(!str) return "";
            return str.replace(/^\s+|\s+$/g,'');
        }
    })
    //dom 操作模块
    JQ.extend({
        firstChild:function (dom) {
            var nodeDom;
            JQ.each(dom.childNodes,function(i,e){
               if( this.nodeType ===1 ){
                   nodeDom = this;
                   return false;
               }

            })
            return nodeDom;
        },
        nextSibling:function (dom) {
            var newDom = dom;
            while (newDom = newDom.nextSibling){
                if( newDom.nodeType ===1){
                    return newDom;
                }
            }
        },
        nextAll:function (dom) {
            var newDom = dom ,arr = [];
            while (newDom = newDom.nextSibling){
                if(newDom.nodeType===1){
                    arr.push(newDom)
                }
            }
            return arr;
        },
        append:function(child){
            if(JQ.isString(child)){
                child = JQ(child)[0];
            }
            this.each(function(v,k){
                v.appendChild(child);
            })
            child = null;
            return this;
        },
        remove:function () {
            return JQ.each(this,function(){
                if(this.parentNode !== null){
                    //取绑事件，释放内存
                    JQ(this).off();
                    this.parentNode.removeChild(this);
                }
            })
        }
    })

    // 事件模块
    JQ.fn.extend({
        on:function(type,callback){
            this.each(function(){
                if(this.addEventListener){
                    this.addEventListener(type,callback);
                } else{
                    this.attachEvent('on'+type,callback);
                }
            })
            return this;
        },
        off:function(type,callback){
            this.each(function(){
                this.removeEventListener(type,callback);
            });
            return this;
        }

    })
    //属性操作模块
    JQ.fn.extend({
        width:function(dom){
            if(dom[0]== window){
                return document.documentElement.clientWidth;
            }else{
                return dom.getComputedStyle(this[0],null).width;
            }
        },
        height:function(dom){
            if(dom[0]==window){
                return document.documentElement.clientHeight;
            }else{
                return dom.getComputedStyle(this[0].null).height;
            }
        },
        find:function(selector){
            return JQ(this[0].querySelector(selector));
        }
    })
    // css 操作模块
    JQ.fn.extend({
        css:function(cssRules,value){
            var transformHump = function(name){
                return name.replace(/\-(\w)/g,function(all,letter){
                    return letter.toUpperCase();
                })
            };
            if(JQ.isString(cssRules)){
                if(JQ.isUndefined(value)){
                    return document.defaultView.getComputedStyle(this[0],null).getPropertyValue(value);
                }else{
                    this.each(function(v,k){
                        v.style[transformHump(cssRules)]=value;
                    })
                }
            }else{
                for(var i in cssRules){
                    this.each(function(v,k){
                        v.style[transformHump(i)] = cssRules[i]
                    })
                }
            }
            return this;
        },
        hasClass:function(cName){
            this.each(this[0].className.split(''),function(v,k){
                if(k===cName){
                    return true
                }
            })
            return false;
        },
        addClass:function(cName){
           return this.each(function () {
                var className = this.className;
                className += ''+cName;
                this.className = JQ.trim(className);
            })
        },
        removeClass:function(cName){
            return this.each(function () {
                this.className = JQ.trim(''+this.className+"").replace(""+cName+"",'');
            })

        }
    })

    // 其他事件模块
    JQ.fn.extend({
        ready:function(callback){
            /complete|loaded|interactive/.test(document.readyState)&&document.body? callback(JQ):
                document.addEventListener("DOMContentLoaded",function(){
                   callback(JQ);
                },false);
            return this;
        }
    })

    return window.$ = window.JQ = JQ;
})