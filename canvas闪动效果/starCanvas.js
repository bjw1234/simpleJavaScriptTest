/**
 * 如果说将这个效果封装成插件：
 *
 * new starCanvas({
 * 		canvas: $('canvas'),
 * 		imgUrl: 'xx/xx.jpg',
 * 		starNum: 60, // 画面上星星的数量
 * 		speed: 0.5, // 星星的移动速度
 * 		flickerFreq: 80, // 闪烁频率
 * }); 
 */

;(function(window,document){

	var starAlpha = 0; // 星星的透明度初始值
	var last = Date.now(); // 开始时间
	var delta = 0; // 画布刷新的时间
	var starArr = []; // 星星数组
	var enter = false; // 判断鼠标是否位于canvas之上
	var _this = window; // 默认值

	function starCanvas(config){
		_this = this;
		this.canvas = config.canvas;
		this.ctx = canvas.getContext('2d');
		this.canW = this.canvas.width;
		this.canH = this.canvas.height;
		this.starNum = config.starNum || 60;
		this.starImage = new Image();
		this.starImage.src = './src/star.png';
		this.backImage = new Image();
		this.backImage.src = config.imgUrl;	

		// 将一些共有属性添加到Star类上
		Star.prototype.ctx = this.ctx;
		Star.prototype.canW = this.canW;
		Star.prototype.canH = this.canH;
		Star.prototype.starImage = this.starImage;
		// 星星的移动速度
		Star.prototype.speed = config.speed || 0.5;
		Star.prototype.flickerFreq = config.flickerFreq || 80;

		// 添加星星对象
		for(var i = 0;i < this.starNum;i++){
			starArr.push(new Star());
		}

		// 添加鼠标事件
		document.addEventListener('mousemove',function(e){
			var x = e.offsetX;
			var y = e.offsetY;
			// 在这张图片中
			if(x > 0 && y > 0 && x < _this.canW && y < _this.canH){
				enter = true;
			}else{
				enter = false;
			}
		});

		// 开始绘制循环
		this.drawLoop();
	}
	
	starCanvas.prototype.drawLoop = function(){
		var now = Date.now();
		delta = now - last;
		last = now;		

		// 注意这里this指向的问题	
		// debugger;
		
		_this.drawBackImage();
		_this.drawStars();	
		_this.updateStarAlpha();
		window.requestAnimationFrame(_this.drawLoop);
	}

	// 绘制图片
	starCanvas.prototype.drawBackImage = function(){
		this.ctx.drawImage(this.backImage,0,0,this.canW,this.canH);		
	}

	// 绘制星星
	starCanvas.prototype.drawStars = function(){								
		for(var i = 0; i < starArr.length; i++){
			// 星星边界判断
			var x = starArr[i].x;
			var y = starArr[i].y;

			// 超出边界
			if(x < 0 || y < 0 || x > this.canW || y > this.canH){
				starArr.splice(i,1,new Star());
			}
			starArr[i].update();		
			starArr[i].drawSelf();		
		}
	}

	// 更新星星的透明度
	starCanvas.prototype.updateStarAlpha = function(){
		if(enter){
			starAlpha += 0.03 * delta * 0.02;
			if(starAlpha >= 1){
				starAlpha = 1;
			}
		}else{
			starAlpha -= 0.03 * delta * 0.02;
			if(starAlpha <= 0){
				starAlpha = 0;
			}
		}
	}

	/**
	 * [Star description]
	 * 星星类
	 */
	function Star(){		
		this.x = Math.random()*this.canW;
		this.y = Math.random()*this.canH;
		this.picNo = Math.floor(Math.random()*7);	
		this.timeOut = 0; // 时间间隔	
		this.xSpeed = (Math.random() - 0.5)*this.speed;
		this.ySpeed = (Math.random() - 0.5)*this.speed;		
	}

	Star.prototype.drawSelf = function(){
		this.ctx.save();
		this.ctx.globalAlpha = starAlpha;
		// drawImage方法可以实现序列帧动画
		this.ctx.drawImage(this.starImage,this.picNo*7,0,7,7,this.x,this.y,7,7);
		this.ctx.restore();
	}

	Star.prototype.update = function(){

		// 累加时间
		this.timeOut += delta;

		// 对星星的位置更新
		this.x += this.xSpeed * delta * 0.03;
		this.y += this.ySpeed * delta * 0.03;

		if(this.timeOut > this.flickerFreq){
			this.picNo ++;
			this.picNo %= 7;				
			this.timeOut = 0;
		}
	}


	// 暴露接口
	window.starCanvas = starCanvas;

})(window,document);