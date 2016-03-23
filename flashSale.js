var uid;
var tag;
var page;
$(function(){
	var args =getSearch();
	uid = args.uid;
	tag = args.tag; 

	//点击切换今日明日
	$('.today').on('click',function(){
		Today();
	});
	$('.tomorrow').on('click',function(){
		Tomorrow();	
	});	
	ajaxGetGoods(page);
	freshTime();
	timeInterval = setInterval(freshTime,1000);	
});

/*
得到url中的search参数
*/
function getSearch(){
	var query = window.location.search.slice(1);
	var pairs = query.split('&');
	var args = {};
	for(var i=0; i<pairs.length; i++){
		var index = pairs[i].indexOf('=');
		var key = pairs[i].substring(0,index);
		var value = pairs[i].substring(index+1);
		args[key] = decodeURI(value);
	}
	return args;
}
/*向左滑动和点击明日抢购*/
function Tomorrow(){
	if($('.today').hasClass("select")){
		$('.tomorrow').removeClass('unselect').addClass('select');
		$('.today').removeClass('select').addClass('unselect');
		
		//滑动效果
		swiper.slideNext();
		
	}
}
/*向右滑动和点击今日抢购*/
function Today(){
	if($('.tomorrow').hasClass("select")){
		$('.today').removeClass('unselect').addClass('select');
		$('.tomorrow').removeClass('select').addClass('unselect');
		
		//滑动效果
		swiper.slidePrev();
		
	}
}
/*请求后台今日抢购和明日抢购数据*/
function ajaxGetGoods(){
	$.ajax({
		url:"http://haojiazhang123.com/mall/get_flash_sale_list.json",
		type: "get",
		dataType: "json",
		data:{
			page :page
		},
		success:function(data){
			if (data) {
				if(data.status === 'success'){
					cookData(data);
				}else if(data.status === 'fail'){
					window.hjz.info('请求出错');
				}
			}else{
				window.hjz.info('没有数据');
			}
		},
		error : function(error){
			window.hjz.info('网络错误');
		}
	})
}
/*显示信息*/
function cookData(data){
	//今日抢购
	var goodsFuture;
	var goodonSale;
	var $goodListToday = $('.goodListToday');
	var $selloutList = $('.selloutList');
	var $goodListTom = $('.goodListTom');
	for (var i = 0; i < data.on_sales.length; i++) {
		goodonSale = data.on_sales[i];
		startTime = goodonSale
		url = 'http://haojiazhang123.com/share/mall_3.0/goodDetail.html?item_id='+goodonSale.item.id+'&uid='+uid+'&tag='+tag;
		var saleCount = parseInt(goodonSale.read_count)*13 + 13 + Math.floor(Math.random()*10 + 1);		//商品销量
		if(parseInt(goodonSale.item.stock)>0){
				$('<div class="goodItem"><a href="'+url+'"><div class="picContainer"><img class="goodImg" src="'+
					goodonSale.item.cover_square+'"></div></a><div class="rightContainer"><a href="'+url+'"><div class="goodTitle">'+
					goodonSale.item.title+'</div><div class="goodDetail clearfix"><div class="leftSide">￥<span class="currentPrice">'+
					goodonSale.flash_price+'</span><del class="originalPrice">'+goodonSale.item.original_price+'</del><p><span class="people">'+
					saleCount+'</span>人在抢</p></div><div class="buy">抢购</div></div></a></div></div>').appendTo($goodListToday);
			} else{
				$('<div class="goodItem"><a href="'+url+'"><div class="picContainer"><img class="goodImg" src="'+
					goodonSale.item.cover_square+'"></div></a><div class="rightContainer"><a href="'+url+'"><div class="goodTitle">'+
					goodonSale.item.title+'</div><div class="goodDetail clearfix"><div class="leftSide">￥<span class="currentPrice">'+
					goodonSale.flash_price+'</span><del class="originalPrice">'+goodonSale.item.original_price+'</del><p><span class="people">'+
					saleCount+'</span>人在抢</p></div><div class="sellout">已抢光</div></div></a></div></div>').appendTo($selloutList);
			}
	};
	for (var i = 0; i < data.future_sales.length; i++) {
		goodsFuture = data.future_sales[i];
		url = 'http://haojiazhang123.com/share/mall_3.0/goodDetail.html?item_id='+goodsFuture.item.id+'&uid='+uid+'&tag='+tag;
		var saleCount = parseInt(goodsFuture.read_count)*13 + 13 + Math.floor(Math.random()*10 + 1);		//商品销量
		$('<div class="goodItem"><a href="'+url+'"><div class="picContainer"><img class="goodImg" src="'+
			goodsFuture.item.cover_square+'"></div></a><div class="rightContainer"><a href="'+url+'"><div class="goodTitle">'+
			goodsFuture.item.title+'</div><div class="goodDetail clearfix"><div class="leftSide">￥<span class="currentPrice">'+
			goodsFuture.flash_price+'</span><del class="originalPrice">'+goodsFuture.item.original_price+'</del><p><span class="people">'+
			saleCount+'</span>人在抢</p></div><div class="unsell">未开始</div></div></a></div></div>').appendTo($goodListTom);
			
	};
}
// 刷新倒计时时间和今晚明晚
function freshTime()
{
	var nowtime = new Date();//当前时间
	var nowHour = nowtime.getHours();
	if(parseInt(nowHour)>=20){
		$('#night').text('明晚');
		nowtime = +nowtime + 1000*60*60*24;
		nowtime = new Date(nowtime);
		var endtime = nowtime.getFullYear()+"-"+(nowtime.getMonth()+1)+"-"+nowtime.getDate()+" 20:00:00";
	}else{
		$('#night').text('今晚');
		var endtime = nowtime.getFullYear()+"-"+(nowtime.getMonth()+1)+"-"+nowtime.getDate()+" 20:00:00";
	}
	endtime=new Date(endtime);
	var nowtime = new Date();//当前时间
    var lefttime=  parseInt((endtime.getTime()-nowtime.getTime())/1000); 
    h= parseInt(lefttime/3600%24);
    h = (Array(2).join(0)+h).slice(-2); //保持两位数字
    m= parseInt(lefttime/60%60);
    m = (Array(2).join(0)+m).slice(-2);
    s= parseInt(lefttime%60);
    s = (Array(2).join(0)+s).slice(-2);

	$("#TodayHour").text(h);
	$("#Todaymin").text(m);
	$("#ToddaySec").text(s);
	$("#TomHour").text(h);
	$("#Tommin").text(m);
	$("#Tomsec").text(s);
    // clearInterval(timeInterval);
      
}	