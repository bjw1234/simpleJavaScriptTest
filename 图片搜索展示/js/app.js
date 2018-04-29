$(function () {
    // 获取用户输入
    let searchForm = $('#search-form');
    let searchKeyword = $('#search-keyword');
    let responseContainer = $('#response-container');

    let keyWord = ''; // 用户输入的关键字(默认)
    let isLoading = false; // 是否正在加载
    let page = 1; // 页码标识符

    searchForm.on('submit', function () {
        keyWord = searchKeyword.val().trim();
        searchKeyword.val('');
        responseContainer.html('');
        page = 1;
        requestData(page, keyWord);
    });

    // 默认触发(填充数据)
    searchForm.trigger('submit');

    // 加载lightBox
    new LightBox({
        animateSpeed: 500
    });

    /**
     * 发起ajax请求
     * @param page 页码
     * @param searchedForText 关键字
     */
    function requestData(page, searchedForText) {
        console.log(page, searchedForText);
        isLoading = true;
        $.ajax({
            type: 'GET',
            dataType: 'JSON',
            url: `https://api.unsplash.com/search/photos?page=${page}&query=${searchedForText}`,
            headers: {
                'Authorization': 'Client-ID 7690e04908ea0ad9382f36c5dd2d1881bfa1ecb0626c177b9a959866ccd03ede'
            },
            success: function (data) {
                insertHtml(data);
            }
        });
    }

    /**
     * 页面填充数据
     * @param data json数据
     */
    function insertHtml(data) {
        if (data && data.results && data.results[0]) {
            let content = '';
            $(data.results).each(function (index, item) {
                let radio = 385 / item.width;
                let h = item.height * radio;
                content += `
                    <figure>
                         <div class="image-wrapper">
                            <img class="scrollLoading" data-role="lightbox" data-id="${item.id}" data-group="group-${page}" data-caption="${keyWord} by ${item.user.name}" data-source="${item.urls.regular}" width="385" height="${h}" alt="${keyWord}" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">				   
                            <figcaption>${keyWord} by ${item.user.name}</figcaption>
                        </div>  				     
                    </figure>
                `;
            });
            responseContainer.append(content);
            waterFall(); // 重新布局
        } else {
            content = '<div class="error-no-image">No images available!</div>';
        }
    }

    /**
     * 瀑布流布局的具体实现
     */
    function waterFall() {
        let boxes = $('#response-container figure');
        if (!boxes || boxes.length === 0) {
            return;
        }
        let w = boxes.eq(0).outerWidth();
        let cols = Math.floor($(window).width() / w);
        responseContainer.width(w * cols).css('margin', '0 auto');
        let hArr = [];
        boxes.each(function (index, value) {
            let h = boxes.eq(index).outerHeight();
            if (index < cols) {
                hArr[index] = h;
                $(value).css({
                    'position': 'absolute',
                    'left': w * index + 'px',
                    'top': 0
                });
            } else {
                let minH = Math.min(...hArr);
                let i = $.inArray(minH, hArr);
                $(value).css({
                    'position': 'absolute',
                    'left': w * i + 'px',
                    'top': minH + 'px'
                });
                // 改变数组
                hArr[i] += boxes.eq(index).outerHeight();
            }
        });
        console.log(hArr);
        // 动态加载图片
        $('.scrollLoading').scrollLoading({
            attr: 'data-source'
        });
        isLoading = false;
    }

    // 当调整window窗口时重现加载
    let timer = null;
    $(window).resize(() => {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = setTimeout(() => {
            waterFall();
        }, 400);
    });

    // 是否加载数数据的判断
    function checkScrollSlide() {
        //debugger
        var windowH = $(window).height();
        var scrollHeight = $(window).scrollTop();
        var lastChildScrollTopHeight = $('figure:last').offset().top;
        if (lastChildScrollTopHeight < (windowH + scrollHeight)) {
            return true;
        } else {
            return false;
        }
    }

    // window 滚动事件
    $(window).bind('scroll', function () {
        if (checkScrollSlide() && !isLoading) {
            page++;
            requestData(page, keyWord);
        }
    });
});