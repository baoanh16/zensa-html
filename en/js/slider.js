var ImageSlideshow = function (target, indicatorAppendedElement) {
	
	var _this = this;
	
	this.target = target;
	this.indicatorAppendedElement = indicatorAppendedElement;
	this.reel = $(target).find(".image-reel").get()[0];
	this.len = this.reel.getElementsByTagName("li").length;
	this.current = 0;
	this.dotIndicator;
	
	return {
		init: function () {
			var t = this;
			var l = _this.len;
			var ul = document.createElement("ul");
			ul.setAttribute("class", "dotIndicator");
			_this.indicatorAppendedElement.appendChild(ul);
			_this.dotIndicator = ul;
			
			for (var i = 0; i < l; i++) {
				var li = document.createElement("li");
				var span = document.createElement("span");
				ul.appendChild(li);
				li.appendChild(span);
				_this.reel.getElementsByTagName("li")[i].style.zIndex = _this.len - i;
			}
			
			$(ul).find("li").click(function () {
				t.slide($(this).index());
			});
			
			$(_this.reel).bind("click touchend", function () {
				_this.current === _this.len - 1 ? t.slide(0) : t.slide(_this.current + 1);
			});
			
			_this.dotIndicator.getElementsByTagName("li")[_this.current].setAttribute("class", "current");
		},
		slide: function (n) {
			var li = _this.reel.getElementsByTagName("li")[n];
			li.style.opacity = 0;
			
			for (var i = 0; i < _this.len; i++) {
				var target = _this.reel.getElementsByTagName("li")[i];
				var ind = _this.dotIndicator.getElementsByTagName("li")[i]
				ind.setAttribute("class", "");
				if (i === n) {
					target.style.zIndex = _this.len;
					ind.setAttribute("class", "current");
				} else if (_this.current === i) {
					target.style.zIndex = _this.len - 1;
				} else {
					target.style.zIndex = 0;
				}
				
			}
			_this.current = n;
			
			$(li).animate({opacity: 1}, 1000);
		}
	}
}