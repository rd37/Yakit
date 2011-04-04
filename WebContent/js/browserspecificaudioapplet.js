var send_audiotimerstarted=0;
var send_audiotimer;

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
			 */
			var index=0;
			var send_audiobytearray = [];
			var send_tmpbytearray = document.getElementById("audioapplet").getMicMessageBytes(index);
			while(send_tmpbytearray!=null){
				send_audiobytearray.push(send_tmpbytearray);
				index++;
				send_tmpbytearray = document.getElementById("audioapplet").getMicMessageBytes(index);
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
