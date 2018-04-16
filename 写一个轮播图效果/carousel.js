 /**
	 使用方式
	 new Carousel({	 
		 oWrapper: 父容器节点对象,
		 timeOut: 2000, 延时切换时间
		 figureW: 轮播图宽度,
		 figureH: 轮播图高度,
		 figures: [ 轮播图片集合，
			 '../img/xx.jpg',
			 '../img/xx.jpg',
			 ....
		 ]		
	});
  */
 

var initCss='#view-carousel{'+
			'position: relative;'+			
		'}'+

		'#view-carousel ul li{'+
		'	position: absolute;'+
		'	left: 0;'+
		'	top: 0;'+
		'	transition: all .9s;'+
		'}'+

		'#view-carousel .points {'+
		'	width: 100%;'+
		'	height: 12px;'+
		'	text-align: center;'+
		'	bottom: 15px;			'+
		'}'+

		'#view-carousel .points em {'+
		'	display: inline-block;'+
		'	width: 12px;'+
		'	height: 12px;'+
		'	border:1px solid #fff;'+
		'	background: transparent;'+
		'	border-radius: 50%;'+
		'	margin:0 5px;'+
		'	cursor: pointer;'+
		'	user-select:none;'+
		'}'+

		'#view-carousel .points em:first-child{'+
		'	background: orange;'+
		'}'+

		'#view-carousel .btns {'+
		'	position: absolute;'+
		'	width: 40px;'+
		'	font-size: 30px;'+
		'	top:0;'+
		'	bottom: 0;'+
		'	background-color: rgba(204,204,204,.5);'+
		'	color: #fff;'+
		'	z-index: 3;'+
		'	margin: auto;'+
		'	cursor: pointer;'+
		'	text-align: center;'+
		'	user-select:none;'+
		'	opacity: 0;'+
		'}'+

		'#view-carousel:hover .btns {'+
		'	opacity: 1;'+
		'}'+

		'#view-carousel .leftBtn {'+
		'	left: 0;'+
		'}'+

		'#view-carousel .rightBtn {'+
		'	right: 0;'+
		'}';
 

	// 加入css样式
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = initCss;
	document.getElementsByTagName('head')[0].appendChild(style);

	
	/**
	* 使用闭包避免变量污染
	*/
	!function(window,document){
	
		// 初始化方法
		function Carousel(config){

			this.oWrapper = config.oWrapper;
			this.timeOut = config.timeOut || 2000;
			this.figureW = config.figureW || 300;
			this.figureH = config.figureH || 180;
			this.figures = config.figures;
			this.figureNum = config.figures ? config.figures.length : 5;

			// 内容对象
			this.content = this.createContent();

			// 创建左右切换按钮
			this.oWrapper.appendChild(this.content.leftBtn);
			this.oWrapper.appendChild(this.content.rightBtn);

			// 创建图片wrapeer和btn-wrapper
			this.oWrapper.appendChild(this.content.imgWrapper);
			this.oWrapper.appendChild(this.content.pointsWrapper);

			// 设置每张图片的路径
			if(this.figures) {
				for(var key in this.figures) {
					// debugger;
					this.content.imgWrapper.children[key].firstElementChild.src=this.figures[key];
				}
			}

			// 设置事件
			this.carouselEvent();
		}

		/*
		 *	定义原型方法
		 *	
		 *	创建内容
		 */ 
		Carousel.prototype.createContent = function() {

			// 设置父容器的宽高
			this.oWrapper.style.width = this.figureW + "px";
			this.oWrapper.style.height = this.figureH + "px";

			 var imgFrag = document.createDocumentFragment(),
				 pointsFrag = document.createDocumentFragment(),
				 imgWrapper = document.createElement("ul"),
				 pointsWrapper = document.createElement("div");

			imgWrapper.style.width = this.figureW + "px";
			imgWrapper.style.height = this.figureH + "px";
			
			pointsWrapper.style.position = "absolute";
			pointsWrapper.className ="points";
		   
			for(var i=0;i<this.figureNum;i++) {

				var item = document.createElement("li"),
					img = document.createElement("img"),
					point = document.createElement("em");
				
				img.style.width = '100%';
				img.style.height = '100%';
				item.appendChild(img);
				item.style.width = this.figureW + "px";
				item.style.height = this.figureH + "px";
				item.style.backgroundColor = _randomColor();

				imgFrag.appendChild(item);
				pointsFrag.appendChild(point);
			}
			imgWrapper.appendChild(imgFrag);
			pointsWrapper.appendChild(pointsFrag);


			// 创建左右切换按钮
			 var leftBtn = document.createElement("div"),
				rightBtn = document.createElement("div");
			leftBtn.innerHTML = "<";
			leftBtn.className = "leftBtn btns";
			leftBtn.style.height = this.figureH*.3 + "px";
			leftBtn.style.lineHeight = this.figureH*.3 + "px";
			rightBtn.innerHTML = ">";
			rightBtn.className = "rightBtn btns";
			rightBtn.style.height = this.figureH*.3 + "px";
			rightBtn.style.lineHeight = this.figureH*.3 + "px";
		   
			return {
				leftBtn:leftBtn,
				rightBtn:rightBtn,
				imgWrapper: imgWrapper,
				pointsWrapper: pointsWrapper
			};
		};

		// 随机颜色生成
		function _randomColor() {
			var txt = "#";
			for(var i=0;i<6;i++) {
				txt += Math.floor(Math.random()*16).toString(16);
			}
			return txt;
		}


		/*
		 *	定义原型方法
		 *	
		 *	添加轮播逻辑处理
		 */ 
		Carousel.prototype.carouselEvent = function() {
			var index = 0;
			var timer = null;
			var _this = this;
			// var end = true;

			// 内部方法，执行动画
			function _animate(){

				// 切换图片
				var images = _this.content.imgWrapper.children;
				images = Array.prototype.slice.call(images,0);
				images.forEach(function(item){				
					if(item.style.opacity === '' || item.style.opacity === '1'){
						item.style.opacity = '0';
					}
				});
				// debugger;
				images[index].style.opacity = '1';

				// 切换point
				var points = _this.content.pointsWrapper.children;
				points = Array.prototype.slice.call(points,0);
				points.forEach(function(item){
					item.style.background = 'transparent';
				});
				points[index].style.background = 'orange';			
			}

			// 自动切换
			function _play(){
				timer = window.setInterval(function(){
					index ++;
					if(index > _this.figureNum - 1){
						index = 0;
					}
					//  指定动画
					_animate();
				},_this.timeOut);
			}	

			// 停止切换
			function _stop(){
				if(timer)
					window.clearInterval(timer);
			}


			// point悬浮切换图片
			var points = _this.content.pointsWrapper.children;
			for(var i = 0;i < points.length; i++){
				// 通过闭包设置事件
				!function(i){
					points[i].addEventListener('mouseenter',function(){
						index = i;
						_animate();
					})
				}(i);
			}		


			// 左按钮点击事件
			this.content.leftBtn.addEventListener('click',function(){
				index --;
				if(index < 0){
					index = _this.figureNum - 1;
				}
				//  指定动画
				_animate();
			});

			// 右按钮事件
			this.content.rightBtn.addEventListener('click',function(){
				index ++;
				if(index > _this.figureNum - 1){
					index = 0;
				}
				//  指定动画
				_animate();
			});

			// 绑定函数
			this.oWrapper.onmouseenter = _stop;
			this.oWrapper.onmouseleave = _play;

			_play();
		};

		// 暴露接口
		window.Carousel = Carousel;
		
}(window,document);
