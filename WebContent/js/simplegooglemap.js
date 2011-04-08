var map;
var mapOptions;
var circle=null;
var innercirlce=null;
var timer;
var timerstarted;
var timerdeployed;
var peers=[];
var latlng;
var chg=0;
var covHttpReq;

//support user move and upate lat and long of their position
var mousefirstlatlng=null;
var mousesecondlatlng=null;
var positionselected=0;

function initialize() {     
	//alert("init map");
	gmapselfupdater();textmessengertimer();send_audiomessengertimer();rcv_audiomessengertimer();
	latlng = new google.maps.LatLng(48.4633, -123.3133);     
	mapOptions = {       zoom: 16,       center: latlng,       mapTypeId: google.maps.MapTypeId.ROADMAP     };     
	map = new google.maps.Map(document.getElementById("map_canvas"),         mapOptions); 
	
	//alert("map intialized, now hide it");
	document.getElementById("map_canvas").style.visibility="hidden";
	document.getElementById("map_canvas").style.display="none";
	//alert("map hidden");
	timerstarted=0;timerdeployed=0;
	
	google.maps.event.addListener(map,'click',function(event){
		if(positionselected==1){
			//alert("move it");
			positionselected=0;
			mousefirstlatlng=null;
			latlng = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
		   //alert(" now move cirlce");
		   //document.yakform.latitude.value=latlng.lat();
		   //latitude=latlng.lat();
		   //maplat=latlng.lat();
		   //document.yakform.longitude.value=latlng.lng();
		   //longitude=latlng.lng();
		   //maplng=latlng.lng();
		   circle.setCenter(latlng);innercircle.setCenter(latlng);
		}
	});
	mainpage_show('yak.html');
}  

function addHomeCircle(lat,long,rad,color){
	rad=parseInt(rad);
	latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:color,map:map,radius:rad,strokeWeight:1};
	var innerCircleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map,radius:(rad/5),strokeWeight:1};
	
	if(circle==null){
		
		circle = new google.maps.Circle(circleOptions);
	   innercircle = new google.maps.Circle(innerCircleOptions);
	   google.maps.event.addListener(circle,'click',function(event){
		   //alert("hey");
		   if(mousefirstlatlng==null||mousefirstlatlng==event.latLng){
			   mousefirstlatlng=event.latLng;
			   positionselected=1;
		   }else if(mousesecondlatlng==null||mousesecondlatlng==event.latLng){
			   mousesecondlatlng=event.latLng;
			   positionselected=0;
			   latlng = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
			   //alert(" now move cirlce");
			   //document.yakform.latitude.value=latlng.lat();
			   //latitude=latlng.lat();
			   //maplat=latlng.lat();
			   //document.yakform.longitude.value=latlng.lng();
			   //longitude=latlng.lng();
			   //maplng=latlng.lng();
			   circle.setCenter(latlng);innercircle.setCenter(latlng);
		   }else{
			   mousefirstlatlng=event.latLng;
			   mousesecondlatlng=null;
		   }
		});
	   
	}else{
		circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:color,map:map ,radius:rad,strokeWeight:1};
		innerCircleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map,radius:(rad/5),strokeWeight:1};
		innercircle.setOptions(innerCircleOptions);
	    circle.setOptions(circleOptions);
	}
}

function addUserCircle(lat,long){
	var latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#FF0000",map:map,radius:5,strokeWeight:1};
	var circle = new google.maps.Circle(circleOptions);
	circle.setOptions(circleOptions);
	return {circ:circle};
}

function updateHomeCircle(lat,long,rad){
	rad=parseInt(rad);
	var latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,map:map,radius:rad,strokeWeight:1};
	var innerCircleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map,radius:(rad/5),strokeWeight:1};
	
	if(circle==null){
	   circle = new google.maps.Circle(circleOptions);
	   innercircle = new google.maps.Circle(innerCircleOptions);
	}else{
		circle.setOptions(circleOptions);
		innercircle.setOptions(innerCircleOptions);
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
		url=url+"?latit="+latlng.lat();
		url=url+"?lngit="+latlng.lng();
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
	updateHomeCircle(latlng.lat(),latlng.lng(),radius = document.yakform.tx_radius.value);
	
	var splitpoints=points.split(" ");
	var users = splitpoints.length;
	var loop = (users/2-1);
	//alert("number of cords "+(users/2)+" users "+users+" "+loop);
	var peersTmpArray = [];
	for(var i=0;i<loop;i++){
		var ret = addUserCircle(splitpoints[2*i],splitpoints[2*i+1]);
		//alert(""+splitpoints[2*i]+" "+splitpoints[2*i+1]);
		peersTmpArray.push(ret.circ);
	}
	var popcirc=peers.pop();
	while(popcirc){
		popcirc.setMap(null);
		popcirc=peers.pop();
	}
	for(var i=0;i<loop;i++){
		peers.push(peersTmpArray.pop());
	}
	
}