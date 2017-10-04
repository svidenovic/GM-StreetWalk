
function PointIterator( gmp ){
	this.i = 0;
	
	this.prog = 0;
	this.progbar = null;
	
	this.init = function(){
		this.i = 0;
		this.progbar = $(".timeLineDiv").find(".progress-bar");
		this.updateTimeLine();
	};
	this.set = function(i){
		this.i = i;
		this.updateTimeLine();
	};
	
	this.end = function(){
		return gmp.location_pts.length;
	};
	
	this.next = function(){
		this.i++;
		if (this.i == this.end()) this.i = 0;
		this.updateTimeLine();
	};
	
	this.prev = function(){
		this.i--;
		if (this.i < 0) this.i = this.end()-1;
		this.updateTimeLine();
	};
	
	this.updateTimeLine = function(){
		if (gmp.location_pts.length == 0) this.prog = 0;
		else
			this.prog = Math.round( 100*(this.i+1)/gmp.location_pts.length );
		
		$(this.progbar).attr("aria-valuenow", this.prog);
		$(this.progbar).css("width", this.prog+"%");
	};
	
};

