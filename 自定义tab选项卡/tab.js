;(function($){
	function Tab(tab,config){
		var _this = this;
		this.config = {
			triggerType:"mouseover",
			effect:"fade",
			invo:0,
			auto:1500
		};

		// 参数扩展
		if(config && !$.isEmptyObject(config)){
			$.extend(this.config,config);					
		}
		this.tab = tab;

		this.tabItems     = this.tab.find('.tab-nav li');
		this.contentItems = this.tab.find('.content-wrap .content-item');

		// 绑定事件
		if(this.config.triggerType){
			this.tabItems.bind(this.config.triggerType,function(ev){
				_this.invokeEvent($(this));
				ev.stopPropagation();
			});
		}

		// 自动播放
		if(this.config.auto){
			this.loop = 0;
			this.autoPlay();					
		}

		// 鼠标悬浮时取消
		this.tab.hover(function(){
			console.log('hover');
			window.clearInterval(_this.timer);
		},function(){
			console.log('play');
			_this.autoPlay();
		});

		// 默认显示
		console.log(this.config);
		if(this.config.invo>=0){
			var invo = this.config.invo;
			console.log("mo ren "+invo);
			this.invokeEvent(this.tabItems.eq(invo));
		}

	}

	// 一系列方法
	Tab.prototype = {

		// 事件驱动函数
		invokeEvent:function(that){			
			that.addClass('actived').siblings().removeClass('actived');
			if(this.config.effect === "default"){
				this.contentItems.eq(that.index()).addClass('current').siblings().removeClass('current');
			}
			if(this.config.effect === "fade"){
				this.contentItems.eq(that.index()).stop().fadeIn().siblings().stop().fadeOut();
			}
			// 更新下标
			if(this.config.auto){
				this.loop = that.index();
			}

		},

		// 自动播放
		autoPlay:function(){
			var _this = this;
			this.timer = setInterval(function(){
				_this.loop ++;
				if(_this.loop > _this.contentItems.length-1){
					_this.loop = 0;
				}
				
				// trigger : 触发某一个事件
				_this.tabItems.eq(_this.loop).trigger(_this.config.triggerType);
			},_this.config.auto);	
			
		}

	};

	// 挂载在window对象上
	window.Tab = Tab;

})(jQuery);


