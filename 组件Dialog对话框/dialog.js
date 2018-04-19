;(function($){

	function Dialog(config){

		// 默认参数
		this.config = {
			width:'auto',
			height:'auto',
			message:null,
			type:'loading',
			buttons:null,
			delay:null,
			maskOpacity:null
		};

		// 默认参数扩展
		if(config){
			$.extend(this.config,config);
		}

		// 创建基本的DOM结构
		let htmlTempl = `<div class="g-dialog-container" ${this.config.maskOpacity?`style="background-color:rgba(0,0,0,${this.config.maskOpacity})";`:''}>
						 <div class="dialog-window" ${this.config.width === 'auto'?'':`style="width:${this.config.width}px"`}>
							<div class="dialog-header ${this.config.type}"></div>
							${this.config.message?`<div class="dialog-content">${this.config.message}</div>`:''}
							${this.config.buttons?`<div class="dialog-footer"></div>`:''}
						</div>
					</div>`;
					// 	${this.config.buttons.map(item => `
					// <button class="dialog-btn ${item.type}">${item.text}</button>
					// `).join('')}		
		console.log(htmlTempl);
		// 加入body
		this.create(htmlTempl);
		// 添加延时关闭事件
		this.addCloseListener(this.config.delay);
		// 添加按钮和按钮回调事件
		this.addButtonsCallBackListener();
	}

	Dialog.prototype = {

		animate:function(){
			let win = $('.dialog-window');
			win.css('transform','scale(0,0)');
			window.setTimeout(function(){
				win.css('transform','scale(1,1)');
			},5);
		},

		create:function(html){ // 将指定的html文本加入body区域
			let body = $('body');			
			body.append(html);
			this.animate();
		},

		addCloseListener:function(delay){ // 弹出框延时关闭
			if(delay){
				window.setTimeout(function(){
					$('.g-dialog-container').remove();
				},delay);
			}
		},

		addButtonsCallBackListener:function(){ // 添加按钮和事件
			let buttons = this.config.buttons;
			if(buttons){
				let footer = $('.dialog-footer');
				$(buttons).each((index,item)=>{
					var button = $(`<button class="${item.type}">${item.text}</button>`);
					button.click(()=>{
						if(item.callback){
							item.callback();
							this.addCloseListener(1);
						}else{
							this.addCloseListener(1);
						}
					});
					footer.append(button);
				});
			}
		}

	}

	window.Dialog = Dialog;

})(Zepto);