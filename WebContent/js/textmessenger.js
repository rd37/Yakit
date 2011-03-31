var msgHttpReg;
var msg2HttpReg;
var texttimer;
var buzy=0;

function sendTextMessage() {     
	var key = window.event.keyCode;      
	if (key == 13) {         
		latitude = document.yakform.latitude.value;
		longitude = document.yakform.longitude.value;
		radius = document.yakform.tx_radius.value;
		
		var message=document.yakform.textinput.value;
		document.yakform.textinput.value="";
		msgHttpReq=GetXmlHttpObject();
		if (msgHttpReq==null)
		  {
		  alert ("Your browser does not support AJAX!");
		  return;
		  }
		var url="TextMessengerServlet";
		url=url+"?logid="+userid;
		url=url+"?latit="+latitude;
		url=url+"?lngit="+longitude;
		url=url+"?radii="+radius;
		url=url+"?opera=sendmessage";
		url=url+"?messg="+message;
		url=url+"&sid="+Math.random();
		//alert(url);
		msgHttpReq.onreadystatechange=msgSubmitted;
		msgHttpReq.open("GET",url,true);
		msgHttpReq.send(null);
	}
}

function msgSubmitted(){
	if(msgHttpReq.readyState==4){
		//alert(""+msgHttpReq.responseText);
		//var txt = document.yakform.textoutput.value;
		//document.yakform.textoutput.value=msgHttpReq.responseText+"\n"+txt;
	}
}

function textmessengerstarttimer(){
	if(timerstarted==0){
		timerstarted=1;
	}
}

function textmessengerstoptimer(){
	timerstarted=0;
}

function textmessengertimer(){
	if(timerstarted==1&&(buzy==0)){
		buzy=1;//perform message call to get messages
		sendRequestForMessages();
	}
    texttimer = setTimeout("textmessengertimer()",6000);
}

function sendRequestForMessages(){
	latitude = document.yakform.latitude.value;
	longitude = document.yakform.longitude.value;
	radius = document.yakform.tx_radius.value;
	
	var message="yak";
	//document.yakform.textinput.value="";
	msg2HttpReq=GetXmlHttpObject();
	if (msg2HttpReq==null)
	  {
	  alert ("Your browser does not support AJAX!");
	  return;
	  }
	var url="TextMessengerServlet";
	url=url+"?logid="+userid;
	url=url+"?latit="+latitude;
	url=url+"?lngit="+longitude;
	url=url+"?radii="+radius;
	url=url+"?opera=getmessages";
	url=url+"?messg="+message;
	url=url+"&sid="+Math.random();
	//alert(url);
	msg2HttpReq.onreadystatechange=getMsgSubmitted;
	msg2HttpReq.open("GET",url,true);
	msg2HttpReq.send(null);
}

function getMsgSubmitted(){
	if(msg2HttpReq.readyState==4){
		//alert(""+msgHttpReq.responseText);
		var txt = document.yakform.textoutput.value;
		if(msg2HttpReq.responseText!="")
		document.yakform.textoutput.value=msg2HttpReq.responseText+"\n"+txt;
		buzy=0;
	}
}
