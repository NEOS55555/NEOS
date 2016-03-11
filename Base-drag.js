// JavaScript Document
//tags必须是数组，数组内是elements内节点下的节点
$Q().extend('drag',function(tags,type,upFn,moveFn,direction){

	var obj=this.elements;
	if(arguments.length==1){
		if(typeof tags=='string'){
			type=tags;
		}
	}else if(arguments.length==2){
		if(typeof tags=='string' && typeof type=='function'){
			upFn=type;
			type=tags;
		}
	}else if(arguments.length==3){
		if(typeof tags=='string'){
			moveFn=upFn;
			upFn=type;
			type=tags;
		}else{
			moveFn=upFn;
			upFn=type;
		}
	}
	for(var i=0;i<obj.length;i++){
		addEvent(obj[i],'mousedown',function(e){
			e.preventDefault();
			var _this=this;		
			var diffX=e.clientX-_this.offsetLeft,
				diffY=e.clientY-_this.offsetTop;
			_this.style.transition="none";		//防止3d过后transition影响移动
			if(arguments.length==0) _this.style.position="absolute";	//让元素默认变成absolute，否则无法移动
			else _this.style.position=type;
			//自定义拖拽区域
			var flag=true;
			if(tags instanceof Array) flag=false;
			if(typeof tags!='undefined' && tags!=null && typeof tags!='string'){
				for(var i=0;i<tags.length;i++){
					if(e.target==tags[i]){
						flag=true;	//只要有一个是true，就立刻返回
						break;
					}
				}
			}
			if(flag){
				addEvent(document,'mousemove',move);	//鼠标移动时候执行的函数
				addEvent(document,'mouseup',up);	//鼠标放开时候的函数
			}else{
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}
			function move(e){
				e=getEvent(e);
				var vWidth=direction?direction.w:getVisualinner().width;
				var vHeight=direction?direction.h:getVisualinner().height;
				var left=e.clientX-diffX,
					top=e.clientY-diffY;
				if(left<0){ 
					left=0;
				}else if(left>vWidth-_this.offsetWidth){
					left=vWidth-_this.offsetWidth;
				}
				if(top<0){
					top=0;
				}else if(top>=vHeight-_this.offsetHeight){
					top=vHeight-_this.offsetHeight;
				}
				if(direction){
					if(direction.d=='x'){
						_this.style.left=left+'px';
						if(direction.fn)
							direction.fn(left);
					}else{
						_this.style.top=top+'px';
						if(direction.fn)
							direction.fn(top);
					}
				}else{
					_this.style.top=top+'px';
					_this.style.left=left+'px';
				}
				if(typeof moveFn!='undefined' && moveFn!=null) moveFn(e);
			}
			function up(){
				if(typeof upFn!='undefined' && upFn!=null) upFn(e);
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);			
			}
		});
	}	
});