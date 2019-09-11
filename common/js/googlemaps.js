
var addGoogleMap = function ( lat, lng, element, z, w, h, ms, ss ) {
	try {
		var domain = "/";
		var _elem, _z, _w, _h, _ms, _ss;
		var _style, _icon, _shadow, _label, _latlng, _map, _center;
		
		element ? _elem = element : _elem = "canvas";
		z ? _z = z : _z = 15;
		w ? _w = w : _w = $( "#" + _elem ).parent().width();
		h ? _h = h : _h = $( "#" + _elem ).parent().height();
		ms ? _ms = ms : _ms = [20 , 34, "http://maps.gstatic.com/mapfiles/markers/marker.png"];
		ss ? _ss = ss : _ss = [37 , 34, "http://maps.gstatic.com/mapfiles/markers/shadow50.png"];
		_elem = document.getElementById(_elem);
		
		var Marker = function ( lat, lng ) {
			var m;
			_latlng = new google.maps.LatLng( lat, lng );
			_icon   = new google.maps.MarkerImage( _ms[2], new google.maps.Size(_ms[0], _ms[1]), new google.maps.Point(0,0), new google.maps.Point(_ms[0]/2, _ms[1]));
			_shadow = new google.maps.MarkerImage( _ss[2], new google.maps.Size(_ss[0], _ss[1]), new google.maps.Point(0,0), new google.maps.Point(_ms[0]/2, _ss[1]));
			
			m = new google.maps.Marker({position: _latlng, map: _map, icon:_icon, shadow:_shadow, draggable:false, animation:google.maps.Animation.DROP});
			
			return m;
		}
		
		function addMarker() {
			var m = new Marker( lat, lng );
		}
		
		if ( typeof document.body.style.maxHeight != "undefined" ) {
			
			_elem.style.width = _w + "px";
			_elem.style.height = _h + "px";
			_label  = "Map";
			_style  = [ { "featureType": "road", "elementType": "geometry.fill", "stylers": [ { "color": "#c8c8c8" } ] },{ "featureType": "road", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "simplified" } ] },{ "featureType": "road", "elementType": "labels.text", "stylers": [ { "color": "#ffffff" } ] },{ "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "visibility": "on" }, { "color": "#bed2d2" } ] },{ "featureType": "landscape.natural", "stylers": [ { "color": "#ffffff" } ] } ]
			
			_center = new google.maps.LatLng( lat, lng );
			_map    = new google.maps.Map( _elem, {mapTypeControlOptions: { mapTypeIds: [_label, google.maps.MapTypeId.SATELLITE]}, zoom: _z, center: _center, scaleControl: true, navigationControl: true, mapTypeId: _label, scrollwheel: false } );
			_map.mapTypes.set( _label, new google.maps.StyledMapType( _style, { name: _label } ) );
			
			setTimeout(addMarker, 100);
		}
		
	} catch (e) {
		alert(e)
	}
}
