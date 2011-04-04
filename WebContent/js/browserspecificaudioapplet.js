var _app = navigator.appName;
var audiotimerstarted=0;
var audiotimer;
var audiobytearray = [];
var tmpbytearray;

function stopcollectaudio(){
	document.getElementById("audioapplet").sendCommand("StopCollectAudio");
}

function collectaudio(){
	document.getElementById("audioapplet").sendCommand("CollectAudio");
}


function audiomessengerstarttimer(){
	if(audiotimerstarted==0){
		audiotimerstarted=1;
		audiomessengertimer();
	}
}

function audiomessengerstoptimer(){
	audiotimerstarted=0;
}

function audiomessengertimer(){
	if(audiotimerstarted==1){
		/*
		 * Retreive any audio clips then send back
		 */
		var outgoingclips = document.getElementById("audioapplet").getMicMessageCount();
		alert("have "+outgoingclips+" outbound clip");
		if(outgoingclips>0){
			var index=0;
			tmpbytearray = document.getElementById("audioapplet").getMicMessageBytes(index);
			while(tmpbytearray!=null){
				audiobytearray.push(tmpbytearray);
				index++;
				tmpbytearray = document.getElementById("audioapplet").getMicMessageBytes(index);
			}
			alert("retrieved mic message, now relay it back");
			tmpbytearray=audiobytearray.pop();
			while(tmpbytearray){
				document.getElementById("audioapplet").addAudioBytesForSpeaker(tmpbytearray);
				tmpbytearray=audiobytearray.pop();
			}
			document.getElementById("audioapplet").submitAudioMessageForSpeaker();
			alert("message relayed back");
		}
	}
    audiotimer = setTimeout("audiomessengertimer()",6000);
}
