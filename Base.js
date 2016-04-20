// JavaScript Document
var $Q =function(args){
	return new Base(args);
};
function Base(args){
	this.elements=[];
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
			this.elements[0]=args;	//_this是一个对象，undefined也是一个对象,却别与typeof返回的带单引号的
		}
	}else if(typeof args == 'function'){
		addDomLoaded(args);		
	}
};
Base.prototype={
	length: 0
}
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
};
//添加css
Base.prototype.addClass=function(className){
	for(var i=0;i<this.elements.length;i++){
		
	}
	return this;
}
//设置css样式
Base.prototype.css=function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){		//获取css样式
			return getStyle(this.elements[i],attr);
		}
		this.elements[i].style[attr]=value;	//设置css样式
	}
	return this;
};
//获取某一个节点，并返回这个节点对象
Base.prototype.get=function(num){
	return this.elements[num];
};
Base.prototype.first=function(){
	return this.elements[0];
};
//获取某一个节点，并返回Base对象
Base.prototype.eq=function(num){
	if(typeof num=='undefined') num=0;
	var element=this.elements[num];
	this.elements=[];
	this.elements[0]=element;
	return this;
};
Base.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display="none";
	}
}
Base.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display="block";
	}
}
//获取当前节点的下一个节点
Base.prototype.next=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i].nextSibling;
		if(this.elements[i]==null) throw new Error('找不到下一个节点');	
		if(this.elements[i].nodeType == 3) this.next();
	}
	return this;	
};
//获取当前节点上下一个节点
Base.prototype.prev=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i].prevSibling;
		if(this.elements[i]==null) throw new Error('找不到上一个节点');	
		if(this.elements[i].nodeType == 3) this.next();
	}
	return this;	
};
//设置html
Base.prototype.html=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].innerHTML	
		}
		this.elements[i].innerHTML=str;
	}
	return this;
};
//设置表单字段元素
Base.prototype.form = function(name){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i]=this.elements[i][name];
	}	
	return this;
}
//设置表单字段内容获取
Base.prototype.value=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].value	
		}
		this.elements[i].value=str;
	}
	return this;
};
//设置事件发生器
Base.prototype.bind=function(event,fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],event,fn);
	}
	return this;
};
//点击事件
Base.prototype.click=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'click',fn);	
	}
};
//hover事件
Base.prototype.hover=function(fn1,fn2){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',fn1);
		addEvent(this.elements[i],'mouseout',fn2);
	}
	return this;
};

//设置点击切换方法
Base.prototype.toggle=function(){
	for(var i=0;i<this.elements.length;i++){
		(function (element,args){
			var count=0;
			addEvent(element,'click',function(){
				args[count++ % args.length].call(this);
				//count++;	
				//if(count>=args.length) count=0;
			});	
		})(this.elements[i],arguments);
	}
	//arguments[0]();
	return this;
};

//阻止默认行为
function preDef(e){
	var e=getEvent(e);;
	if(typeof e.preventDefault !='undefined'){
		e.preventDefault;	
	}else{
		e.returnValue=false;	
	}
};

function getEvent(e){
	return e || window.event;
};

function getKeyCode(e){
	var e=getEvent(e);
	var key=e.which || e.keyCode || e.charCode;
	var count={
		//得到的是键的code
		keyCode:key,
		//得到的是键
		key:String.fromCharCode(key)
	};
	return count;
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
//滚动条距离
function getScroll(){
	return {
		top : document.documentElement.scrollTop || document.body.scrollTop,
		left : document.documentElement.scrollLeft || document.body.scrollLeft
	};
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


//设置动画
Base.prototype.animate=function(obj){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];	//若不这样写，setinterval里面的this.elements[i]就会不认识
		var attr=obj['attr'] =='x'? 'left': obj['attr']=='y'?'top':obj['attr'] == 'w' ?  'width': obj['attr'] == 'h' ? 'height': obj['attr'] == 'o'? 'opacity': obj['attr'] !=undefined ? obj['attr']: 'left';		//默认传参
		var start=obj['start'] != undefined ? obj['start']: attr== 'opacity' ? parseFloat(getStyle(element,attr))*100: parseInt(getStyle(element,attr));
		var t=obj['t'] != undefined ? obj['t'] : 30;	//默认50ms执行一次
		var step = obj['step'] != undefined ? obj['step']:20;	//每次运行10像素
		var alter = obj['alter'];
		var target = obj['target'];
		
		var mul = obj['mul'];
		
		var speed = obj['speed']!=undefined ? obj['speed']:6;	//可选，默认缓冲速度
		var type = obj['type'] == 0 ? 'constant': obj['type'] == 1? 'buffer': 'buffer';	//0为匀速，1为缓冲，默认缓冲

		if(alter != undefined && target == undefined){
			target = alter+start;
		}else if(alter == undefined && target == undefined && mul == undefined){
			throw new Error('请输入一个target或alter')
		}
		
		if(start>target) step=-step;
		
		if(attr == 'opacity'){		//初始地点
			element.style.opacity = parseInt(start)/100;
			element.style.filter = 'alpha(opaicty='+parseInt(start)+')';
		}else{
			//element.style[attr]=start+'px';
		}
		
		if(mul == undefined){
			mul={};
			mul[attr]=target;	
		}
		
		clearInterval(element.timer);		//防止常见多个定时器
		element.timer=setInterval(function(){
			var flag=true;
			
			for(var i in mul){
				attr = i == 'x'?'left':i == 'y'?'top': i=='w'?'width': i == 'h'?'height': i == 'o'?'opacity':i != undefined ? i: 'left';
				target = mul[i];	
				
				var objAttr=parseInt(getStyle(element,attr));
			
				if(type == 'buffer'){				//缓冲
					step= attr == 'opacity'? (target-parseFloat(getStyle(element,attr))*100)/speed:
											(target-objAttr)/speed;	
					step = step > 0? Math.ceil(step):Math.floor(step);
				}
				if(attr == 'opacity'){
					if(step==0){
						setOpacity();
					}else if(step>0 && Math.abs(parseFloat(getStyle(element,attr))*100-target)<=step){	//正,在到达303之前直接到300					
						setOpacity();
					}else if(step<0 && (parseFloat(getStyle(element,attr))*100-target)<=Math.abs(step)){	//负
						setOpacity();
					}else{//放在else永远不会和停止运动同时执行，就不会出现303而减到300的问题
						var temp=parseFloat(getStyle(element,attr))*100;
						element.style.opacity=(temp+step)/100;
						element.style.filter = 'alpha(opaicty='+parseInt(temp+step)+')';	
					}
					if(parseInt(target) !=parseInt(parseFloat(getStyle(element,attr))*100)) flag=false;		
				}else{
					if(step==0){
						setTarget();
					}else if(step>0 && Math.abs(objAttr-target)<=step){	//正
						setTarget();
					}else if(step<0 && (objAttr-target)<=Math.abs(step)){	//负
						setTarget();
					}else{//放在else永远不会和停止运动同时执行，就不会出现303而减到300的问题
						//但是会出现不同时剪到300而导致突兀
						element.style[attr]=objAttr+step+'px';	
					}
					if(parseInt(target) != parseInt(getStyle(element,attr))) flag=false;	
				}
				//document.getElementById('aaa').innerHTML+=parseFloat(getStyle(element,attr))+'step:'+step+'--'+flag+'<br>'
			}
			if (flag){
				clearInterval(element.timer);
				if(obj.fn!=undefined) obj.fn();
			}
		},t);	
		function setTarget(){
			element.style[attr]=target+'px';
			
		}
		function setOpacity(){
			element.style.opacity=parseInt(target)/100;
			element.style.filter = 'alpha(opaicty='+parseInt(target)+')';
		}
	}
	return this;
}

//插件
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
}
//删除前后所有空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}
//浏览器检测
(function(){
	window.sys={};		//让外部可以访问，保存浏览器信息对象
	var ua=navigator.userAgent.toLowerCase();//获取浏览器信息字符串
	var s;				//浏览器信息数组，浏览器名称+版本
	(s=ua.match(/msie ([\d.]+)/)) ? sys.ie=s[1]:
	(s=ua.match(/firefox\/([\d.]+)/)) ? sys.firefox=s[1]:
	(s=ua.match(/chrome\/([\d.]+)/)) ? sys.chrome=s[1]:
	(s=ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera=s[1]:
	(s=ua.match(/version\/([\d.]+).*safari/)) ? sys.safari=s[1]:0;
	
	if(/webkit/.test(ua)) sys.webkit=ua.match(/webkit\/([\d.]+)/)[1];
})();
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
//AJAX
function createXHR(){
	if(typeof XMLHttpRequest != 'undefined'){
		return new XMLHttpRequest;
	}else if(typeof ActiveXObject !='undefined'){
		var version=[
			'MSXML2.XMLHttp.6.0',
			'MSXML2.XMLHttp.3.0',
			'MSXML2.XMLHttp'
		];
		for(var i=0;version.length;i++){
			try{
				return new ActiveXObject(version[i]);	
			}catch(e){	
				//如果第一个不存在就会报错 所以这里直接跳过
			}
		}
	}else{
		throw new Error('错误');	
	}
}

function doPost(url,data,fn){
var postData =data;
postData = (function(obj){ // 转成post需要的字符串.
    var str = "";
    for(var prop in obj){
        str += prop + "=" + obj[prop] + "&"
    }
    return str;
})(postData);
var xhr = new createXHR();
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
if(fn!=undefined){
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var text = xhr.responseText;
				fn(text);
			}else{
				fn('error');	
			}
		}
	};
}
xhr.send(postData);	
}
//得到随机不重复的数组
function getRand(r_first,r_last){
	var original=getIntervalArr(r_first,r_last),newOrig=[];
	var count=original.length;
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
function is_repeat(number,first,last){	
	var arr=getIntervalArr(first,last);
	for(var i=0,arrlen=arr.length;i<arrlen;i++){
		if(arr[i]==number){
			return true;
		}
	}
	return false;
}
