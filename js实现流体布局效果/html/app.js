(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const responseContainer = document.querySelector('#response-container');
    
    let searchedForText = '';  // 请求的关键词
    let searchedForPage = 1;   // 请求的page
    let isLoading = false;     // 是否正处于加载数据的状态
    waterFall();
    // 根据page请求数据
    function requestImg(page){
    	const unsplashRequest = new XMLHttpRequest();
		unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=${page}&query=${searchedForText}`);
		unsplashRequest.onload = addImage;
		unsplashRequest.onerror = onError;
		unsplashRequest.setRequestHeader('Authorization', 'Client-ID 7690e04908ea0ad9382f36c5dd2d1881bfa1ecb0626c177b9a959866ccd03ede');
		unsplashRequest.send();
    }

    // 数据加载失败后的回调
    function onError(){
    	isLoading = false;
    }

    // 数据请求成功后的回调
    function addImage(){			
    	isLoading = false;
		let htmlContent = '';
		const data = JSON.parse(this.responseText);
		console.log(data);
		if(data && data.results && data.results[0]){
			for(firstImage of data.results ){
                var ratio = firstImage.width / 385;
                var h = firstImage.height / ratio;
				htmlContent += `<figure>
				<img class="scrollLoading" data-url="${firstImage.urls.regular}" width="385" height="${h}" src="http://www.zhangxinxu.com/study/image/pixel.gif" alt="${searchedForText}" style="background:url(../images/loading.gif) #e7e9eb no-repeat center;">
				<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
				</figure>`;
			}					
		}else{
			htmlContent = '<div class="error-no-image">No images available</div>';
		}
		responseContainer.insertAdjacentHTML('beforeEnd',htmlContent);	
		searchedForPage +=1;   // 更新加载的page		
        waterFall();  
        $('.scrollLoading').scrollLoading();      
	}

	// 表单提交
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        searchedForPage = 1;  
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;	
        requestImg(searchedForPage);	
    });

    // 是否加载数数据的判断
    function checkScrollSlide(){
    	var lastChild = responseContainer.lastElementChild; // 最后一个元素
    	var lastChildScrollTopHeight = lastChild.offsetTop;  // 最后一个元素距离顶部的距离
    	var windowH = document.documentElement.clientHeight;
    	var scrollHeight = document.documentElement.scrollTop;
    	if(lastChildScrollTopHeight < (windowH+scrollHeight)){
    		return true;
    	}else{
    		return false;
    	}
    }

    // 页面滚动执行的函数
    window.onscroll = function(){
    	if(checkScrollSlide()){  // 我们应该加载数据了
    		if(!isLoading && searchedForText!=''){
    			console.log("加载数据...searchedForPage = "+searchedForPage);
    			isLoading = true;
    			requestImg(searchedForPage);
    		}
    	}
    }

    // 当页面尺寸发生变化时
    window.onresize = function(){
        waterFall();
    }

    // js确定图片的布局和位置
    function waterFall(){
        var oBoxs = responseContainer.getElementsByTagName('figure');
        if(!oBoxs.length){
            return;
        }
        var oBoxW = oBoxs[0].offsetWidth;
        var cols = Math.floor(document.documentElement.clientWidth/oBoxW);
        // responseContainer.cssText = `width:${cols*oBoxW}px;margin:0 auto`;

        //存放第一行的高度数组
        var hArr = [];
        for(var i=0;i<oBoxs.length;i++){
            if(i<cols){
                hArr.push(oBoxs[i].offsetHeight);                
            }else{
                var minH = Math.min.apply(null,hArr);
                var index = hArr.indexOf(minH);
                oBoxs[i].style.position = 'absolute';
                oBoxs[i].style.top = minH+'px';
                oBoxs[i].style.left = oBoxs[index].offsetLeft+'px';

                // 更新数据
                hArr[index] += oBoxs[i].offsetHeight;
            }
        }
    }   
})();
