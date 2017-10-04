
function GM_inputLocations( wctrl ){
	
	this.inputA_valid = false;
	this.inputB_valid = false;
	
	this.autocomplete_A = null;
	this.autocomplete_B = null;
	
	this.placeA = null;
	this.placeB = null;
	
	this.init = function(){
		
		this.inputA_valid = false;
		this.inputB_valid = false;
		
		this.placeA = null;
		this.placeB = null;
		
		this.autocomplete_A = new google.maps.places.Autocomplete(
			document.getElementById( wctrl.pointAin.inputID ),
			{ types: [] }
		);
		this.autocomplete_B = new google.maps.places.Autocomplete(
			document.getElementById( wctrl.pointBin.inputID ),
			{ types: [] }
		);
		
		var self = this;
		google.maps.event.addListener(
		this.autocomplete_A, "place_changed", function() {
			self.validateA();
			//~ console.log( self.placeA["formated_location"] );
		});
		google.maps.event.addListener(
		this.autocomplete_B, "place_changed", function() {
			self.validateB();
			//~ console.log( self.placeB["formated_location"] );
		});
	};
	
	this.validateA = function(){
		var place = undefined;
		if ($(wctrl.pointAin.input).val() != "")
			place = this.autocomplete_A.getPlace();
		
		if (place && place.geometry){
			this.inputA_valid = true;
			wctrl.pointAin.setValid( this.inputA_valid);
			this.placeA = place;
		}
		else {
			this.inputA_valid = false;
			wctrl.pointAin.setValid( this.inputA_valid);
			this.placeA = null;
		}
	};
	this.validateB = function(){
		var place = undefined;
		if ($(wctrl.pointBin.input).val() != "")
			place = this.autocomplete_B.getPlace();
		
		if (place && place.geometry){
			this.inputB_valid = true;
			wctrl.pointBin.setValid( this.inputB_valid);
			this.placeB = place;
		}
		else {
			this.inputB_valid = false;
			wctrl.pointBin.setValid( this.inputB_valid);
			this.placeB = null;
		}
	};
	
	this.addressA = function(){
		this.validateA();
		if (this.inputA_valid) 
			return ""+this.placeA["formatted_address"];
		else return "";
	};
	this.addressB = function(){
		this.validateB();
		if (this.inputB_valid) 
			return ""+this.placeB["formatted_address"];
		else return "";
	};
	
	//~ this.flipAB = function(){
		//~ 
		//~ var a = ""+ $(wctrl.pointAin.input).val();
		//~ var b = ""+ $(wctrl.pointBin.input).val();
		//~ 
		//~ if (a != "" || b != ""){
			//~ $(wctrl.pointAin.input).val(b);
			//~ $(wctrl.pointBin.input).val(a);
			//~ 
			//~ var tmp = this.placeA;
			//~ this.placeA = this.placeB;
			//~ this.placeB = tmp;
			//~ 
			//~ var foo = $(".pac-container .pac-item:first").text();
			//~ alert( typeof foo );
			//~ 
			//~ this.triggerChangeA();
			//~ this.triggerChangeB();
		//~ }
	//~ }
	
	this.triggerChangeA = function(){
		google.maps.event.trigger(this.autocomplete_A, "place_changed");
	};
	this.triggerChangeB = function(){
		google.maps.event.trigger(this.autocomplete_B, "place_changed");
	};
	
	// not used
	// Bias the autocomplete object (for inputDOM) to the user's geographical location,
	// as supplied by the browser's 'navigator.geolocation' object.
	this.geolocate = function(inputDOM) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});
				inputDOM.setBounds(circle.getBounds());
			});
		}
	};
	
};
