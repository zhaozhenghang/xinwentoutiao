alert("手机浏览器，有些可能不支持flex布局(如：UC浏览器)，页面会乱，用qq浏览器打开");
var schemas = {
	top: 0,
	shehui: 0,
	guonei: 0,
	guoji: 0,
	yule: 0,
	tiyu: 0,
	junshi: 0,
	keji: 0,
	caijing: 0,
	shishang: 0
};
var flag = "a";
$("#nav ul li").click(function() {
	if(flag == "a") {
		var tablename = $(this).attr("id");
		$("#nav ul li").css("color", "black");
		$(this).css("color", "red");
		$('#content').html('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: "loading.php?type=" + $(this).attr("id"),
			success: function(data) {
				var aa = [];
				for(var i = data.result.data.length - 1; i >= 0; i -= 1) {
					aa.push(data.result.data[i])
				}
				addNews(tablename, aa, function() {
					queryMax(tablename, function(max) {
						schemas[tablename] = max;
						fetchNew(tablename, schemas[tablename], 5, function(data) {
							var data = {
								data: data
							};
							var html = template('newstemp', data);
							$("#content").html(html);
							var div = $("<div id='more'>点击加载更多</div>");
							div.click(loadMore);
							$('#content').append(div);
							schemas[tablename] -= 5
						})
					})
				})
			},
			error: function() {
				alert('网络好像有问题。。。。')
			}
		})
	} else {
		flag = "a"
	}

	function loadMore() {
		fetchNew(tablename, schemas[tablename], 5, function(data) {
			var data = {
				data: data
			};
			var html = template('newstemp', data);
			$('#more').before($(html));
			schemas[tablename] -= 5
		})
	}
});
initDatabase(schemas, function() {
	$("#top").click()
});
$("#scoll").width($("#nav ul li").outerWidth() * 10);
$("#scoll").mousedown(function(e) {
	var currX = e.pageX;
	$(document).mousemove(function(e) {
		if($("#scoll").position().left + (e.pageX - currX) <= 0 && $("#scoll").position().left + (e.pageX - currX) >= ($(window).width() - $("#scoll").width())) {
			$("#scoll").css("left", $("#scoll").position().left + (e.pageX - currX) + "px");
			currX = e.pageX;
			flag = "b";
		}
		e.preventDefault()
	});
	$(document).mouseup(function(e) {
		
		$(document).unbind("mousemove")
	});
	$(window).resize(function() {
		if($(window).width() > $("#scoll").width()) {
			$("#scoll").css("left", "0px")
		}
	})
});
document.getElementById("scoll").addEventListener("touchmove", touchmove, false);
document.getElementById("scoll").addEventListener("touchstart", touchstart, false);
var currX = null;

function touchstart(event) {
	var touch = event.targetTouches[0];
	currX = touch.pageX
}

function touchmove(event) {
	event.preventDefault();
	var touch = event.targetTouches[0];
	if($("#scoll").position().left + (touch.pageX - currX) <= 0 && $("#scoll").position().left + (touch.pageX - currX) >= ($(window).width() - $("#scoll").width())) {
		$("#scoll").css("left", $("#scoll").position().left + (touch.pageX - currX) + "px");
		currX = touch.pageX
	}
}