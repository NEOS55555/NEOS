// JavaScript Document
var $Q =function(args){
	return new Base(args);
};
function Base(args){
	this.elements=[];
	this.oo=function(fn){fn()};
	if(typeof args=='string'){
	//css模拟
		if(args.indexOf(' ')!=-1){
			var elements=args.split(' ');	//args以空格(原文中的空格)的形式分开成数组
			var childElements=[]; 			//存放临时节点对象的数组,解决被覆盖的问题
			var node=[];		//用来存放父节点
			for(var i=0;i<elements.length;i++){
				if(node.length==0) node.push(document);	//如果默认没有父节点酒吧document放入
				switch(elements[i].charAt(0)){
					case '#':
						childElements=[];		//清理掉临时节点，以便父节点失效，子节点有效
						childElements.push(this.getId(elements[i].substring(1)));
						node=childElements;		//保存父节点，因为childElements要清理
						break;
					case '.':
						childElements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getClass(elements[i].substring(1),node[j]);
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k]);	
							}
						}
						node=childElements;
						break;
					default:
						childElements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getTagName(elements[i],node[j]);
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k]);	
							}
						}
						node=childElements;
				}	
			}
			this.elements=childElements;
		}else{//find模拟
			switch(args.charAt(0)){
				case '#':
					this.elements.push(this.getId(args.substring(1)));
					break;
				case '.':
					this.elements=this.getClass(args.substring(1));
					break;
				default:
					this.elements=this.getTagName(args);	
			}
		}
	}else if(typeof args == 'object'){
		if(args!=undefined){
			this.elements[0]=args;
		}
	}else if(typeof args == 'function'){
		addDomLoaded(args);		
	}
};
Base.prototype.getTagName=function(tag,parentNode){
	var node=null;
	var temps=[];
	if(parentNode!=undefined){
		node=parentNode;	
	}else{
		node=document;
	}
	var tags=node.getElementsByTagName(tag);
	for(var i=0;i<tags.length;i++){
		temps.push(tags[i]);
	}
	return temps;
};

Base.prototype.getId=function(id){
	return document.getElementById(id);
};	

Base.prototype.getClass=function(className,parentNode){
	var node=null;
	var temps=[];
	if(parentNode!=undefined){
		node=parentNode;	
	}else{
		node=document;
	}
	var allNodes = node.getElementsByTagName('*');
	for(var i=0;i<allNodes.length;i++){
		if((allNodes[i].className).indexOf(className)!=-1){
			temps.push(allNodes[i]);	
		}
	}
	return temps;
};	
//跨浏览器获取style
function getStyle(element,attr){
	if(typeof window.getComputedStyle !='undefined'){//W3C得到计算后的样式
		return window.getComputedStyle(element,null)[attr];	
	}else if(typeof element.currentStyle !='undefined'){//IE
		return element.currentStyle[attr];
	}
}
Base.prototype.css=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){		//获取css样式
			return getStyle(this.elements[i],attr);
		}
		this.elements[i].style[attr]=value;	//设置css样式
	}
	return this;
}
//获取某一个节点，并返回这个节点对象
Base.prototype.getElement=function(num){
	return this.elements[num];
}
//获取某一个节点，并返回Base对象
Base.prototype.eq=function(num){
	if(typeof num=='undefined') num=0;
	var element=this.elments[num];
	this.elements=[];
	this.elements[0]=element;
	return this;
}

//点击事件
Base.prototype.click=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'click',fn);	
	}
}

//阻止默认行为
function preDef(e){
	var e=getEvent(e);;
	if(typeof e.preventDefault !='undefined'){
		e.preventDefault;	
	}else{
		e.returnValue=false;	
	}
}

function getEvent(e){
	return e || window.event;
}

//得到浏览器的宽高度
function getBrowserinner(){
	//得到页面高度
	var height = (document.documentElement.scrollHeight >document.documentElement.clientHeight) ? document.documentElement.scrollHeight : document.documentElement.clientHeight; 
	//得到页面宽度 
	var width=(document.documentElement.scrollWidth>document.documentElement.clientWidth) ? document.documentElement.scrollWidth : document.documentElement.scrollWidth; 
	var count={
		width:width,
		height:height
	}
	return count;
}

//可视大小
function getVisualinner(){
	var height=document.documentElement.clientHeight || document.body.clientHeight;
	var width=document.documentElement.clientWidth || document.body.clientWidth;
	var count={
		width:width,
		height:height
	}
	return count;
}

//跨浏览器事件绑定
function addEvent(obj,type,fn){
	if(typeof obj.addEventListener!='undefined'){
		obj.addEventListener(type,fn,false);	//w3c
	}else{
		//创建一个存放事件的哈希表
		if(!obj.events) obj.events={};		//不存在才创建
		//第一次执行时执行
		if(!obj.events[type]){
			//创建一个存放事件处理函数的数组
			obj.events[type]=[];
		}else{
			//屏蔽同一个注册函数,不添加到计数器中
			//alert('fn');
			if(addEvent.equal(obj.events[type],fn)) return false;
		}
		//从第二次开始用事件计数器来存储
		obj.events[type][addEvent.ID++]=fn;
		//执行事件处理函数
		obj['on'+type]=addEvent.exec;
	}
}
//为每个事件非配一个计数器
addEvent.ID=0;
//执行事件处理函数
addEvent.exec=function(event){
	var e=event || addEvent.fixEvent(window.event);
	var es=this.events[e.type];
	for(var i in es){
		es[i].call(this,e);
	}	
};
//屏蔽同一个注册函数
addEvent.equal=function(es,fn){
	for(var i in es){
		if(es[i]==fn) return true;
	}
	return false;
}
//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent=function(event){
	event.preventDefault=addEvent.fixEvent.preventDefault;
	event.stopPropagation=addEvent.fixEvent.stopPropagation;
	event.target=event.srcElement;
	return event;
}
//阻止IE默认行为
addEvent.fixEvent.preventDefault=function(){
	this.returnValue=false;
}
//IE取消冒泡
addEvent.fixEvent.stopPropagation=function(){
	this.cancelBubble=true;
}
//跨浏览器删除事件
function removeEvent(obj,type,fn){
	if(typeof obj.removeEventListener !='undefined'){
		obj.removeEventListener(type,fn,false);
	}else{
		if(obj.evnets){
			for(var i in obj.events[type]){
				if(obj.events[type][i]==fn){
					delete obj.events[type][i];
				}
			}
		}
	}
}
//插件
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
}
//删除前后所有空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}
//DOM加载
function addDomLoaded(fn){
	var isReady=false;
	var timer=null;
	function doReady(){
		if(timer) clearInterval(timer);
		if(isReady) return;
		isReady=true;
		fn();
	}
	if((sys.opera && sys.opera<9) || (sys.firfox && sys.firfox<3) || (sys.webkit && sys.wekit<525)){
		timer=setInterval(function(){
			if(document && document.getElementById && document.getElementsByTagName && document.body){
				doReady();	
			}
		},1);	
	}else if(document.addEventListener){//w3c
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		});
	}else if(sys.ie && sys.ie<9){
		timer=setInterval(function(){
			try{
				document.documentElement.doScroll('left');
				doReady();
			}catch(e){}
		},1);
	}
}
//得到随机不重复的数组
function getRand(r_first,r_last){
	var original=getIntervalArr(r_first,r_last),newOrig=[];
	var count=getIntervalArr(r_first,r_last).length;
	for (var num=0,i=0;i<count;i++){ 
		do{ 
			num=Math.floor(Math.random()*count); 
		}while(original[num]==null); 
		newOrig.push(original[num]);
		original[num]=null; 		
	}
	return newOrig;
}
//得到一个区间的数组
function getIntervalArr(r_first,r_last){
	var flag=0;
	if(r_first>r_last){
		flag=r_first;
		r_first=r_last;
		r_last=flag;
	}
	var count=r_last-r_first+1;
	var original=[];
	for (var i=r_first;i<count+r_first;i++){ 
		original[i-r_first]=i; 
	}
	return original;
}
//区间内是否有重复的该数
Number.prototype.is_repeat=function(first,last){	
	var arr=getIntervalArr(first,last);
	for(var i=0,arrlen=arr.length;i<arrlen;i++){
		if(arr[i]==this){
			return true;
		}
	}
	return false;
}

