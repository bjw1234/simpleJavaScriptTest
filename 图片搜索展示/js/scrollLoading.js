/**
 * <img class="scrollLoading"
 * data-url="https://images.unsplash.com/photo-1494376863055-e18dd6c6841a?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE5ODgzfQ&amp;s=281537d7dc78f51012baf1b276428a48"
 * width="385" height="256" src="src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==""
 * alt="fire" style="background:url(./images/loading.gif) #e7e9eb no-repeat center;">
 *
 * $('.scrollLoading').scrollLoading();
 */
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