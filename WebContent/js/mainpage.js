var mainHttpReq;
var loginHttpReq;
var regHttpReq;
var lastpage;
var userid;
var username;
var userpw;
var regname;

var latitude;
var longitude;
var radius;

function register(un){
	alert("try to register "+un);
	regHttpReq=GetXmlHttpObject();
	if (regHttpReq==null)
	  {
	  alert ("Your browser does not support AJAX!");
	  return;
	  }
	var url="RegisterServlet";
	regname=un;
	url=url+"?logid="+userid;
	url=url+"?logun="+un;
	url=url+"&sid="+Math.random();
	regHttpReq.onreadystatechange=registrationSubmitted;
	regHttpReq.open("GET",url,true);
	regHttpReq.send(null);
}

function registrationSubmitted(){
	if(regHttpReq.readyState==4){
		alert(""+regHttpReq.responseText);
		var tmpun=regHttpReq.responseText;
		if(tmpun != -1){
			username=regname;
			document.getElementById("login_name").innerHTML=username;
		}else{
			alert("Error registering in check username");
		}
	}
}

function fulllogin(un,pw){
	login(userid,un,pw,document.yakform.latitude.value,document.yakform.longitude.value,document.yakform.tx_radius.value);
}

function login(id,un,pw,lat,lng,rad){
	loginHttpReq=GetXmlHttpObject();
	if (loginHttpReq==null)
	  {
	  alert ("Your browser does not support AJAX!");
	  return;
	  }
	addHomeCircle(lat,lng,rad,"#FF0000");
	username=un;latitude=lat;longitude=lng;radius=rad;
	var url="LoginServlet";
	url=url+"?latit="+lat;
	url=url+"?logit="+lng;
	url=url+"?logid="+id;
	url=url+"?logun="+un;
	url=url+"?logpw="+pw;
	url=url+"&sid="+Math.random();
	loginHttpReq.onreadystatechange=loginComplete;
	loginHttpReq.open("GET",url,true);
	loginHttpReq.send(null);
}

function mainpage_show(page){
	document.getElementById("map_canvas").style.visibility="hidden";
	document.getElementById("map_canvas").style.display="none";
	mainHttpReq=GetXmlHttpObject();
	if (mainHttpReq==null)
	  {
	  alert ("Your browser does not support AJAX!");
	  return;
	  }
	var url=page;
	lastpage=page;
	mainHttpReq.onreadystatechange=mainChanged;
	mainHttpReq.open("GET",url,true);
	mainHttpReq.send(null);
}

function getElementPosition(elem){   
  var posX = 0;   
  var posY = 0;             
  while(elem!= null){   
    posX += elem.offsetLeft;   
    posY += elem.offsetTop;   
    elem = elem.offsetParent;   
  }                              
 return { x : posX, y : posY };   
}  

function loginComplete(){
	if(loginHttpReq.readyState==4){
		var tmpid=loginHttpReq.responseText;
		if(tmpid != -1){
			userid=tmpid;
			document.getElementById("login_id").innerHTML=userid;
			if(username==null){
				username="guest";
				document.getElementById("login_name").innerHTML=username;
				addHomeCircle(latitude,longitude,radius,"#777700");
			}else{
				document.getElementById("login_name").innerHTML=username;
				addHomeCircle(latitude,longitude,radius,"#00FF00");
			}
		}else{
			alert("Error Login in check username and password");
		}
	}
}

function mainChanged(){
	  if (mainHttpReq.readyState==4)
	  {
		  document.getElementById('themain').innerHTML=mainHttpReq.responseText;
		  if(lastpage=='yak.html'){
			var pos = getElementPosition(document.getElementById("mapholder"));
			document.getElementById("map_canvas").style.left=pos.x+"px";
			document.getElementById("map_canvas").style.top=pos.y+"px";
			document.getElementById("map_canvas").style.display="block";
			document.getElementById("map_canvas").style.visibility="visible";
			gmapstarttimer();
			textmessengerstarttimer();
			audiomessengerstarttimer();
			if(userid==null){
				login(null,null,null,document.yakform.latitude.value,document.yakform.longitude.value,document.yakform.tx_radius.value);
			}else{
				document.getElementById("login_id").innerHTML=userid;
			}
		  }else{
			  gmapstoptimer();
			  textmessengerstarttimer();
		  }
	  }
}