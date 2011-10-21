var gpsobject = new Object();

function initializeGPS(){
	//determine phone type
	if( DetectIphone()){
		gpsobject.phonetype= "iphone";
		//alert("this is a iphone");
	}else if(DetectAndroidPhone()){
		gpsobject.phonetype= "android";
		//alert("this is a android");
	}else if(DetectIpad()){
		gpsobject.phonetype= "ipad";
		//alert("this is a ipad");
	}else{
		gpsobject.phonetype="psorlaptop";
		//alert("this is a different");
	}
	document.getElementById("login_name").innerHTML="gpsobject.phonetype";
	//determine gps coods
	
	if(navigator.geolocation && ( (gpsobject.phonetype == "android") || (gpsobject.phonetype == "iphone")  )){             
		gpsobject.settimeout = setTimeout("updategps()",5000);
		gpsobject.gpssupported="true";
		gpsobject.gpsavailable="false";
	} else {  
		//alert("geo Functionality not available");
	}
	
}
 
function gps_callback(position) 
{ 
	var lati = position.coords.latitude; 
    var lngi = position.coords.longitude; 
    gpsobject.lat=lati;
    gpsobject.lng=lngi;
    gpsobject.available="true";
    latlng = new google.maps.LatLng(lati,lngi);
}

function error_callback(errori){
	gpsobject.available="false";
}

function updategps(){
	navigator.geolocation.getCurrentPosition( gps_callback, error_callback,{ maximumAge: 3000, timeout: 25000, enableHighAccuracy: true }); 
	document.getElementById("login_name").innerHTML=gpsobject.phonetype+" GPS Avail: "+gpsobject.available;
	gpsobject.settimeout = setTimeout("updategps()",15000);
}