
var currentSection;

$(document).ready(function() {
	
	$("a[href='../']").click(function(e) {
		var t = this;
		e.preventDefault();
		$("body").fadeOut(500, function() {
			window.location.href = $(t).attr("href");
		});
	});
	
	$( "#charge" ).tabs({ active: 1 });
	
	// Infinite scroll
	$(window).load(function() {
		(function() {
			var wd = ScrollProperties.wd;
			var kd = ScrollProperties.kd;
			var t = document.getElementById("images");
			var p = t.getElementsByTagName("ul")[0];
			var c = p.getElementsByTagName("li");
			
			imageScroller = new ImageScroller(p, c, [wd, kd]);
			imageScroller.init();
			imageScroller.start();
			
			window.scrollTo(0,0);
			currentSection = new CurrentSection($("#gnav-main > li").find("a").get());
			
			if (UA.device === "other") {
				replaceSideImages = new ReplaceSideImages(t, p);
				contentScroller = new ContentScroller([wd, kd]);
				contentScroller.start();
				
				$(window).scroll(function(e) {
					currentSection.render();
					preventDefault(e);
					return false;
				});
				
				$("body").mousewheel(function(e, delta, dx, dy) {
					d = delta;
					if (UA.os === "mac") d = delta * 10;
					contentScroller.onMouseWheel(wd, d);
					imageScroller.onMouseWheel(wd, d);
					
					preventDefault(e);
					return false;
				});
				
				$(".page-anchor").on({
					"click": function(e) {
						var margin = 60;
						var href = this.href;
						var hash = href.substr(href.indexOf("#"));
						var y = parseInt($(hash).offset().top) - $("#global-header").height() - margin;
						imageScroller.y(y);
						contentScroller.y(y);
						preventDefault(e);
						return false;
					}
				});
				
				var shiftkeyDown = false;
				
				document.onkeyup = null;
				document.onkeyup = function(e) {
					var k = e ? e.keyCode : e.which;
					// Shift key
					if (k === 16) {
						shiftkeyDown = false;
					}
				}
				
				document.onkeydown = null;
				document.onkeydown = function(e) {
					var cy = contentScroller.y();
					var h = document.getElementById("header-wrapper");
					var k = e ? e.keyCode : e.which;
					var y;
					
					// Shift key
					if (k === 16) {
						shiftkeyDown = true;
						return false;
					}
					
					// Space key & Other navigation keys
					if (k >= 32 && k <= 36) {
						if (k === 33 || k === 32 & shiftkeyDown) { // Page-up key or Space + Shift key
							y = cy - $(window).height() + $(h).height();
						} else if (k === 34 || k === 32) { // Page-down key & Space key
							y = cy + $(window).height() - $(h).height();
						} else if (k === 35) { // End key
							y = $(document).height();
						} else if (k === 36) { // Home key
							y = -1;
						}
						if (y === 0) y = -1;
						contentScroller.y(y);
						imageScroller.y(y);
						return false;
						
					// Cursor control (arrow) keys
					} else if (k >= 37 && k <= 40) {
						if (k === 38) { // Up arrow key
							y = 1;
						} else if (k === 40) { // Down arrow key
							y = -1;
						}
						contentScroller.onMouseWheel(kd, y);
						imageScroller.onMouseWheel(kd, y);
						return false;
					}
				}
				var preventDefault = function(e) {
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				}
				
				var onResize = function() {
					var wh = document.documentElement.clientHeight || document.body.clientHeight;
					var images = document.getElementById("images");
					images.style.height = wh + document.getElementsByTagName("body")[0].offsetHeight + "px";
					imageScroller.resize();
					currentSection.build();
				}
				onResize();
				$(window).resize(onResize);
				
			} else {
				document.getElementsByTagName("body")[0].setAttribute("class", "multi-touch-device");
			}
		})();
		
		if (initIndicator) {
			initIndicator.hide();
		}
		$("#wrapper, #header-wrapper").css("visibility", "visible").animate({opacity: 1}, 500);
		currentSection.init();
	});
	
	// Menu button
	$(document).ready(function() {
		
		if (UA.os === "win") {
			$("body").eq(0).addClass("windows");
		}
		
		if (UA.browser === "msie") {
			console.log("msie");
			$("body").eq(0).addClass("msie");
		}
		
		$("#gnav").addClass("hide");
		
		$(".menu-button a").on("touchend click", function (e) {
			e.preventDefault();
			menuToggle($(this.getAttribute("href")));
		});
		
		var transitionEnd = getTransitionEndType();
		
		$("#gnav .wrap").eq(0).on("webkitTransitionEnd transitionend", function(e) {
			var $menu = $("#gnav");
			if (parseInt($(this).css("opacity")) === 0) {
				$menu.addClass("hide");
			}
		});
		
		
		$("#gnav .wrap").click(function(e) {
			e.stopPropagation();
			menuToggle($("#gnav"));
		});
		
		$("#gnav .page-anchor").click(function(e) {
			e.stopPropagation();
			menuToggle($("#gnav"));
		});
		
		$("#gnav a").click(function(e) {
			e.stopPropagation();
		});
		
		
		function menuToggle($menu) {
			
			if ($menu.hasClass("show")) {
				$menu.removeClass("show");
				
			} else {
				$menu.removeClass("hide").addClass("show");
			}
		}
	});
	
	// Google maps
	(function() {
		var id = "canvas";
		var p = $("#" + id).parent();
		var m = new Image(), s = new Image();
		m.ref = s.ref = void (0);
		m.src = "/common/images/googlemaps_marker.png";
		s.src = "/common/images/googlemaps_shadow.png";
		m.onload = s.onload = addGM;
		
		function addGM() {
			this.ref = [this.width, this.height, this.src];
			if (m.ref && s.ref) {
				addGoogleMap( 33.079033, 131.132131 , id, 7, p.width(), p.height(), m.ref, s.ref)
			}
		}
	})();
	
	// Slider
	(function() {
		var slideshows = new Array();
		var len = $(".image-reel").length;
		for (var i = 0; i < len; i++) {
			var div = document.createElement("div");
			$(div).addClass("dotIndicator-container");
			$(".figure").eq(i).next().find("h2").after(div);
			slideshows[i] = new ImageSlideshow($(".figure").eq(i).get()[0], div);
			slideshows[i].init();
			slideshows[i].id = "reel" + i;
		}
	})();
	
	// Modal window
	(function() {
		var len = $("a[rel*=leanModal]").length;
		for (var i = 0; i < len; i++) {
			var span = document.createElement("span");
			span.setAttribute("class", "modal-close");
			$(".modal-content > section").eq(i).children("div").after(span);
		}
		$("a[rel*=leanModal]").leanModal({
			top : 300,
			overlay : 0.7,
			closeButton: ".modal-close"
		});
	})();
	
});


var CurrentSection = function(elm) {
	var _this = this;
	this._target = elm;
	this._pos = new Array(elm.length + 2);
	this.title = "Kurokawa Spa Ryokan Sanga";
	
	return {
		init: function() {
			_this._pos[0] = new Object({
				top:0,
				hash:"#home"
			});
			_this._pos[_this._pos.length - 1] = new Object({
				top: $(document).height(),
				hash:"#end"
			});
			this.build();
		},
		build: function() {
			var l = _this._target.length;
			var href, hash;
			for (var i = 1; i < l + 1; i++) {
				href = _this._target[i - 1].getAttribute("href");
				h = href.substr(href.indexOf("#"));
				_this._pos[i] = _this._target[i - 1];
				_this._pos[i].hash = h;
				_this._pos[i].title = h.slice(1).charAt(0).toUpperCase() + h.slice(2);
				_this._pos[i].top = parseInt($(h).offset().top) - 250;
			}
		},
		render: function() {
			var l = _this._pos.length;
			var a, b = "", y;
			
			for (var i = 0; i < l; i++) {
				if (_this._pos[i].parentNode) _this._pos[i].parentNode.setAttribute("class", "");
			}
			
			for (var j = 1; j < l; j++) {
				a = _this._pos[j - 1];
				y = contentScroller.y();
				
				if (_this._pos[j].top > y) {
					if (a.title) {
						b = " - " + a.title;
						a.parentNode.setAttribute("class", "current");
					}
					document.title = _this.title + b;
					break;
				}
			}
		}
	}
}
