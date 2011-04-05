var send_audiotimerstarted=0;
var send_audiotimer;
var send_audioHttpReq;
var send_audiostate=0;
var send_audio_key;
var send_audio_index=0;

function stopcollectaudio(){
	document.getElementById("audioapplet").sendCommand("StopCollectAudio");
}

function collectaudio(){
	document.getElementById("audioapplet").sendCommand("CollectAudio");
}


function audiomessengerstarttimer(){
	if(send_audiotimerstarted==0){
		send_audiotimerstarted=1;
		send_audiomessengertimer();
	}
}

function audiomessengerstoptimer(){
	send_audiotimerstarted=0;
}

function send_audiomessengertimer(){
	if(send_audiotimerstarted==1){
		/*
		 * Retreive any audio clips then send back
		 */
		var outgoingclips = document.getElementById("audioapplet").getMicMessageCount();
		//alert("have "+outgoingclips+" outbound clip");
		if(outgoingclips>0){
			/*
			 * If out going clip, then gather data into javascript byte array
			 * and intiate call to audiomessengersend servlet
			 * 1. initiate call for servlet to create a new audio message to begin filling with data
			 * 2. use key returned from prevous servlet call to send byte array to the servlet 
			 * in order. Servlet will write these bytes to file and register file in the message
			 * 3. after all bytes writtenn to servlet, request message sent to coerage area
			 * 4. done so read in next message
			 */
			if(send_audiostate==0){
				send_audiostate==1;
				initiate_send_audiomessage();
			}
			
			//alert("retrieved mic message, now relay it back ");
			/*send_audiobytearray.reverse();
			send_tmpbytearray=send_audiobytearray.pop();
			while(send_tmpbytearray){
				document.getElementById("audioapplet").addAudioBytesForSpeaker(send_tmpbytearray);
				send_tmpbytearray=send_audiobytearray.pop();
			}
			document.getElementById("audioapplet").submitAudioMessageForSpeaker();*/
			//alert("message relayed back");
		}
	}
    send_audiotimer = setTimeout("send_audiomessengertimer()",6000);
}

function initiate_send_audiomessage(){
	//alert("initial send audio");
	send_audioHttpReq=GetXmlHttpObject();
	if (send_audioHttpReq==null)
	  {
	  alert ("Your browser does not support AJAX!");
	  return;
	  }
	send_audioHttpReq.onreadystatechange=send_audioSubmitted;
	send_audioHttpReq.open("POST","SendAudioMessengerServlet",true);
	send_audioHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	send_audiostate=2;
	send_audioHttpReq.send("send_audiostate=2");
}

function send_audioSubmitted(){
	if(send_audioHttpReq.readyState==4){
		if(send_audiostate==2){
			send_audio_key = send_audioHttpReq.responseText;
			//alert("new mesg key to send bytes to "+send_audio_key);
			send_audiostate=3;
			send_audio_index=0;
			sendaudiobytes(send_audio_index);
		}else if(send_audiostate==3){
			send_audio_index+=1;
			//alert("need to keep going "+send_audio_index);
			sendaudiobytes(send_audio_index);
		}else if(send_audiostate==4){
			alert("msg created and bytes added, now send coverage and add key to users");
			send_audioHttpReq=GetXmlHttpObject();
			if (send_audioHttpReq==null)
			  {
			  alert ("Your browser does not support AJAX!");
			  return;
			  }
			var url="SendAudioMessengerServlet";
			url=url+"?logid="+userid;
			url=url+"&latit="+latitude;
			url=url+"&lngit="+longitude;
			url=url+"&radii="+radius;
			url=url+"&msgky="+send_audio_key;
			url=url+"&sid="+Math.random();
			//alert(url);
			send_audioHttpReq.onreadystatechange=function audiosent(){};
			send_audioHttpReq.open("GET",url,true);
			send_audioHttpReq.send(null);
			send_audiostate=0;
		}
	}
}

function sendaudiobytes(index){
	if(send_audiostate==3){
		//alert("send some bytes");
		send_audioHttpReq=GetXmlHttpObject();
		if (send_audioHttpReq==null)
		  {
		  alert ("Your browser does not support AJAX!");
		  return;
		  }
		send_audioHttpReq.onreadystatechange=send_audioSubmitted;
		send_audioHttpReq.open("POST","SendAudioMessengerServlet?send_audiostate=3&audio_key="+send_audio_key+"&",true);//application/octet-stream MIME-type 
		send_audioHttpReq.setRequestHeader('Content-Type', 'application/octet-stream');
		//send_audioHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var send_tmpbytearray = document.getElementById("audioapplet").getMicMessageBytes(index);
		
		if(send_tmpbytearray==null){
			send_audiostate=4;
			//alert("send bytes "+index+" but bytes are null");//+"&data="+send_bytearray
		}else{
			//alert("send bytes "+index);//+"&data="+send_bytearray
		}
		send_audioHttpReq.data=send_tmpbytearray;
		send_audioHttpReq.send("state=3");
	}
}
