var send_audiotimerstarted=0;
var send_audiotimer;
var send_audioHttpReq;
var send_audiostate=0;
var send_audio_key;
var send_audio_index=0;

var rcv_audiotimerstarted=0;
var rcv_audiotimer;
var rcv_audioHttpReq;
var rcv_audiostate=0;
var rcv_audio_key;
var rcv_audio_index=0;

function stopcollectaudio(){
	document.getElementById("audioapplet").sendCommand("StopCollectAudio");
}

function collectaudio(){
	document.getElementById("audioapplet").sendCommand("CollectAudio");
}


function audiomessengerstarttimer(){
	if(send_audiotimerstarted==0){
		send_audiotimerstarted=1;
		//send_audiotimer = setTimeout("send_audiomessengertimer()",6000);
		rcv_audiotimerstarted=1;
		//rcv_audiotimer = setTimeout("rcv_audiomessengertimer()",6000);
	}
}

function audiomessengerstoptimer(){
	send_audiotimerstarted=0;
	rcv_audiotimerstarted=0;
}

function rcv_audiomessengertimer(){
	if(rcv_audiotimerstarted==1){
		/*
		 * Determine if you have any incoming clips.
		 * if so, then load next clip and send to audio applet
		 * just send get audio clip, if no key returned then stop
		 */
		if(rcv_audiostate==0){
			rcv_audiostate=1;
			//prep GET message to get next audio message key and then start the byte download
			rcv_audioHttpReq=GetXmlHttpObject();
			if (rcv_audioHttpReq==null)
			  {
			  alert ("Your browser does not support AJAX!");
			  return;
			  }
			var url="RcvAudioMessengerServlet";
			url=url+"?logid="+userid;
			url=url+"&index=0";
			url=url+"&opera=GetAudioMessageKey";
			url=url+"&msgky=0";
			url=url+"&sid="+Math.random();
			//alert(url);
			rcv_audioHttpReq.onreadystatechange=rcvAudioMessageSubmitted;
			rcv_audioHttpReq.open("GET",url,true);
			rcv_audioHttpReq.send(null);
		}
		
	}
	rcv_audiotimer = setTimeout("rcv_audiomessengertimer()",6000);
}

function rcvAudioMessageSubmitted(){
	if(rcv_audioHttpReq.readyState==4){
		if(rcv_audiostate==1){
			rcv_audiostate=2;
			rcv_audio_key=rcv_audioHttpReq.responseText;
			//alert("Found audio message  key "+rcv_audio_key);
			if(rcv_audio_key==0){
				rcv_audiostate=0;
				return;
			}
			//now start to get data if message key is valid
			rcv_audioHttpReq=GetXmlHttpObject();
			if (rcv_audioHttpReq==null)
			  {
			  alert ("Your browser does not support AJAX!");
			  return;
			  }
			var url="RcvAudioMessengerServlet";
			url=url+"?logid="+userid;
			url=url+"&index="+rcv_audio_index;
			url=url+"&opera=GetAudioBytes";
			url=url+"&msgky="+rcv_audio_key;
			url=url+"&sid="+Math.random();
			rcv_audioHttpReq.onreadystatechange=rcvAudioMessageSubmitted;
			rcv_audioHttpReq.open("GET",url,true);
			rcv_audioHttpReq.send(null);
		}else if(rcv_audiostate==2){
			var data = rcv_audioHttpReq.responseText;
			//alert("rcvd data "+rcv_audio_index+" dt: "+data+"");
			if(data=="?"){
				//alert("audio data download complete playback audio");
				document.getElementById("audioapplet").submitAudioMessageForSpeaker();
				rcv_audiostate=0;rcv_audio_index=0;
			}else{
				var parseddata = getdata(data);
				
				if(parseddata.data!="null"){
					//alert("insert into applet as data"+parseddata.data+" "+stringToBytes(parseddata.data));
					document.getElementById("audioapplet").addAudioBytesForSpeakerFromString(parseddata.data);
				}
				rcv_audio_index+=1;
				rcv_audioHttpReq=GetXmlHttpObject();
				if (rcv_audioHttpReq==null)
				  {
				  alert ("Your browser does not support AJAX!");
				  return;
				  }
				var url="RcvAudioMessengerServlet";
				url=url+"?logid="+userid;
				url=url+"&index="+rcv_audio_index;
				url=url+"&opera=GetAudioBytes";
				url=url+"&msgky="+rcv_audio_key;
				url=url+"&sid="+Math.random();
				rcv_audioHttpReq.onreadystatechange=rcvAudioMessageSubmitted;
				rcv_audioHttpReq.open("GET",url,true);
				rcv_audioHttpReq.send(null);
			}
		}
	}
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
			 * and intiate call to sendaudiomessenger servlet
			 * use POST
			 * 1. initiate call for servlet to create a new audio message to begin filling with data
			 * 2. use key returned from prevous servlet call to send byte array to the servlet 
			 * in order. Servlet will write these bytes to file and register file in the message
			 * 3. after all bytes writtenn to servlet, request message sent to coerage area
			 * use GET
			 * 4. done so read in next message
			 * 
			 */
			if(send_audiostate==0){
				send_audiostate==1;
				initiate_send_audiomessage();
			}
			/*alert("try to get bytes");
			var index=0;
			var msgString = document.getElementById("audioapplet").getMicMessageBytesAsString(index);
			var msgArray = [];
			while(msgString){
				msgArray.push(msgString);
				index+=1;
				var msgString = document.getElementById("audioapplet").getMicMessageBytesAsString(index);
			}
			msgArray.reverse();
			
			msgString = msgArray.pop();
			while(msgString){
				document.getElementById("audioapplet").addAudioBytesForSpeakerFromString(msgString);
				msgString = msgArray.pop();
			}
			document.getElementById("audioapplet").submitAudioMessageForSpeaker();
			
			alert("message relayed back");*/
		}
	}
    send_audiotimer = setTimeout("send_audiomessengertimer()",6000);
}

/*
 * When ever there is an audio message to be send, this is the first call to it. It will not
 * be called again until the entire message is sent.  then next message is send.
 * this POST call should create a new audio object on the server
 */
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
	send_audioHttpReq.send("send_audiostate=2");//this is what makes a new audio message on servlet
}

/*
 * this method is recursive with the servlet it works with and will send the audio data as a string in peices
 */
function send_audioSubmitted(){
	if(send_audioHttpReq.readyState==4){
		if(send_audiostate==2){
			send_audio_key = send_audioHttpReq.responseText;//after audio object created on server, it gets a key back
			//alert("new mesg key to send bytes to "+send_audio_key);
			send_audiostate=3;
			send_audio_index=0;
			sendaudiobytes(send_audio_index);
		}else if(send_audiostate==3){
			send_audio_index+=1;
			//alert("need to keep going "+send_audio_index);
			sendaudiobytes(send_audio_index);
		}else if(send_audiostate==4){
			//alert("msg created and bytes added, now send coverage and add key to users");
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
		var msgString = document.getElementById("audioapplet").getMicMessageBytesAsString(index);
		
		send_audioHttpReq.onreadystatechange=send_audioSubmitted;
		send_audioHttpReq.open("POST","SendAudioMessengerServlet?send_audiostate=3&audio_key="+send_audio_key+"&data_string="+"crappy"+"&",true);//application/octet-stream MIME-type 
		send_audioHttpReq.setRequestHeader('Content-Type', 'application/octet-stream');
		//send_audioHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var msg="<audio><data><![CDATA["+msgString+"]]></data></audio>";
		if(msgString==null){
			send_audiostate=4;
			//alert("send bytes "+index+" but bytes are null");//+"&data="+send_bytearray
		}
		send_audioHttpReq.data=msg;
		//alert("sending audio ");
		send_audioHttpReq.send(msg);
	}
}


function getdata(data){
	var index1=22;
	var index2 = data.indexOf("]]></data>");
	return { data : data.substring(index1,index2) }; 
}

function stringToBytes ( str ) {   
	var ch, st, re = [];   
	for (var i = 0; i < str.length; i++ ) {     
		ch = str.charCodeAt(i);  // get char      
		st = [];                 // set up "stack"     
		do {       
			st.push( ch & 0xFF );  // push byte to stack       
			ch = ch >> 8;          // shift value down by 1 byte     
		}       
		while ( ch );     // add stack contents to result     
		// done because chars have "wrong" endianness     
		re = re.concat( st.reverse() );   
		}   
	// return an array of bytes   
	return re; 
} 
