
function mapView( gmp, pit ){
	
	this.mapDiv = "mapView";
	this.map = null;
	this.dirsDisplay = null;
	
	this.pts = [];
	this.curr_marker = null;
	
	this.clear = function(){
		this.map = null;
		this.dirsDisplay = null;
		
		this.pts = [];
		this.curr_marker = null;
		
		$("#"+this.mapDiv).html("");
	};
	
	this.init = function(){
		this.map = new google.maps.Map(
			document.getElementById(this.mapDiv),
			{ zoom: 4, center: null }
		);
		
		this.dirsDisplay = new google.maps.DirectionsRenderer();
		this.dirsDisplay.setMap( this.map );
		
		return this;
	};
	
	this.fill_pts = function(){
		this.pts = [];
		for (var i in gmp.location_pts){
			this.pts.push( new google.maps.LatLng( 
				gmp.location_pts [i][0], 
				gmp.location_pts [i][1] 
			));
		}
		return this;
	};
	
	this.fix_View = function(){
		if (this.pts == null || this.pts.length == 0) return this;
		
		var bounds = new google.maps.LatLngBounds();
		for (var i in this.pts){
			bounds.extend( this.pts[i] );
		}
		this.map.fitBounds(bounds);
		this.map.setCenter(bounds.getCenter());
		//~ this.map.setZoom(this.map.getZoom()+1);
		return this;
	};
	
	this.draw_route = function( response ){
		this.dirsDisplay.setDirections( response );
		this.curr_marker = new google.maps.Marker({
			position: this.pts [pit.i], map: this.map
		});
		return this;
	};
	
	this.set_currMarker = function(){
		if (this.pts == null || this.pts.length == 0) return;
		this.curr_marker.setPosition( this.pts [pit.i] );		
		return this;
	};
	
};
