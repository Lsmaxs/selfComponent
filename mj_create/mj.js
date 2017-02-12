!(function(window){
/* 
* @Author: Marte
* @Date:   2016-10-16 15:44:34
* @Last Modified by:   Marte
* @Last Modified time: 2017-02-12 11:06:49
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
        
    });

    window.$ = window.JQ = JQ;
})(window);