var msgHttpReg;
var msg2HttpReg;
var texttimer;
var buzy=0;
var httpTextReq = new Array();

function sendchar(e) {  
	//alert("key press");
	var keynum;
	var keychar;
	if(e==null)
		alert("e is null ???");
	if(e.which) // IE
	{
	//alert("netscape");
	keynum = e.which;
	}
	else if(window.event) // Netscape/Firefox/Opera
	{
	//alert("ie");
	keynum = window.event.keyCode;
	}
	keychar = String.fromCharCode(keynum);
    //alert("key pressed "+keychar+" keynum "+keynum);
	if (keynum == 13) {         
		//latitude = document.yakform.latitude.value;
		//longitude = document.yakform.longitude.value;
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
		url=url+"?latit="+latlng.lat();
		url=url+"?lngit="+latlng.lng();
		url=url+"?radii="+radius;
		url=url+"?opera=sendmessage";
		url=url+"?messg="+message;
		url=url+"&sid="+Math.random();
		//alert(url);
		msgHttpReq.onreadystatechange=function(){};
		msgHttpReq.open("GET",url,true);
		msgHttpReq.send(null);
		updateobjectsmessagesend(message);
	}
}

function updateobjectsmessagesend(msg){
	var index=0;
	var idsensor = objectidname[index];
	while(idsensor){
		var object = userobjects[idsensor];
		var objSendHttpReq=GetXmlHttpObject();
		if (objSendHttpReq==null)
		  {
		  alert ("Your browser does not support AJAX!");
		  return;
		  }
		var url="TextMessengerServlet";
		url=url+"?logid="+object["id"];
		url=url+"?latit="+object["lat"];
		url=url+"?lngit="+object["lng"];
		url=url+"?radii="+object["rad"];
		url=url+"?opera=sendmessage";
		url=url+"?messg="+msg;
		url=url+"&sid="+Math.random();
		//alert(url);
		objSendHttpReq.onreadystatechange=function(){};
		objSendHttpReq.open("GET",url,true);
		objSendHttpReq.send(null);
		index+=1;
		idsensor = objectidname[index];
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
	//latitude = document.yakform.latitude.value;
	//longitude = document.yakform.longitude.value;
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
	url=url+"?latit="+latlng.lat();
	url=url+"?lngit="+latlng.lng();
	url=url+"?radii="+radius;
	url=url+"?opera=getmessages";
	url=url+"?messg="+message;
	url=url+"&sid="+Math.random();
	//alert(url);
	msg2HttpReq.onreadystatechange=getMsgSubmitted;
	msg2HttpReq.open("GET",url,true);
	msg2HttpReq.send(null);
	updateobjectsmessagercv(message);
}

function getMsgSubmitted(){
	if(msg2HttpReq.readyState==4){
		//alert(""+msgHttpReq.responseText);
		var txt = document.yakform.textoutput.value;
		if(msg2HttpReq.responseText!=null && msg2HttpReq.responseText!="")
		document.yakform.textoutput.value=msg2HttpReq.responseText+"\n"+txt;
		buzy=0;
	}
}

function updateobjectsmessagercv(msg){
	var index=0;
	var idsensor = objectidname[index];
	var reqindex=0;
	while(idsensor){
		var object = userobjects[idsensor];
		var msgrcvHttpReq=GetXmlHttpObject();
		if (msgrcvHttpReq==null)
		  {
		  alert ("Your browser does not support AJAX!");
		  return;
		  }
		if(httpTextReq[reqindex]==null)
			httpTextReq[reqindex]=msgrcvHttpReq;
		reqindex+=1;
		var url="TextMessengerServlet";
		url=url+"?logid="+object["id"];
		url=url+"?latit="+object["lat"];
		url=url+"?lngit="+object["lng"];
		url=url+"?radii="+object["rad"];
		url=url+"?opera=getmessages";
		url=url+"?messg="+msg;
		url=url+"&sid="+Math.random();
		//alert(url);
		msgrcvHttpReq.onreadystatechange=function(){
			var tmpindex=0;
			while(httpTextReq[tmpindex]){
				if(httpTextReq[tmpindex].readyState==4){
					var txt = document.yakform.textoutput.value;
					if(httpTextReq[tmpindex].responseText!=null && httpTextReq[tmpindex].responseText!="")
					document.yakform.textoutput.value=httpTextReq[tmpindex].responseText+"\n"+txt;
					httpTextReq[tmpindex]=null;
				}
				tmpindex+=1;
			}
		};
		msgrcvHttpReq.open("GET",url,true);
		msgrcvHttpReq.send(null);
		
		index+=1;
		idsensor = objectidname[index];
	}
}

