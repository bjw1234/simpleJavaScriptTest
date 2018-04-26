# simpleJavaScriptTest
用JS封装一些简单插件或者实现一些酷炫的动画效果，仅作为个人练习测试使用。

## 写一个轮播图效果
`index.html`
* 思路：
容器宽度为所有图片宽度的总和，图片在容器中向左浮动，水平排列。
通过不断地改变容器的left值实现轮播效果。

* 难点：
1.无限循环的实现。（借助辅助图，当显示在辅助图上时，重新设置容器的left值，使之显示同样的图片。）
2.动画的实现。（不能采用css过渡动画，采用js递归不断改变容器left值，实现动画效果。）

* 缺点：
1.借助辅助图不利于动态渲染。
2.程序没有扩展性，多添加图片程序就挂掉了。
3.......



`index2.html`

* 思路：
将所有的图片重叠定位在同一位置，分别切换各个图片的透明度实现轮播效果

* 优点：
1.简单、无需考虑无限轮播。
2.过渡动画可以在css中直接设置。
3.多添加几张图片也可以正常运行。

`index3.html`

我们封装了一个统一的轮播图插件插件，使用方式：

```js
new Carousel({	 
	oWrapper: '', // 父容器
	timeOut: 2000, // 延时切换时间
	figureW: 600, // 轮播图宽度
	figureH: 400, // 轮播图高度
	figures: [ // 轮播图片集合
	 '../img/xx.jpg',
	 '../img/xx.jpg',
	// ....
	]		
});
```

## canvas星星闪动效果

通过`canvas`画布以及`requestAnimationFrame()`方法不断刷新画布实现各种动画效果。

比较重要的一些小知识点：
`save()`和`restore()`这两个方法经常一起使用，它可以使得一些操作仅作用于这两个方法之间，而不会影响其他内容。

```js
// 改变透明度
ctx.globalAlpha = 0.7;

// 绘制图片
// 参数：从画布的(0,0)位置开始
ctx.drawImage(image,0,0,w,h);

// 绘制带填充的矩形
ctx.fillStyle = '#393550';
ctx.fillRect(0,0,w,h);

// 实现帧动画
ctx.drawImage(image,sx,sy,swidth,sheight,x,y,width,height);
//参数：(sx,sy)图片起点，(swidth,sheight)图片上的宽高, (x,y)是canvas上的起点，(width,height)是绘制在canvas上的宽高。

```

大体思路：

```js
document.body.onload = function(){

	init(); // 初始化
	drawLoop(); // 绘制循环
}

function drawLoop(){
	
	// 绘制各种东西
	drawBackground();
	drawGirlImage();
	drawStarImage();
	update();  // 更新一些参数
	requestAnimationFrame(drawLoop); // 不断地去重绘
}
```

`starCanvas.js`

将这个效果封装成一个简单的插件来使用：

```js
new starCanvas({
	canvas:document.getElementById('canvas'),
	imgUrl:'./src/back.jpg',
	/**可选参数*/
	starNum: 50, // 星星的数量
	speed: 0.5, // 星星的移动速度
	flickerFreq: 80, // 闪烁频率
});
```

## 组件化dialog

在这个组件中实用到了`Zepto`这个框架，其主要目的在于提供一些工具方法和处理移动端的某些问题。

这个组件目前还不够完善，存在一些问题。
组件使用方法：

```js
new Dialog({
	width:'auto',
	message:'好好学习，知道吗？',
	type:'ok',
	buttons:[
		{
			text:'确认',
			type:'green',
			callback:function(){

			}					
		},
		{
			text:'有点烦',
			type:'red',
			callback:function(){

			}

		}
	],
	// 弹出框延时关闭
	delay:3000,
	// 遮罩层透明度
	maskOpacity:0.8
});


其中比较有趣的一点是使用了模板语法：
		// 创建基本的DOM结构
let htmlTempl = `<div class="g-dialog-container" ${this.config.maskOpacity?`
		style="background-color:rgba(0,0,0,${this.config.maskOpacity})";`:''}>
	 <div class="dialog-window" ${this.config.width === 'auto'?'':`style="width:${this.config.width}px"`}>
		<div class="dialog-header ${this.config.type}"></div>
		${this.config.message?`<div class="dialog-content">${this.config.message}</div>`:''}
		${this.config.buttons?`<div class="dialog-footer"></div>`:''}
	</div>
</div>`;

在${}中可以添加任意的表达式或函数调用，但是if条件语句不是表达式，所以没法使用，只能使用三目运算符来达到目的。

甚至你也可以使用这样的方式去遍历一个数组，插入数据。
${this.config.buttons.map(item => `
	<button class="dialog-btn ${item.type}">${item.text}</button>
`).join('')}		

```

## js实现打字机效果

思路：
* 通过一个定时器不断地取出字符串中的下一个字，然后将其添加到div区域，直到字符串的最有一个字停止。
* 在这个过程中我们怎样始终保持最新添加的内容位于可见区域呢？
那就是将这个区域的滚动条滚到最后：
```js
div.scrllTop = div.scrollHeight;
```
* 怎样实现光标的闪动呢？
```css
/*css3 animation动画*/
@keyframes blink {
    from, to {
	color: transparent;
    }
    50% {
	color: #fff;
    }
}

.content .cursor {
    animation: blink 1s step-end infinite;
}
```


核心代码：
```js
// 通过这个函数实现打字机效果
print(){
  var  = 0;
  var result = '';
  var timer = setInterval(function(){
    // 在所有字符串中截取出一个字来
    var _char = str.substr(counter,1);
    // 将这个字添加到一个div区域
    content.innerHTML = _char;
    if(counter < str.length){
      // 取下一个字
      counter ++;            
    }else{
      clearInterval(timer);
    }
  },40);
}
```


## LightBox弹出框插件

使用方式：

```html

<img src="./images/1-1.jpg" <!-- 图片缩略图地址 -->
     width="100px" <!-- 图片缩略图大小 -->
     data-role="lightbox" <!-- 启用LightBox组件 -->
     data-id="fdafasafaasfad" <!-- 图片的唯一标识符 -->
     data-group="group-1" <!-- 图片的分组名称 -->
     data-source="./images/1-1.jpg" <!-- 原始大图的地址 -->
     data-caption="图片描述xxx1"> <!-- 图片的描述信息 -->
```

通过以下方式引入插件：

```js
    var LightBox = new LightBox({
        animateSpeed: 500,
	// ...
    });
```

图片预加载方式：

```js
function prevLoadPicture (src, callback) {
    let image = new Image();
    image.src = src;
    if (!!window.ActiveXObject) { // IE
	image.onreadystatechange = function () {
	    if (image.readyState === 'complete') {
		callback(image.width, image.height);
	    }
	}
    } else { // 非IE
	image.onload = function () {
	    console.log("预加载：", image.width, image.height);
	    callback(image.width, image.height);
	}
    }
},
```


















