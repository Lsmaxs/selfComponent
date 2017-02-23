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
        document = window.document,
        arrFn = Array.prototype;

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
        creatDom:function(str){
            var container = document.createElement('div');
            container.innerHTML = str;
            var node = container.childNodes;
            container = null;
            return node;
        },
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
        },
        before:function(node){
            this.addDom(node,function(newNode){
                this.parentNode.insertBefore(newNode,this);
            })
            return this;
        },
        after:function(node){
            this.addDom(node,function(newNode){
                var next = this.nextElementSibling;
                next ? this.parentNode.insertBefore(newNode,next):this.parentNode.appendChild(newNode);
            })
            return this
        },
        prev:function(){
            if(!JQ.isEmptyObject(this[0])){
                var previous = this[0].previousElementSibling;
                previous ? arrFn.slice.call(this,0,this.length,previous):arrFn.splice.call(this,0,this.length);
            }
            return this;
        },
        next:function(){
            if(!JQ.isEmptyObject(this[0])){
                var next = this[0].nextElementSibling;
                next ? arrFn.slice.call(this,0,this.length,next):arrFn.slice.call(this,0,this.length);
            }
            return this;
        },
        slice:function(){
            return JQ(arrFn.slice.apply(this,arguments))
        }
    })

    JQ.each(('click,mouseover,mouseout,mouseenter,mouseleave,mousemove,mousedown,keydown,keyup'+
    'touchstart,touchmove,touchend').split(','),function(v,k){
        JQ.fn[v] = function(callback){
            return this.on(v,callback);
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
        },
        getInnerText:function(dom){
            var list = [];
            if(dom.innerText !== 'undefined'){
                return dom.innerText;
            }else{
                return getNodeText(dom,list).join('');
            }
            function getNodeText(dom,arr) {
                var length = dom.childNodes.length,node;
                for(var i = 0;i<length;i++){
                    node = dom.childNodes[i];
                    if(node.nodeType ===3 ){
                        arr.push(node.nodeValue);
                        node = null;
                    }
                }
                return arr;
            }
        },
        setInnerText:function(dom,str){
            if('innerText' in dom){
                dom.innerText = str;
            }else{
                dom.innerHTML = '';
                dom.appendChild(document.createTextNode(str));
            }
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

        },
        attr:function(attName,attVal){
            if(arguments.length==1){
                return this[0][attName];
            }else{
                return this.each(function(){
                    this[attName] = attVal;
                })
            }
        },
        val:function(val){
            if(val!== 'undefined'){
                return this[0].value;
            }else{
                return this.each(function(){
                    this.value = val;
                })
            }
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
        },
        addDom:function (node, callback) {
            if(typeof node == "string"){
                node = this.creatDom(node)[0];
            }else if(node.length ==1){
                node = node[0];
            }
            if(typeof node == 'object'&&!node.length){
                JQ.each(this,function(){
                    callback.call(this,node);
                })
            }
        }
    })

    return window.$ = window.JQ = JQ;
})