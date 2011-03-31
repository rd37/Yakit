var map;
var mapOptions;
var circle=null;
var timer;
var timerstarted;
var timerdeployed;
var peers=[];
var maplat=48.463;
var maplng=-123.313;
var latlng;
var chg=0;
var covHttpReq;

function initialize() {     
	//alert("init map");
	latlng = new google.maps.LatLng(maplat, maplng);     
	mapOptions = {       zoom: 14,       center: latlng,       mapTypeId: google.maps.MapTypeId.ROADMAP     };     
	map = new google.maps.Map(document.getElementById("map_canvas"),         mapOptions); 
	
	//alert("map intialized, now hide it");
	document.getElementById("map_canvas").style.visibility="hidden";
	document.getElementById("map_canvas").style.display="none";
	//alert("map hidden");
	timerstarted=0;timerdeployed=0;
	gmapselfupdater();textmessengertimer();
	//gmapselfupdater();textmessengertimer();intialize_audio();
	mainpage_show('yak.html');
}  

function addHomeCircle(lat,long,rad,color){
	rad=parseInt(rad);
	var latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:color,map:map,radius:rad,strokeWeight:1};
	if(circle==null){
	   circle = new google.maps.Circle(circleOptions);
	}else{
		circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:color,map:map ,radius:rad,strokeWeight:1};
	    circle.setOptions(circleOptions);
	}
}

function addUserCircle(lat,long){
	var latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#AAAAAA",map:map,radius:20,strokeWeight:1};
	var circle = new google.maps.Circle(circleOptions);
	circle.setOptions(circleOptions);
	return {circ:circle};
}

function updateHomeCircle(lat,long,rad){
	rad=parseInt(rad);
	var latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,map:map,radius:rad,strokeWeight:1};
	if(circle==null){
	   circle = new google.maps.Circle(circleOptions);
	}else{
		circle.setOptions(circleOptions);
	}
}

function gmapstarttimer(){
	if(timerstarted==0){
		timerstarted=1;
	}
}

function gmapstoptimer(){
	timerstarted=0;
}
/*
 * when map intializes, this starts
 */
function gmapselfupdater(){
	if(timerstarted==1){
		//generate an update request for coverage
		covHttpReq=GetXmlHttpObject();
		if (covHttpReq==null)
		  {
		  alert ("Your browser does not support AJAX!");
		  return;
		  }
		var url="iConServlet";
		//alert("Request coverage for id:"+userid+" lt:"+latitude+" lng:"+longitude+" radius:"+radius);
		url=url+"?logid="+userid;
		url=url+"?latit="+latitude;
		url=url+"?lngit="+longitude;
		url=url+"?radii="+radius;
		url=url+"?opera=getcover";
		url=url+"&sid="+Math.random();
		covHttpReq.onreadystatechange=coverageRequestComplete;
		covHttpReq.open("GET",url,true);
		covHttpReq.send(null);
	}
	timer = setTimeout("gmapselfupdater()",5000);
}

function coverageRequestComplete(){
	if(covHttpReq.readyState==4){
		//alert(""+covHttpReq.responseText);
		var points=covHttpReq.responseText;
		gmapupdate(points);
	}
}

function gmapupdate(points){
	updateHomeCircle(latitude = document.yakform.latitude.value,longitude = document.yakform.longitude.value,radius = document.yakform.tx_radius.value);
	var popcirc=peers.pop();
	while(popcirc){
		popcirc.setMap(null);
		popcirc=peers.pop();
	}
	var splitpoints=points.split(" ");
	var users = splitpoints.length;
	var loop = (users/2-1);
	//alert("number of cords "+(users/2)+" users "+users+" "+loop);
	for(var i=0;i<loop;i++){
		var ret = addUserCircle(splitpoints[2*i],splitpoints[2*i+1]);
		//alert(""+splitpoints[2*i]+" "+splitpoints[2*i+1]);
		peers.push(ret.circ);
	}
}