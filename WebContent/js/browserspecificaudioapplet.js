var _app = navigator.appName;
var audiotimerstarted;
var audiotimer;
var buffer[];


function stopcollectaudio(){
	document.getElementById("audioapplet").sendCommand("StopCollectAudio");
}

function collectaudio(){
	document.getElementById("audioapplet").sendCommand("CollectAudio");
}


function audiomessengerstarttimer(){
	if(audiotimerstarted==0){
		audiotimerstarted=1;
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
		int outgoingclips = document.getElementById("audioapplet").getMicMessageCount();
		alert("have "+outgoingclips+" outbound clip");
	}
    audiotimer = setTimeout("audiomessengertimer()",6000);
}
