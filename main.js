
var wctrl = null;
var gminloc = null;
var gmp = null;
var pit = null;
var ssv = null;
var psv = null;
var mapV = null;

var page_loaded_now = true;

$(document).ready(function(){
	
	wctrl = new WalkingControlls();

	gminloc = new GM_inputLocations( wctrl );
	gminloc.init();
	
	gmp = new GM_Points();
	pit = new PointIterator( gmp );
	mapV = new mapView( gmp, pit );
	ssv = new static_streetView( gmp, pit, wctrl, mapV );
	psv = new panorama_streetView( gmp, pit, wctrl, mapV );
	
	MAIN_INIT();
	
	
	$(wctrl.nextStep.btn).click(function(){
		if (wctrl.panoramaMode.state){
			psv.next();
		}
		else{
			ssv.animAllowed = true;
			ssv.next_img(null);
		}
	});
	$(wctrl.prevStep.btn).click(function(){
		if (wctrl.panoramaMode.state){
			psv.prev();
		}
		else{
			ssv.animAllowed = true;
			ssv.prev_img(null);
		}
	});
	
	$(wctrl.playPause.btn).click(function(){
		if (wctrl.getState() == "PLAY"){
			ssv.pause();
			wctrl.panoramaMode.enable();
		}
		else{
			ssv.play();
			wctrl.panoramaMode.disable();
		}
	});
	$(wctrl.stop.btn).click(function(){
		wctrl.panoramaMode.enable();
		if (wctrl.panoramaMode.state) psv.restart();
		else ssv.stop();
	});
	
	$(".timeLineDiv").find(".progress").click(function(e){
		
		var parentOffset = $(this).parent().offset(); 
		var relX = e.pageX - parentOffset.left;
		var totalWidth = parseFloat( $(this).parent().css("width") );
		var prog = Math.round( 100*relX/totalWidth );
		
		var new_i = parseInt(prog*pit.end()/100);
		new_i = (new_i < 0)? 0 : new_i;
		new_i = (new_i > pit.end()-1)? pit.end()-1 : new_i;
		
		pit.set(new_i);
		if (wctrl.panoramaMode.state){
			psv.show();
		}else{
			ssv.show_img();
		}
		
	});
	
	$(wctrl.frameDuration.slider).change(function(){
		var interuptedPlaying = false;
		
		if (wctrl.getState() == "PLAY"){
			interuptedPlaying = true;
			wctrl.playPause.pause();
		}
		ssv.frameDuration = wctrl.frameDuration.calculate();
		ssv.transSpeed = wctrl.transSpeed.calculate();
		
		if (interuptedPlaying) wctrl.playPause.play();
	});
	
	$(wctrl.panoramaMode.btn).click(function(){
		wctrl.panoramaMode.toggle(
			function(){ // turned ON
				wctrl.playPause.disable();
				ssv.hide_all();
				psv.show();
			},
			function(){ // turned OFF
				wctrl.playPause.enable();
				psv.hide();
				if (ssv.no_images()) ssv.load_imgs();
				ssv.show_img();
			}
		);
	});
	
	$(wctrl.pointAin.input).change(function(){
		gminloc.validateA();
	})
	.on("keyup", function(e){
		if (e.keyCode == 13) $(this).change();
	})
	.focus(function(){
		//~ gminloc.geolocate( gminloc.autocomplete_A );
	});
	$(wctrl.pointBin.input).change(function(){
		gminloc.validateB();
	})
	.on("keyup", function(e){
		if (e.keyCode == 13) $(this).change();
	})
	.focus(function(){
		//~ gminloc.geolocate( gminloc.autocomplete_A );
	});
	
	//~ $(wctrl.flipAB.btn).click(function(){
		//~ gminloc.flipAB();
	//~ });
	
	$(wctrl.resetMap.btn).click(function(){
		mapV.fix_View();
	});
	
	$(wctrl.getRoute.btn).click(function(){
		
		gminloc.triggerChangeA();
		gminloc.triggerChangeB();
		
		// calling .addressA() calls .validateA()
		var adrA = gminloc.addressA();
		var adrB = gminloc.addressB();
		
		//~ alert( adrA +"\n"+ adrB );
		
		var cond1 = adrA && adrB;
		var cond2 = adrA != adrB;
		var cond3 = gminloc.inputA_valid && gminloc.inputB_valid;
		
		if (cond1 && cond2 && cond3){
			MAIN_INIT();
			
			wctrl.playPause.enable();
			wctrl.stop.enable();
			wctrl.panoramaMode.enable();
			wctrl.resetMap.enable();
			
			get_directions( "DRIVING", gminloc.addressA(), gminloc.addressB() );
		}
		else alert("Invalid A or B");
	});
	
});

function MAIN_INIT(){
	
	if (page_loaded_now) page_loaded_now = false;
	//~ else return;
	
	mapV.clear();
	psv.clear();
	ssv.clear();
	
	wctrl.playPause.init();
	wctrl.playPause.disable();
	wctrl.stop.disable();
	wctrl.panoramaMode.disable();
	wctrl.resetMap.disable();
	
	gmp.init();
	pit.init();
	ssv.init();
	
	$(wctrl.frameDuration.slider).val(80).change();
}

function get_directions( mode, start, finish ){
	var directionsService = new google.maps.DirectionsService();
	directionsService.route({
		origin: start,
		destination: finish,
		travelMode: mode
	}, 
	function(response, status){
		if (status == google.maps.DirectionsStatus.OK) {
			
			gmp.populate_locations( response ); // location_pts & distances
			gmp.regulate_points();
			
			pit.init();
			
			mapV.init();
			mapV.fill_pts().fix_View().draw_route(response).set_currMarker();
			
			if (wctrl.panoramaMode.state){
				psv.init();
			}
			else{
				ssv.load_imgs();
				ssv.show_img();
			}
			wctrl.prevStep.disable();
		}
		else{
			alert(" Error: "+status);
		}
	});
}

