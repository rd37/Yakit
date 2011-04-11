var userobjects = new Array();//keeps a list of user objects which are really arrays of user info.
var objectinfo=null;//has info on a device object
var objectindex=0;
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
var idobjectarray = new Array();//keeps a list of arrays each array is indexed by userid arrays have coverage coords
var httparray = new Array();//keeps a list of http request made by sensors requesting coverage

var objectidname = new Array();//store idnames used to index userobjects
var nameindex=0;

//support user move and upate lat and long of their position
var mousefirstlatlng=null;
var mousesecondlatlng=null;
var positionselected=0;

function removedevice(){
	alert("remove");
	
}

function adddevice(type){
	if(type=="txrx"&&objectinfo==null){
		//alert("adding another transmitter receiver to your map");
		objectinfo = new Array(); //includes the user - later do this
		objectinfo["type"]="txrx";
		objectinfo["id"]= (username+"-"+objectindex);//is temperary till server returns login id
		objectinfo["lat"]= latlng.lat()+"";
		objectinfo["lng"]= latlng.lng()+"";
		objectinfo["rad"]= 60;
		objectinfo["isclicked"]= "false";
		objectinfo["newposition"]= null;
		
		//now send request to server to login user cant reuse login from aminpage.js no good
		objectlogin(null,null,null,latlng.lat(),latlng.lng(),60);
	}
}

function initialize() {    
	//alert("init map");
	gmapselfupdater();textmessengertimer();send_audiomessengertimer();rcv_audiomessengertimer();
	latlng = new google.maps.LatLng(48.4633, -123.3133);     
	mapOptions = {       zoom: 15,       center: latlng,       mapTypeId: google.maps.MapTypeId.ROADMAP     };     
	map = new google.maps.Map(document.getElementById("map_canvas"),         mapOptions); 
	
	//alert("map intialized, now hide it");
	document.getElementById("map_canvas").style.visibility="hidden";
	document.getElementById("map_canvas").style.display="none";
	//alert("map hidden");
	timerstarted=0;timerdeployed=0;
	
	google.maps.event.addListener(map,'click',function(event){
		if(positionselected==1){
			positionselected=0;
			mousefirstlatlng=null;
			latlng = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
		   
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
		innercircle = new google.maps.Circle(innerCircleOptions);
		circle = new google.maps.Circle(circleOptions);
	   google.maps.event.addListener(circle,'click',function(event){
		   //alert("hey");
		   if(mousefirstlatlng==null||mousefirstlatlng==event.latLng){
			   mousefirstlatlng=event.latLng;
			   positionselected=1;
		   }else if(mousesecondlatlng==null||mousesecondlatlng==event.latLng){
			   mousesecondlatlng=event.latLng;
			   positionselected=0;
			   latlng = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng());
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

function addObjectImage(lat,lng,rad){
	//alert("now add image icon at "+lat+" "+lng);
	var image = 'images/transmiterreciever_map.gif';   
	var myLatLng = new google.maps.LatLng(lat, lng);   
	var beachMarker = new google.maps.Marker({       
		position: myLatLng,       
		map: map,       
		icon: image   
	}); 
	var circleOptions={center:myLatLng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#aaaaaa",map:map,radius:rad,strokeWeight:1};
	var circle = new google.maps.Circle(circleOptions);
	circle.setOptions(circleOptions);
}


function updateHomeCircle(lat,long,rad){
	rad=parseInt(rad);
	var latlng = new google.maps.LatLng(lat,long);
	var circleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,map:map,radius:rad,strokeWeight:1};
	var innerCircleOptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map,radius:(rad/5),strokeWeight:1};
	
	if(circle==null){
		innercircle = new google.maps.Circle(innerCircleOptions);
	   circle = new google.maps.Circle(circleOptions);
	   
	}else{
		innercircle.setOptions(innerCircleOptions);
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
		url=url+"?latit="+latlng.lat();
		url=url+"?lngit="+latlng.lng();
		url=url+"?radii="+radius;
		url=url+"?opera=getcover";
		url=url+"&sid="+Math.random();
		covHttpReq.onreadystatechange=coverageRequestComplete;
		covHttpReq.open("GET",url,true);
		covHttpReq.send(null);
		updateUserObjects();
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
	updateHomeCircle(latlng.lat(),latlng.lng(),radius = document.yakform.tx_radius.value);
	
}

//this is for object login
function objectlogin(id,un,pw,lat,lng,rad){
	loginHttpReq=GetXmlHttpObject();
	if (loginHttpReq==null)
	  {
	  alert ("Your browser does not support AJAX!");
	  return;
	  }
	var url="LoginServlet";
	url=url+"?latit="+latlng.lat();
	url=url+"?logit="+latlng.lng();
	url=url+"?logid="+id;
	url=url+"?logun="+un;
	url=url+"?logpw="+pw;
	url=url+"&sid="+Math.random();
	loginHttpReq.onreadystatechange=objectLoginComplete;
	loginHttpReq.open("GET",url,true);
	loginHttpReq.send(null);
}

function updateUserObjects(){
	//var tmparray=[];
	//var object = userobjects.pop();
	var objectIndex=0;
	var object = userobjects[objectidname[objectIndex]];
	//var tmpid;
	var index=0;
	while(object){
		//tmparray.push(object);
	    if(httparray[index]!=null){ //waiting oon http call so break out of 
	    	alert(object["id"]+" request for coverage still waiting for response ");
	    	//httparray[object["id"]]=null;
	    }else{
			var objHttpReq=GetXmlHttpObject();
			//alert("create new req object store using id "+object["id"]);
			//httparray[object["id"]]= objHttpReq;
			httparray[index]= objHttpReq;index+=1;
			if (objHttpReq==null)
			  {
			  alert ("Your browser does not support AJAX!");
			  return;
			  }
			var url="iConServlet";
			//alert("Request coverage for id:"+object["id"]);
			url=url+"?logid="+object["id"];
			url=url+"?latit="+object["lat"];
			url=url+"?lngit="+object["lng"];
			url=url+"?radii="+object["rad"];
			url=url+"?opera=getcoverwithid";
			url=url+"&sid="+Math.random();
			//alert("create new object request to get coverate "+object["id"]);
			//tmpid=object["id"];
			objHttpReq.onreadystatechange=function(){
				var index2=0;
				//var httpObjChk=httparray[index2];
				while(httparray[index2]){
					//if(httparray[tmpid].readyState==4){
					if(httparray[index2].readyState==4){
						//alert("coverage update for "+tmpid);
						//var points=httparray[tmpid].responseText;
						var points=httparray[index2].responseText;
						var splitpoints=points.split(" ");
						var users = splitpoints.length;
						//alert("sensor "+tmpid+" got coverage update sensor cnt "+userobjects.length);
						
						var respID=splitpoints[0];
						var oldcircle = idobjectarray[respID].pop();
						while(oldcircle){
							oldcircle.setMap(null);
							oldcircle = idobjectarray[respID].pop();
						}
						var loop = ((users-1)/2);
						
						for(var i=0;i<loop;i++){
							var ret = addUserCircle(splitpoints[2*i+1],splitpoints[2*i+2]);
							idobjectarray[respID].push(ret.circ);
						}
						//httparray[tmpid]=null;
						httparray[index2]=null;
					}
					index2+=1;
				}
			};
			objHttpReq.open("GET",url,true);
			objHttpReq.send(null);
			
	    }
		//object = userobjects.pop();
	    objectIndex+=1;
	    object = userobjects[objectidname[objectIndex]];
	}
	
	/*object = tmparray.pop();
	while(object){
		userobjects.push(object);
		object = tmparray.pop();
	}*/
}


function objectLoginComplete(){
	if(loginHttpReq.readyState==4){
		var tmpid=loginHttpReq.responseText;
		if(tmpid != -1){
			//userid=tmpid;
			objectinfo["id"]= (""+tmpid);
			idobjectarray[""+tmpid]=new Array();
			//userobjects.push(objectinfo);
			userobjects[""+tmpid]=(objectinfo);
			objectindex+=1;
			objectidname[nameindex]=(""+tmpid);
			//alert("add new sensor at pos "+nameindex+" id is "+tmpid);
			nameindex+=1;
			var lat=objectinfo["lat"];
			var lng=objectinfo["lng"];
			var rad=objectinfo["rad"];
			addObjectImage(lat,lng,rad);//ojbect shows as dot, but should overlay an Image
			//alert("added new device for this user "+tmpid+" "+userobjects.length);
			objectinfo=null;
			//update map for objectl
			//updateobjectmap();
		}else{
			alert("Error Login in check username and password");
		}
	}
}
/*
function updateobjectmap(){
	var tmparray=[];
	var object = userobjects.pop();
	while(object){
		tmparray.push(object);
		var lat=object["lat"];
		var lng=object["lng"];
		var rad=object["rad"];
		addObjectImage(lat,lng,rad);//ojbect shows as dot, but should overlay an Image
		var object = userobjects.pop();
	}
	object = tmparray.pop();
	while(object){
		userobjects.push(object);
		object = tmparray.pop();
	}
}
*/
