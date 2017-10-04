
/*
 * public   void    populate_locations( data );
 * private  Marker  to_Marker( point );
 * public   void    calculate_distances();
 * public   void    calculate_headings();
 * private  Point   gen_Point( p1, p2, distance );
 * public   void    regulate_points();
 */
function GM_Points(){
	
	this.location_pts = [];
	this.headings = [];
	this.distances = [];
	
	this.init = function(){
		this.location_pts = [];
		this.headings = [];
		this.distances = [];
	};
	
	this.populate_locations = function( data ){
		var steps = data['routes'][0]['legs'][0]['steps'];
		
		this.location_pts = [];
		var pts = {};
		
		for (var i=0; i < steps.length; i++){
			pts = polyline.decode( steps[i]['polyline']['points'] );
			for (p in pts)
				this.location_pts.push( [pts[p][0], pts[p][1]] );
		}
		
		var endLatLng = data["routes"][0]["legs"][0]["end_location"];
		var tmp = JSON.parse(JSON.stringify( endLatLng ));
		var endPt = [tmp.lat, tmp.lng];
		
		this.location_pts.push(endPt);
		
		this.calculate_distances();
		//~ this.calculate_headings(); // no need here
	};
	
	// private
	this.to_Marker = function( point ){
		return new google.maps.Marker({
			position:{ lat: point[0], lng: point[1] }
		});
	};
	
	this.calculate_distances = function(){
		this.distances = [];
		var d = 0;
		var m1, m2;	
		for (var p=0; p < this.location_pts.length-1; p++){
			m1 = this.to_Marker( this.location_pts[ p ] );
			m2 = this.to_Marker( this.location_pts[ p+1 ] );
			d = google.maps.geometry.spherical.computeDistanceBetween(
				m1.getPosition(), m2.getPosition()
			);
			this.distances.push(d);
		}
	};

	this.calculate_headings = function(){
		this.headings = [];
		var h = 0;
		var m1, m2;		
		for (var p=0; p < this.location_pts.length-1; p++){
			m1 = this.to_Marker( this.location_pts[ p ] );
			m2 = this.to_Marker( this.location_pts[ p+1 ] );
			h = google.maps.geometry.spherical.computeHeading(
				m1.getPosition(), m2.getPosition()
			);
			this.headings.push(h);
		}
		this.headings.push( this.headings[this.headings.length-1] );
	};
	
	// (private) returns point: p1 + distance (on the line p1---p2)
	this.gen_Point = function( p1, p2, distance) {
		function toRad(x){ return x*(Math.PI/180); }
		function toDeg(x){ return x*(180/Math.PI); }
		
		var lat1 = toRad(p1[0]);
		var lon1 = toRad(p1[1]);
		var lat2 = toRad(p2[0]);
		var lon2 = toRad(p2[1]);         
		var dLon = toRad(p2[1] - p1[1]);
		
		// Find the bearing from this point to the next.
		var brng = Math.atan2(
			Math.sin(dLon) * Math.cos(lat2),
			Math.cos(lat1) * Math.sin(lat2) -
			Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
		);
		
		var angDist = distance / 6371000;  // Earth's radius.
		
		// Calculate the destination point, given the source and bearing.
		lat2 = Math.asin(
			Math.sin(lat1) * Math.cos(angDist) + 
			Math.cos(lat1) * Math.sin(angDist) * Math.cos(brng)
		);
		
		lon2 = lon1 + Math.atan2(
			Math.sin(brng) * Math.sin(angDist) * Math.cos(lat1), 
			Math.cos(angDist) - Math.sin(lat1) * Math.sin(lat2)
		);
		
		if (isNaN(lat2) || isNaN(lon2)) return null;
		
		return [toDeg(lat2), toDeg(lon2)];
	};
	
	this.regulate_points = function(){
		function get_avg( arr ){
			var sum = 0;
			for (i in arr) sum += arr[i];
			var avg = sum/arr.length;
			return avg;
		}
		var avg = get_avg( this.distances );
		
		//~ // remove very small distances
		//~ for (var i=0; i < this.distances.length;){
			//~ if (this.distances[i] <= 0.1*avg){
				//~ this.location_pts.splice( i+1, 1);
				//~ this.headings.splice( i, 1);
				//~ this.distances.splice( i, 1);
			//~ }
			//~ else i++;
		//~ }
		
		avg = get_avg( this.distances );
		
		// add new points in long empty spaces
		var new_location_pts = [];
		var nof_pts_2add = 0;
		
		for (var i=0; i < this.distances.length; i++){
			
			new_location_pts.push( this.location_pts[i] );
			nof_pts_2add = parseInt( this.distances[i]/(1*avg) );
			
			if (nof_pts_2add > 1){		
				var dstep = this.distances[i]/nof_pts_2add;
				var new_pt = this.location_pts[i];
				
				for (var p=0; p < nof_pts_2add-1; p++){
					new_pt = this.gen_Point(
						this.location_pts[i], this.location_pts[i+1], (p+1)*dstep
					);
					new_location_pts.push( new_pt );
				}
			}
			
		}
		this.location_pts = new_location_pts;
		
		this.calculate_distances();
		this.calculate_headings();
	};
	
};

