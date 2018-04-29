/**
 * LightBox组件的使用
 * data-role="lightbox"      启用LightBox组件
 * data-id="fdsafasfad"      图片的唯一标识符
 * data-group="group-1"      图片的分组名称
 * data-source="xxx.jpg"     原始大图的地址
 * data-caption="图片描述"    图片的描述信息
 *
 * eg:
 * <img src="./images/1-1.jpg" alt="" width="100px" data-role="lightbox" data-id="fdafasafaasfad" data-group="group-1"
 * data-source="./images/1-1.jpg" data-caption="图片描述xxx1">
 */
;(function ($) {
    const LightBox = function (config) {
        this.config = { // 默认的配置参数
            maskOpacity: 0.5,
            animateSpeed: 'fast'
            // ...
        };
        // 扩展默认参数
        $.extend(this.config, config);
        let _this = this;
        this.body = $(document.body); // 保存body
        // 创建遮罩层和弹出层
        this.mask = $('<div id="g-lightbox-mask">');
        this.popup = $('<div id="g-lightbox-popup">');

        this.isAnimating = false; // 动画是否正在执行标记位
        this.isShowing = false; // 弹出框是否正在显示标记位

        this.renderDOM(); // 渲染DOM

        // 获取节点对象
        this.picView = this.popup.find('.lightbox-pic-view');
        this.picCaption = this.popup.find('.lightbox-pic-caption');
        this.btnPrev = this.popup.find('.lightbox-btn-prev');
        this.btnNext = this.popup.find('.lightbox-btn-next');
        this.picImage = this.popup.find('.lightbox-image');
        this.picTitle = this.popup.find('.lightbox-pic-title');
        this.picIndex = this.popup.find('.lightbox-of-index');
        this.btnClose = this.popup.find('.lightbox-close-btn');

        this.initEvents(); // 初始化事件

        // 通过事件委托处理图片点击事件
        this.groupName = null;
        this.groupData = [];
        $(this.body).on('click', '.js-lightbox,*[data-role="lightbox"]', function (e) {
            if (_this.isAnimating) { // 如果正在执行则不做任何操作
                return false;
            }
            e.stopPropagation();
            let groupName = $(this).attr('data-group');
            if (groupName !== _this.groupName) {
                _this.groupData.length = 0; // 清空数组
                _this.groupName = groupName;
                _this.getGroupData(); // 获取信息
            }
            _this.isAnimating = true; // 开启动画标记
            _this.initPopup($(this)); // 初始化弹框
        });
    };

    LightBox.prototype = {
        initPopup: function (imgObj) {
            let id = imgObj.attr('data-id');
            let src = imgObj.attr('data-source');
            let winW = $(window).width();
            let winH = $(window).height();

            this.isShowing = true;
            // 隐藏图片和标题区域
            this.picView.hide();
            this.picCaption.hide();
            // 显示遮罩层和弹框
            this.mask.fadeIn();
            this.popup.fadeIn();

            // 执行弹框动画
            this.popup.css({
                width: winW / 2,
                height: winH / 2,
                top: -(winH / 4 * 3)
            }).animate({
                top: winH / 4
            }, this.config.animateSpeed, () => {
                this.isAnimating = false;
                this.loadPicSize(src);// 加载图片
            });

            // 获取当前图标的索引
            this.index = this.getIndexOf(id);
            console.log(this.index);

            // 判断是否显示切换按钮
            this.isShowSwitchBtn();
        },
        initEvents: function () {
            // 添加点击事件
            this.mask.on('click', () => {
                this.closeMaskAndPopup();
            });
            this.btnClose.on('click', () => {
                this.closeMaskAndPopup();
            });
            this.btnNext.on('click', () => {
                this.switchPicture('next');
            });
            this.btnPrev.on('click', () => {
                this.switchPicture('prev');
            });

            // 当调整window窗口时重现加载
            let timer = null;
            $(window).resize(() => {
                if (timer) {
                    window.clearTimeout(timer);
                }
                if (this.isShowing) {
                    timer = setTimeout(() => {
                        this.loadPicSize(this.groupData[this.index].src);
                    }, 200);
                }
            });
        },
        isShowSwitchBtn: function () {
            // 判断是否显示切换Btn
            if (this.groupData.length > 1) {
                this.btnPrev.removeClass('disabled');
                this.btnNext.removeClass('disabled');
                if (this.index === 0) { // 第一张
                    this.btnPrev.addClass('disabled');
                    this.btnNext.removeClass('disabled');
                }
                if (this.index === this.groupData.length - 1) { // 最后一张
                    this.btnPrev.removeClass('disabled');
                    this.btnNext.addClass('disabled');
                }
            }
        },
        getIndexOf: function (id) {
            let _index = 0;
            $(this.groupData).each((index, item) => {
                console.log("查找ID", item.id, index);
                if (item.id === id) {

                    _index = index;
                    return false;
                }
            });
            return _index;
        },
        loadPicSize: function (src) {
            this.isAnimating = true;
            // 隐藏图片和标题区域
            this.picView.hide();
            this.picCaption.hide();
            // 预加载图片
            this.prevLoadPicture(src, (w, h) => {
                // 设置图片
                this.picImage.attr('src', src);
                this.changePic(w, h);
            });
        },
        changePic: function (width, height) {
            let winH = $(window).height(),
                winW = $(window).width();
            // 根据窗口和实际图片大小计算缩放比
            let scale = Math.min(winH / height, winW / width, 1);
            width *= scale;
            height *= scale;
            // 过渡弹出框
            this.popup.animate({
                width: width,
                height: height,
                top: (winH - height) / 2
            }, this.config.animateSpeed);
            // 过渡图片区域
            this.picView.animate({
                width: width,
                height: height
            }, this.config.animateSpeed, () => {
                this.picView.fadeIn();
                this.picCaption.fadeIn();
                this.isAnimating = false;
            });
            // 获取图片的标题
            let caption = this.groupData[this.index].caption;
            let index = this.index;
            this.picTitle.text(caption);
            this.picIndex.text(`当前图片的索引: ${index + 1} of ${this.groupData.length}`);
        },
        prevLoadPicture: function (src, callback) {
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
        getGroupData: function () {
            // 遍历该组中所有的元素
            $(this.body).find("*[data-group=" + this.groupName + "]").each((i, item) => {
                this.groupData.push({
                    id: $(item).attr('data-id'),
                    src: $(item).attr('data-source'),
                    caption: $(item).attr('data-caption')
                });
            });
        },
        renderDOM: function () {
            let strHtml = `
                 <div class="lightbox-pic-view">
                    <span class="lightbox-btn lightbox-btn-prev disabled"></span>
                    <img alt="" class="lightbox-image">
                    <span class="lightbox-btn lightbox-btn-next disabled"></span>
                </div>
                <div class="lightbox-pic-caption">
                    <div class="lightbox-caption-area">
                        <p class="lightbox-pic-title text-ellipsis">000</p>
                        <p class="lightbox-of-index text-ellipsis">当前图片索引：1 of 4</p>
                    </div>
                    <span class="lightbox-close-btn"></span>
                </div>
            `;
            this.popup.html(strHtml);
            this.body.append(this.mask, this.popup);
        },
        closeMaskAndPopup: function () {
            if (!this.isAnimating) {
                this.popup.fadeOut();
                this.mask.fadeOut();
                this.isShowing = false;
            }
        },
        switchPicture: function (dir) {
            if (dir === 'next') { // 前一张
                this.index++;
                let src = this.groupData[this.index].src;
                this.loadPicSize(src);
                this.isShowSwitchBtn();
            }
            if (dir === 'prev') { // 后一张
                this.index--;
                let src = this.groupData[this.index].src;
                this.loadPicSize(src);
                this.isShowSwitchBtn();
            }
        }
    };
    window.LightBox = LightBox;
})(jQuery);