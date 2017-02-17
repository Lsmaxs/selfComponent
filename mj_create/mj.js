!(function(window){
/* 
* @Author: Marte
* @Date:   2016-10-16 15:44:34
* @Last Modified by:   Marte
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
    JQ.prototype,init = function(select,context){
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
            if(JQ.isWindow(arr)||JQ.isFunction(arr)) false;
            return typeof arr === 'object' && arr.length > 0 &&"length"in arr
        },
        isHtml:function(html){
            var h = JQ.trim(html);
            return  h.charAt(0) === "<" && h.charAt(h.length-1) === ">" && h.length> 3;
        }
    })

    JQ.extend({
        each:function(func){
            var i = 0,
                length = this.length;
            for(var i = 0;i<length;i++){
                func.call(this[i],this[i],i);
            }
            return this;
        },
        trim:function(str){
            if(!str) return "";
            return str.replace(/^\s+|\s+$/g,'');
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
        }
    });

    window.$ = window.JQ = JQ;
})(window);