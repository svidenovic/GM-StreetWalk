
function static_streetView( gmp, pit, wctrl, mapV ){
	
	//~ this.myGoogleAPIkey = "AIzaSyCoT18PzHMgmZDV6EkqQBEFRhS18DpBbZ4";
	this.myGoogleAPIkey = "AIzaSyB8-Tn0OWU9vwiqL6fPXvG4IQZNSfXcHww";
	
	this.transSpeed = 250;
	
	this.frameDuration = 500;
	
	this.playTimer = null;
	this.animAllowed = true;
	
	this.clear = function(){
		this.stop();
		this.playTimer = null;
		this.animAllowed = true;
		$("#street-view").html("");
	};
	
	this.init = function(){
		this.transSpeed = 250;
		this.frameDuration = 500;
		this.playTimer = null;
		this.animAllowed = true;
	};
	
	this.load_imgs = function(){
		
		var this_ssv = this;
		
		function gen_gm_url( pt, head=0, fov=90, pitch=10 ){
			var gm_url = "https://maps.googleapis.com/maps/api/streetview?size=600x400";
			gm_url += "&location="+pt[0]+","+pt[1];
			gm_url += "&pitch="+pitch;
			gm_url += "&key="+this_ssv.myGoogleAPIkey;
			
			if (fov != -1) gm_url += "&fov="+fov;
			if (head != -1) gm_url += "&heading="+head;
			
			return gm_url;
		}
		
		var gm_img = {};
		var gm_img_src = "";
		
		$("#street-view").html("");
		for (i in gmp.location_pts){
			gm_img = document.createElement("img");
			gm_img_src = gen_gm_url(
				gmp.location_pts[i], gmp.headings[i], 120
			);
			$(gm_img).attr("src", gm_img_src);
			$(gm_img).attr("class", "streetViewImg");
			$(gm_img).hide();
			$("#street-view").append( gm_img );
		}
	};
	
	this.no_images = function(){
		$("#street-view").children("img").each(function(i) { 
			return false;
		});
		return true;
	};
	
	this.show_img = function(){		
		var this_ssv = this;
		$("#street-view").children("img").each(function(i) { 
			if (i == pit.i) $(this).show();
			else $(this).hide();
		});
		
		if (mapV) mapV.set_currMarker();
		
		if (pit.i >= pit.end()-1) wctrl.nextStep.disable();
		else wctrl.nextStep.enable();
		
		if (pit.i <= 0) wctrl.prevStep.disable();
		else wctrl.prevStep.enable();
	};
	
	this.hide_all = function(){
		$("#street-view").children("img").each(function(i) { 
			$(this).hide();
		});
	};
	
	this.next_img = function( callback ){
		var this_ssv = this;
		
		if (this.animAllowed){
			
			pit.next();
			
			if (pit.i >= pit.end()-1) wctrl.nextStep.disable();
			else wctrl.nextStep.enable();
			wctrl.prevStep.enable();
		
			if (pit.i > pit.end()-1) return;
			
			var curr = null;
			var prev = null;
			$("#street-view").children("img").each(function(i) { 
				if (i == pit.i-1) prev = this;
				else if (i == pit.i) curr = this;
			});
		
			$(curr).fadeIn( this.transSpeed, function(){ 
				$(prev).hide(1, function(){
					callback && callback();
				});
			});
			
			if (mapV) mapV.set_currMarker();
		}
	};
	
	this.prev_img = function( callback ){
		var this_ssv = this;
		
		if (this.animAllowed){
			
			pit.prev();
			
			if (pit.i <= 0) wctrl.prevStep.disable();
			else wctrl.prevStep.enable();
			wctrl.nextStep.enable();
			
			if (pit.i < 0) return;
			
			var curr = null;
			var next = null;
			$("#street-view").children("img").each(function(i) { 
				if (i == pit.i) curr = this;
				else if (i == pit.i+1) next = this;
			});
		
			$(curr).show(1, function(){ 
				$(next).fadeOut(this.transSpeed, function(){
					callback && callback();
				});
			});
			
			if (mapV) mapV.set_currMarker();
		}
	};
	
	this.play = function(){
		var this_ssv = this;
		
		this.animAllowed = true;
		
		wctrl.playPause.play();
		
		if (pit.i >= pit.end()-1){
			pit.init();
			this.show_img();
		}
		
		function next_frame(){
			this_ssv.playTimer = setTimeout( 
				function(){
					this_ssv.next_img(function(){
						if (pit.i < pit.end()-1){
							next_frame();
						}
						else{
							wctrl.playPause.init();
							wctrl.panoramaMode.enable();
						}
					});
				}, 
				this_ssv.frameDuration
			);
		}
		next_frame();
	};
	
	this.pause = function(){
		this.animAllowed = false;
		wctrl.playPause.pause();
		clearTimeout( this.playTimer );
	};
	
	this.stop = function(){
		this.pause();
		pit.init();
		this.show_img();
		wctrl.playPause.init();
	}
	
};
