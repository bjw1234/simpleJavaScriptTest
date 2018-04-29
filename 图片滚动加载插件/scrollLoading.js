(function ($) {
    $.fn.scrollLoading = function (config) {
        var _this = this;
        this.config = {
            attr: 'data-url',
            container: $(window),
            callback: $.noop()
        };
        // 扩展默认的配置参数
        $.extend(this.config, config);

        this.config.cache = [];
        $(this).each(function (index, item) {
            _this.config.cache.push({
                obj: $(item),
                tag: item.nodeName.toLowerCase(),
                url: $(item).attr(_this.config.attr)
            });
        });

        // 回调
        var callback = function (obj) {
            if ($.isFunction(_this.config.callback)) {
                _this.config.callback.call(null, obj);
            }
        };

        // 动态加载内容
        var loading = function () {
            // 获取总高度
            var contentHeight = _this.config.container.height();
            // 获取卷起的高度
            var contentScrollTop = _this.config.container.scrollTop();

            $(_this.config.cache).each(function (index, item) {
                if (item.obj) {
                    // 判断是否位于可见区域
                    var position = item.obj.offset().top - contentScrollTop;
                    if (item.obj.is(':visible') && (position >= 0 && position < contentHeight)) {
                        if (item.url) {
                            if (item.tag === 'img') {
                                callback(item.obj.attr('src', item.url));
                            } else {
                                item.obj.load(item.url, function () {
                                    callback(item.obj);
                                });
                            }
                        }
                        // 目的：提高性能
                        item.obj = null;
                    }
                }
            });
        };

        // 首次加载
        loading();
        // 滚动加载
        this.config.container.bind('scroll', loading);
    }
})(jQuery);