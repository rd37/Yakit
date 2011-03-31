function intialize_audio(){
	  echo("aha");
}

function echo(str){
	alert("send "+str+" to applet");
	var res=document.getElementById("audioapplet").echo("dudappy");
	alert(res);
}

