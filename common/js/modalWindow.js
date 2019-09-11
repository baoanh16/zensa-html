
/*
 * modalWindow.js
 * 
 * Copyright (C) 2011 GLIDE ARTS STUDIO.
 * @ version 0.3.4
 * @ 2011-07-02
 * @ 2014-08-05 Last Modified.
 * @ Athor GLIDE ARTS STUDIO.
 */


var GAS_MODAL = {};
var GAS_INDICATOR_SRC = "http://www.glide.co.jp/common/images/indicator.gif";
var GAS_CLOSE_BUTTON_SRC = "http://www.glide.co.jp/common/images/google_maps_marker.png";
var GAS_MODAL_CLASS_NAME = "modal";



/* ---------------------------------------------------------------------------------------------- */



var ModalWindow = {
	
	UA: "",
	
	_overlay     : document.createElement("div"),
	_body        : document.createElement("div"),
	_image       : document.createElement("img"),
	_iFrame      : document.createElement("iframe"),
	_ajaxContent : document.createElement("div"),
	_caption     : document.createElement("p"),
	_closeButton : document.createElement("img"),
	_nextButton  : document.createElement("p"),
	_prevButton  : document.createElement("p"),
	_indicatorContainer: document.createElement("div"),
	_indicator   : new Image(),
	
	_currentNum  : "",
	_captionText : "",
	_prevCaption : "",
	_prevURL     : "",
	_nextCaption : "",
	_nextURL     : "",
	_currentGroup : "",
	_defWidth    : 0,
	_defHeight   : 0,
	_defPadding  : 30,
	_isResize    : true,
	_isIframe    : false,
	_fullscreen  : false,
	_httpRequest   : false,
	_transitionEnd : "",
	
	init: function() {
		
		var doc = document;
		var tar = this;
		var elements, i;
		
		this.UA = this.prototype.UA;
		this._transitionEnd = this.prototype.getTransitionEndType();
		this._indicator.src = GAS_INDICATOR_SRC;
		
		if (this.UA.browser === "msie" && this.UA.version < 9) {
			elements = this.prototype.msieGetElementsByClassName(GAS_MODAL_CLASS_NAME);
			
		} else {
			elements = doc.getElementsByClassName(GAS_MODAL_CLASS_NAME);
		}
		
		if (doc.addEventListener) {
			window.addEventListener("resize", function() {
				tar.resize();
			}, false);
			
			this._overlay.addEventListener(this._transitionEnd, function(e) {
				if (e.propertyName === "opacity" && this.style.opacity === "0") {
					tar.remove();
				}
			}, false);
			
		} else if (document.attachEvent) {
			window.onresize = function() {
				tar.resize();
			}
		}
		
		this._closeButton.setAttribute("src", GAS_CLOSE_BUTTON_SRC);
		this._closeButton.setAttribute("id", "G_ModalWindowCloseButton");
		this._closeButton.setAttribute("alt", "");
		this._closeButton.setAttribute("title", "閉じる");
		this._closeButton.style.visibility = "hidden";
		this._body.appendChild(this._closeButton);
		
		for (i = 0; i < elements.length; i++) {
			
			if (doc.addEventListener) {
				elements[i].addEventListener("click", function (event) {
					
					var t, a, g;
					
					t = this.getAttribute("title") || null;
					a = this.getAttribute("href") || "";
					g = this.getAttribute("rel") || false;
					
					tar.open(t, a, g);
					this.blur();
					event.preventDefault();
				}, true);
				
			} else if (doc.attachEvent) {
				elements[i].onfocus = function (){
					this.blur()
				}
				elements[i].onclick = function () {
					
					var t, a, g;
					
					t = this.getAttribute("title") || this.name || null;
					a = this.getAttribute("href") || "";
					g = this.getAttribute("rel") || false;
					tar.open(t, a, g);
					return false;
				}
			}
		}
	},
	
	open: function(caption, url, imageGroup) {
		
		var doc = document;
		var html = doc.getElementsByTagName("html")[0];
		var body = doc.getElementsByTagName("body")[0];
		var overlay = this._overlay;
		var modalBody = this._body;
		var t = this;
		
		try {
			//if IE 6
			if (this.UA.browser === "msie" && this.UA.version < 7) {
				body.style.height = "100%";
				body.style.width = "100%";
				html.style.height = "100%";
				html.style.width = "100%";
				html.style.overflow = "hidden";
			}
			
			if (!doc.getElementById("G_ModalWindowOverlay")) {
				body.appendChild(overlay);
				body.appendChild(modalBody);
				overlay.onclick = function() {
					t.hide();
				}
				overlay.setAttribute("id", "G_ModalWindowOverlay");
				overlay.setAttribute("class", "onstart")
				modalBody.setAttribute("id", "G_ModalWindowBody");
				modalBody.style.opacity = 0;
				
				setTimeout(function() {
					overlay.style.opacity = 0.5;
				}, 2);
				
				if (this.UA.browser === "msie" && this.UA.version <= 8) {
					overlay.style.top = "0";
					overlay.style.left = "0";
					overlay.style.width = "100%";
					overlay.style.height = "100%";
					overlay.style.backgroundColor = "#000";
					overlay.style.zIndex = "1000";
					overlay.style.filter = "progid:DXImageTransform.Microsoft.Alpha(enabled=1,opacity=50)";
				}
				
				if (this.UA.browser === "msie" && this.UA.version < 7) {
					overlay.style.position = "absolute";
				}
			}
			
			
		} catch (event) {
			// nothing here
		}
		
		this._currentGroup = imageGroup;
		this.show(caption, url, imageGroup);
	},
	
	
	show: function(caption, url, imageGroup) {
		
		var t = this;
		var p = this.prototype;
		
		var body = document.getElementsByTagName("body")[0];
		var img = document.createElement("img");
		var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
		var urlType = "";
		var baseURL = "";
		var pagesize = p.getPageSize();
		var windowWidth = pagesize[2];
		var windowHeight = pagesize[3];
		var G_ModalWindowImageGroupArray;
		var groupLength = 0;
		
		this._indicatorContainer.setAttribute("id", "G_ModalWindowIndicatorContainer");
		
		
		try {
			
			if (caption === null) caption = "";
			
			body.appendChild(this._indicatorContainer);
			this._indicatorContainer.style.position = "fixed";
			this._indicatorContainer.style.left = parseInt((windowWidth / 2) - (this._indicator.width / 2)) + "px";
			this._indicatorContainer.style.top = parseInt((windowHeight / 2) - (this._indicator.height / 2)) + "px";
			this._indicatorContainer.appendChild(img);
			
			img.setAttribute("src", this._indicator.src);
			img.setAttribute("id", "G_indicator");
			
			if (this.UA.browser === "msie" && this.UA.version === 6) {
				this._indicatorContainer.style.position = "absolute";
			}
			
			if (url.indexOf("?") !== -1) {
				baseURL = url.substr(0, url.indexOf("?"));
				
			} else { 
				baseURL = url;
			}
			
			this._image.style.visibility = "hidden";
			this._body.setAttribute("class", "");
			this._isResize = true;
			
			urlType = baseURL.toLowerCase().match(urlString);
			
			if (urlType == ".jpg" || urlType == ".jpeg" || urlType == ".png" || urlType == ".gif") {
				
				this._defPadding = 30;
				
				// image file
				if (imageGroup) {
					
					this.G_ModalWindowImageGroupArray = p.getElementsByRelationName(imageGroup, document.getElementsByTagName("body")[0]);
					groupLength = this.G_ModalWindowImageGroupArray.length;
					
					if (groupLength > 1) {
						for (var i = 0; i < groupLength; i++) {
							if (this.G_ModalWindowImageGroupArray[i].getAttribute("href") === url) {
								
								// between
								if (i > 0 && i < groupLength - 1) {
									this.addPageNavigation("next");
									this.addPageNavigation("prev");
									this._prevCaption = this.G_ModalWindowImageGroupArray[i - 1].getAttribute("title") || null;
									this._nextCaption = this.G_ModalWindowImageGroupArray[i + 1].getAttribute("title") || null;
									this._prevURL = this.G_ModalWindowImageGroupArray[i - 1].getAttribute("href") || "";
									this._nextURL = this.G_ModalWindowImageGroupArray[i + 1].getAttribute("href") || "";
									
								// last
								} else if (i === groupLength - 1) {
									this.addPageNavigation("prev");
									this._prevCaption = this.G_ModalWindowImageGroupArray[i - 1].getAttribute("title") || null;
									this._prevURL = this.G_ModalWindowImageGroupArray[i - 1].getAttribute("href") || "";
									
								// first
								} else if (i === 0) {
									this.addPageNavigation("next");
									this._nextCaption = this.G_ModalWindowImageGroupArray[i + 1].getAttribute("title") || null;
									this._nextURL = this.G_ModalWindowImageGroupArray[i + 1].getAttribute("href") || "";
								}
								
								this._currentNum = groupLength + " of " + (i + 1) + " Images";
								
								break;
							}
						}
					}
				}
				
				var imgPreloader = new Image();
				
				imgPreloader.onload = function () {
					t.onload("image", {obj:img, loader:imgPreloader, src:url, caption:caption});
					imgPreloader.onload = null;
				}
				imgPreloader.src = url;
				
			} else {
				
				var queryString = url.replace(/^[^\?]+\??/,'');
				var params = p.getQuerystring( queryString );
				
				this._defWidth = params["width"] * 1 || 500;
				this._defHeight = params["height"] * 1 || 400;
				this._defPadding = 0;
				this._isResize = parseInt(params["resize"]) || 1;
				
				this._body.style.paddingTop = 0;
				this._body.style.opacity = 0;
				this._body.style.visibility = "hidden";
				
				this._fullscreen = params["fs"] || false;
				this._isResize = isNaN(parseInt(params["resize"])) ? 1 : parseInt(params["resize"]);
				this._isIframe = parseInt(params["iframe"]) || 0;
				
				// iframe
				if (this._isIframe) {
					
					this._iFrame.setAttribute("frameborder", "0");
					this._iFrame.setAttribute("vspace", "0");
					this._iFrame.setAttribute("hspace", "0");
					this._iFrame.setAttribute("src", url);
					this._iFrame.setAttribute("id", "G_ModalWindowIFrame");
					this._iFrame.setAttribute("name", "G_ModalWindowIFrame" + Math.round(Math.random() * 1000));
					this._iFrame.setAttribute("onload", "ModalWindow.onload('iframe')");
					this._iFrame.style.width = this._defWidth + "px";
					this._iFrame.style.height = this._defHeight + "px";
					
					this._body.appendChild(this._iFrame);
					this._body.appendChild(this._caption);
					
					this.resize();
					
					if (this.UA.browser === "msie" && this.UA.version <= 7) {
						this._iFrame.onreadystatechange = function () {
							if (this.readyState === "complete") {
								t.onload("iframe");
								this.onreadystatechange = null;
							}
						}
						if (UA.version === 6) {
							this._body.style.position = "absolute";
						}
					}
					
				// Ajax content
				} else {
					
					this._httpRequest = false;
					
					if (window.XMLHttpRequest) {
						this._httpRequest = new XMLHttpRequest();
						if (this._httpRequest.overrideMimeType) {
							this._httpRequest.overrideMimeType("text/xml");
						}
					// IE
					} else if (window.ActiveXObject) {
						try {
							this._httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
						} catch (e) {
							this._httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
						}
					}
					
					// HTTP method
					if (url.indexOf("method=post") < 0) {
						this._httpRequest.open("GET", url, true);
						this._httpRequest.send(null);
						
					} else {
						this._httpRequest.open("POST", url, true);
						this._httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						this._httpRequest.send(url);
						
					}
					
					this._httpRequest.onreadystatechange = function () {
						if (t._httpRequest.readyState === 4) {
							if (t._httpRequest.status === 200) {
								// Success
								t.onload("ajax", t._httpRequest.responseText);
							} else {
								// Error
								t._httpRequest.abort();
							}
						}
					}
				}
			}
			
			document.onkeyup = function (event) {
				
				var keycode;
				
				if (event === null) {
					keycode = event.keyCode;
					
				} else {
					keycode = event.which;
				}
				// Esc key
				if (keycode === 27) {
					t.hide();
				}
			}
			
		} catch(event) {
			// nothing here
		}
	},
	
	onload: function(type, data) {
		
		var t = this;
		var body;
		
		this._body.style.opacity = 1;
		this._body.style.visibility = "visible";
		this._body.setAttribute("class", "onload-complete");
		
		// image
		if (type === "image") {
			this._indicatorContainer.removeChild(data.obj);
			document.getElementsByTagName("body")[0].removeChild(this._indicatorContainer);
			
			this._defWidth = data.loader.width;
			this._defHeight = data.loader.height;
			this._body.appendChild(this._image);
			this._body.appendChild(this._caption);
			this._body.style.position   = "fixed";
			this._body.style.display    = "block";
			this._body.style.paddingTop = this._defPadding + "px";
			this._body.style.textAlign  = "center";
			
			this._image.setAttribute("src", data.src);
			this._image.setAttribute("alt", data.caption);
			this._image.setAttribute("id", "G_ModalWindowImage");
			this._image.style.visibility = "visible";
			
			this._captionText = document.createTextNode(data.caption);
			this._caption.appendChild(this._captionText);
			this._caption.style.display = "block";
			
			if (this.UA.browser === "msie" && this.UA.version === 6) {
				this._body.style.position = "absolute";
			}
			
		// iframe
		} else if (type === "iframe") {
			this._body.style.textAlign  = "left";
			this._indicatorContainer.removeChild(document.getElementById("G_indicator"));
			document.getElementsByTagName("body")[0].removeChild(this._indicatorContainer);
			
		// AjaxContent
		} else if (type === "ajax") {
			this._body.appendChild(this._ajaxContent);
			this._body.appendChild(this._caption);
			this._ajaxContent.setAttribute("id", "G_ModalWindowAjaxContent");
			this._body.style.textAlign  = "left";
			this._indicatorContainer.removeChild(document.getElementById("G_indicator"));
			document.getElementsByTagName("body")[0].removeChild(this._indicatorContainer);
			
			body = data.replaceAll(/\n/,"").replaceAll(/\t/,"");
			body = body.replace(/<!DOCTYPE(.+)((<body+?>)|(<body.+?>))/, "").replace(/<\/body><\/html>/, "");
			this._ajaxContent.innerHTML = body;
		}
		
		this._body.appendChild(this._closeButton);
		this._closeButton.style.visibility = "visible";
		this._closeButton.onclick = function() {
			t.hide();
		}
		
		this.resize();
	},
	
	addPageNavigation: function(type) {
		
		var body = document.getElementsByTagName("body")[0];
		var pagesize = this.prototype.getPageSize();
		var windowWidth = pagesize[2];
		var windowHeight = pagesize[3];
		var t = this;
		
		if (type === "next") {
			body.appendChild(this._nextButton);
			this._nextButton.setAttribute("id","G_ModalWindowNext")
			this._nextButton.style.top = parseInt((windowHeight / 2) - (20)) + "px";
			this._nextButton.onclick = function() {
				t.gotoNext();
			}
		}
		
		if (type === "prev") {
			body.appendChild(this._prevButton);
			this._prevButton.setAttribute("id","G_ModalWindowPrev")
			this._prevButton.style.top = parseInt((windowHeight / 2) - (20)) + "px";
			this._prevButton.onclick = function() {
				t.gotoPrev();
			}
		}
	},
	
	gotoNext: function() {
		this.remove(true);
		this.open(this._nextCaption, this._nextURL, this._currentGroup);
	},
	
	gotoPrev: function() {
		this.remove(true);
		this.open(this._prevCaption, this._prevURL, this._currentGroup);
	},
	
	hide: function() {
		if (this.UA.browser === "msie" && this.UA.version < 10) {
			this.remove();
			
		} else {
			this._overlay.style.opacity = 0;
			this._body.style.opacity = 0;
		}
	},
	
	remove: function(bool) {
		
		var doc = document;
		var body = doc.getElementsByTagName("body")[0];
		var behindOverlay = bool || false;
		
		// image
		if (doc.getElementById("G_ModalWindowImage")) {
			this._image.setAttribute("src","");
			this._body.removeChild(this._image);
			this._caption.removeChild(this._captionText);
		}
		
		// iframe
		if (doc.getElementById("G_ModalWindowIFrame")) {
			this._body.removeChild(this._iFrame);
		}
		
		// ajax
		if (doc.getElementById("G_ModalWindowAjaxContent")) {
			this._body.removeChild(this._ajaxContent);
		}
		
		this._body.style.width = 0;
		this._body.style.height = 0;
		this._body.removeChild(this._caption);
		this._closeButton.onclick = null;
		this._closeButton.style.visibility = "hidden";
		if (!behindOverlay) {
			body.removeChild(this._body);
			body.removeChild(this._overlay);
		}
		
		if (doc.getElementById("G_ModalWindowCloseButton")) this._body.removeChild(this._closeButton);
		if (doc.getElementById("G_ModalWindowNext")) body.removeChild(this._nextButton);
		if (doc.getElementById("G_ModalWindowPrev")) body.removeChild(this._prevButton);
		if (doc.getElementById("G_indicator")) body.removeChild(this._indicatorContainer);
		
		doc.onkeydown = null;
		doc.onkeyup = null;
		
		//IE6 only
		if (this.UA.browser === "msie" && this.UA.version === 6) {
			doc.getElementsByTagName("body")[0].style.height = "auto";
			doc.getElementsByTagName("body")[0].style.width = "auto";
			doc.getElementsByTagName("html")[0].style.height = "auto";
			doc.getElementsByTagName("html")[0].style.width = "auto";
			doc.getElementsByTagName("html")[0].style.overflow = "auto";
		}
		
		return false;
	},
	
	resize: function() {
		
		var doc = document;
		
		if (doc.getElementById("G_ModalWindowBody")) {
			
			var pagesize = this.prototype.getPageSize();
			var windowWidth  = pagesize[2];
			var windowHeight = pagesize[3];
			var adjustW      = pagesize[2] - 100;
			var adjustH      = pagesize[3] - 250;
			var bodyWidth    = 0;
			var bodyHeight   = 0;
			var padding      = this._defPadding;
			var imageWidth   = this._defWidth;
			var imageHeight  = this._defHeight;
			
			if (this._isResize) {
				if (imageWidth > adjustW) {
					
					imageHeight = imageHeight * (adjustW / imageWidth); 
					imageWidth = adjustW; 
					
					if (imageHeight > adjustH) { 
						imageWidth = imageWidth * (adjustH / imageHeight); 
						imageHeight = adjustH; 
					}
					
				} else if (imageHeight > adjustH) { 
					
					imageWidth = imageWidth * (adjustH / imageHeight); 
					imageHeight = adjustH; 
					
					if (imageWidth > adjustW) { 
						imageHeight = imageHeight * (adjustW / imageWidth); 
						imageWidth = adjustW;
					}
				}
			}
			
			bodyWidth = imageWidth + (padding * 2);
			bodyHeight = imageHeight + (padding * 2);
			
			
			if (this._fullscreen) {
				
				var iw = document.documentElement.clientWidth;
				var ih = document.documentElement.clientHeight;
				
				//var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				//var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; 
				
				this._body.style.top = 0;
				this._body.style.left = 0;
				
				this._body.style.width = iw + "px";
				this._body.style.height = ih + "px";
				
				
				
				if (this._iFrame) {
					this._iFrame.style.width = iw + "px";
					this._iFrame.style.height = ih + "px";
				}
				
			} else {
				
				this._body.style.top = parseInt((windowHeight >> 1) - (bodyHeight >> 1) - (padding >> 1)) + "px";
				this._body.style.left = parseInt((windowWidth >> 1) - (bodyWidth >> 1)) + "px";
				
				this._body.style.width = bodyWidth + "px";
				this._body.style.height = bodyHeight + "px";
				
				
				if (windowHeight < bodyHeight) {
					var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
					this._body.style.position = "absolute";
					this._body.style.top = (scrollTop + 50) + "px";
					
				} else {
					this._body.style.position = "fixed";
					
				}
			}
			
			if (this._isResize) {
				this._image.style.width = imageWidth + "px";
				this._image.style.height = imageHeight + "px";
			}
			
			if (doc.getElementById("G_ModalWindowNext")) {
				this._nextButton.style.top = parseInt((windowHeight >> 1) - (20)) + "px";
			}
			
			if (doc.getElementById("G_ModalWindowPrev")) {
				this._prevButton.style.top = parseInt((windowHeight >> 1) - (20)) + "px";
			}
		}
	}
};


/* ---------------------------------------------------------------------------------------------- */


ModalWindow.prototype = {
	ua: navigator.userAgent.toLowerCase()
};

ModalWindow.prototype.UA = {
	
	os: (function(a) {
		var o;
		if (a.ua.indexOf("win") > -1) {
			o = "win";
		} else if (a.ua.indexOf("mac") > -1) {
			o = "mac";
		} else if (a.ua.indexOf("linux") > -1) {
			o = "linux";
		} else {
			o = "other";
		}
		return o;
	})(ModalWindow.prototype),
	
	browser: (function(a) {
		if (a.ua.indexOf("msie") > -1 || a.ua.indexOf("trident") > -1) {
			b = "msie";
		} else if (a.ua.indexOf("firefox") > -1) {
			b = "firefox";
		} else if (a.ua.indexOf("safari") > -1 && a.ua.indexOf("chrome") == -1) {
			b = "safari";
		} else if (a.ua.indexOf("chrome") > -1) {
			b = "chrome";
		} else {
			b = "other";
		}
		return b;
	})(ModalWindow.prototype),
	
	version: (function(a) {
		var v;
		if (a.ua.indexOf("msie") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("msie") + 5));
		} else if (a.ua.indexOf("trident") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("rv") + 3));
		} else if (a.ua.indexOf("firefox") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("firefox") + 8));
		} else if (a.ua.indexOf("safari") > -1 && a.ua.indexOf("chrome") == -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("version") + 8));
		} else if (a.ua.indexOf("chrome") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("chrome") + 7));
		} else {
			v = undefined;
		}
		return v;
	})(ModalWindow.prototype),
	
	device: (function(a) {
		var d;
		if (a.ua.indexOf("iphone") > -1) {
			d = "iphone";
		} else if (a.ua.indexOf("ipod") > -1) {
			d = "ipod";
		} else if (a.ua.indexOf("ipad") > -1) {
			d = "ipad";
		} else if (a.ua.indexOf("android") > -1) {
			d = a.ua.indexOf("mobile") > -1 ? "android_mobile" : "android_tablet";
		} else {
			d = "other";
		}
		return d;
	})(ModalWindow.prototype)
}


// IE only
ModalWindow.prototype.msieGetElementsByClassName = function(classNameString, targetObject) {
	
	var element = targetObject;
	var array = new Array();
	var target;
	
	if (element === undefined || element === "") element = document;
	
	target = element.all;
	
	if (document.all) {
		for (i = 0, j = 0; i < target.length; i++) {
			if (target[i].className === classNameString) {
				array[j] = target[i];
				j++;
			}
		}
	}
	return array;
}


ModalWindow.prototype.getElementsByRelationName = function(relNameString, targetObject) {
	
	var array = new Array();
	var tags = new Array();
	var i, j, l;
	
	// IE only
	document.all ? tags = targetObject.all : tags = targetObject.getElementsByTagName("*");
	
	l = tags.length;
	
	for (i = 0, j = 0; i < l; i++) {
		if (tags[i].getAttribute("rel") == relNameString) {
			array[j] = tags[i];
			j++;
		}
	}
	return array;
}


ModalWindow.prototype.getPageSize = function() {
	
	var xScroll, yScroll, windowWidth, windowHeight, pageWidth, pageHeight, arraySizes;
	
	// Gecko
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
		
	// Webkit, IE(Standards mode)
	} else if (document.body.scrollHeight > document.body.offsetHeight) {
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
		
	// Other IE
	} else {
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	
	// not IE
	if (window.innerHeight) {
		windowWidth  = window.innerWidth;
		windowHeight = window.innerHeight;
		
	// IE(Standards mode)
	} else if (document.documentElement.clientHeight && document.documentElement) {
		windowWidth  = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
		
	// Other IE
	} else if (document.body) {
		windowWidth  = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	
	yScroll < windowHeight ? pageHeight = windowHeight : pageHeight = yScroll;
	xScroll < windowWidth  ? pageWidth  = windowWidth  : pageWidth  = xScroll;
	
	arraySizes = [pageWidth, pageHeight, windowWidth, windowHeight];
	
	return arraySizes;
}


ModalWindow.prototype.getTransitionEndType = function() {
	
	var e, t, i;
	
	e = document.createElement("div"); // Dummy element
	t = {
		"WebkitTransition" : "webkitTransitionEnd",
		"transition" : "transitionend"
	}
	
	for (i in t) {
		if (typeof e.style[i] !== "undefined") {
			e = null;
			return t[i];
		}
	}
}


ModalWindow.prototype.getQuerystring = function(string) {
	
	var query, ary, len, i, p;
	
	query = new Object();
	ary = string.split("&");
	len = ary.length;
	
	for (i = 0; i < len; i++) {
		p = ary[i].split("=");
		query[p[0]] = p[1];
	}
	
	return query;
}


String.prototype.replaceAll = function(org, dest) {
	return this.split(org).join(dest);  
}



/* ---------------------------------------------------------------------------------------------- */



/* 
 * DOM Content Ready 
 */
 
GAS_MODAL = ModalWindow;

(function(obj) {
	
	/* DOMContentLoaded */
	
	// http://javascript.nwbox.com/IEContentLoaded/
	
	// Safari, Chrome, Firefox
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", function() {
			obj.init();
		}, false);
		
	// IE
	} else if (document.attachEvent) {
		document.attachEvent("onreadystatechange", function () {
			if (document.readyState === "complete") {
				document.detachEvent("onreadystatechange", arguments.callee);
				obj.init();
			}
		});
		
		if (document.documentElement.doScroll && window == window.top) {
			(function() {
				try {
					document.documentElement.doScroll("left");
				} catch( error ) {
					setTimeout( arguments.callee, 0 );
					return;
				}
				obj.init();
			})();
		}
	}
})(GAS_MODAL);
