
function panorama_streetView( gmp, pit, wctrl, mapV ){
	
	this.panorama = null;
	
	this.clear = function(){
		this.panorama = null;
	};
	
	this.init = function(){
		
		if (this.panorama == null){
			this.panorama = new google.maps.StreetViewPanorama(
				document.getElementById('street-view'),
				{ zoom: 0.5 }
			);
		}
		this.panorama.setPov({
			heading: gmp.headings [pit.i],
			pitch: 10
		});
		this.panorama.setPosition({
			lat: gmp.location_pts [pit.i][0], 
			lng: gmp.location_pts [pit.i][1]
		});
		this.hide();
	};
	
	this.show = function(){
		this.init();
		this.panorama.setVisible(true);
		
		if (pit.i >= pit.end()-1) wctrl.nextStep.disable();
		else wctrl.nextStep.enable();
		
		if (pit.i <= 0) wctrl.prevStep.disable();
		else wctrl.prevStep.enable();
		
		if (mapV) mapV.set_currMarker();
	};
	this.hide = function(){
		this.panorama.setVisible(false);
	};
	
	this.next = function(){
		pit.next();
			
		if (pit.i >= pit.end()-1) wctrl.nextStep.disable();
		else wctrl.nextStep.enable();
		wctrl.prevStep.enable();
	
		if (pit.i > pit.end()-1) return;
		
		this.panorama.setPov({
			heading: gmp.headings [pit.i],
			pitch: 10
		});
		this.panorama.setPosition({
			lat: gmp.location_pts [pit.i][0], 
			lng: gmp.location_pts [pit.i][1]
		});
		
		if (mapV) mapV.set_currMarker();
	};
	
	this.prev = function(){
		pit.prev();
		
		if (pit.i <= 0) wctrl.prevStep.disable();
		else wctrl.prevStep.enable();
		wctrl.nextStep.enable();
		
		if (pit.i < 0) return;
		
		this.panorama.setPov({
			heading: gmp.headings [pit.i],
			pitch: 10
		});
		this.panorama.setPosition({
			lat: gmp.location_pts [pit.i][0], 
			lng: gmp.location_pts [pit.i][1]
		});
		
		if (mapV) mapV.set_currMarker();
	};
	
	this.restart = function(){
		this.hide();
		pit.init();
		this.show();
	};
	
};
