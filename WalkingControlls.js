
function WalkingControlls(){
	
	this.nextStep = {
		btn: "#next_btn",
		enable: function(){
			$(this.btn).prop("disabled",false);
		},
		disable: function(){
			$(this.btn).prop("disabled",true);
		}
	};
	
	this.prevStep = {
		btn: "#prev_btn",
		enable: function(){
			$(this.btn).prop("disabled",false);
		},
		disable: function(){
			$(this.btn).prop("disabled",true);
		}
	};
	
	var state = "IDLE"; // IDLE | PLAY | PAUSE
	this.getState = function(){ return state; }
	
	this.playPause = {
		btn: "#playpause_btn",
		
		init: function(){
			state = "IDLE";
			$(this.btn).find("span").attr("class","glyphicon glyphicon-play");
		},
		play: function(){
			if (state == "IDLE" || state == "PAUSE"){
				state = "PLAY";
				$(this.btn).find("span").attr("class","glyphicon glyphicon-pause");
			}
		},
		pause: function(){
			if (state == "PLAY"){
				state = "PAUSE";
				$(this.btn).find("span").attr("class","glyphicon glyphicon-play");
			}
		},
		enable: function(){
			$(this.btn).prop("disabled",false);
		},
		disable: function(){
			$(this.btn).prop("disabled",true);
		}
	};
	
	this.stop = {
		btn: "#stop_btn",
		enable: function(){
			$(this.btn).prop("disabled",false);
		},
		disable: function(){
			$(this.btn).prop("disabled",true);
		}
	};
	
	this.frameDuration = {
		slider: "#frameDuration",
		min: 0,
		max: 3000,
		calculate: function(){
			var sliderVal = parseFloat( $(this.slider).val() );
			return this.min + (1 -0.01*sliderVal)*(this.max - this.min);
		}
	};
	this.transSpeed = {
		slider: "#frameDuration",
		min: 50,
		max: 500,
		calculate: function(){
			var sliderVal = parseFloat( $(this.slider).val() );
			return this.min + (1 -0.01*sliderVal)*(this.max - this.min);
		}
	};
	
	
	this.panoramaMode = {
		btn: "#PanoramaModeBtn",
		state: false,
		
		init: function(){
			this.state = false;
			$(this.btn).find("span").html("OFF").attr("class","off");
		},
		turnOn: function(){
			this.state = true;
			$(this.btn).find("span").html("ON").attr("class","on");
		},
		turnOff: function(){
			this.state = false;
			$(this.btn).find("span").html("OFF").attr("class","off");
		},
		toggle: function( turnedOn_callback, turnedOff_callback ){
			if (this.state){
				this.turnOff();
				turnedOff_callback && turnedOff_callback();
			}
			else{
				this.turnOn();
				turnedOn_callback && turnedOn_callback();
			}
		},
		disable: function(){
			$(this.btn).prop("disabled", true);
		},
		enable: function(){
			$(this.btn).prop("disabled", false);
		}
	};
	
	this.pointAin = {
		label: "#PointAlabel",
		inputID: "pointAin",
		input: "#pointAin",
		setValid: function(valid){
			if (valid) $(this.label).css("color", "#8DC9FC");
			else $(this.label).css("color", "#9E9E9E");
		}
	};
	
	this.pointBin = {
		label: "#PointBlabel",
		inputID: "pointBin",
		input: "#pointBin",
		setValid: function(valid){
			if (valid) $(this.label).css("color", "#8DC9FC");
			else $(this.label).css("color", "#9E9E9E");
		}
	};
	
	this.getRoute = {
		btn: "#getRouteBtn"
	};
	
	//~ this.flipAB = {
		//~ btn: "#flipABbtn"
	//~ };
	
	this.resetMap = {
		btn: "#resetMapBtn",
		disable: function(){
			$(this.btn).prop("disabled", true);
		},
		enable: function(){
			$(this.btn).prop("disabled", false);
		}
	};
	
};
