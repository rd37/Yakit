
  var _app = navigator.appName;
function initapplet(){
  alert("ron this should not be used till fixed by browser support");
  if (_app == 'Netscape') {
	  alert("netscape");
    document.getElementById("appletholder").innerHTML='<embed code="appletpackage.WelcomeApplet.class" '+
            'name="audioapplet" '+
            'id="audioapplet" '+
            'archive="applettest.jar" ' +
            'width="200" '+
            'height="200" '+
            'scriptable="true" '+
            'mayscript="false" '+
            'type="application/x-java-applet;version=1.6.0" '+
            'pluginspage="http://java.sun.com/j2se/1.6.0/download.html"> ' +
         '<noembed>No Java Support.</noembed> '+
     '</embed>';
    }
  else if (_app == 'Microsoft Internet Explorer') {
	  alert("load ms object for applet")
	  document.getElementById("appletholder").innerHTML='<OBJECT '+
                   'classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" '+
                   'width="200" '+
                   'height="200" id="audioapplet"> '+
                   '<PARAM name="archive"  value="applettest.jar" > '+
                   '<PARAM name="code"  value="appletpackage.WelcomeApplet.class"> '+
                   '</OBJECT>';
    }
  else {
	  alert("browser applet not supported");
	  document.getElementById("appletholder").innerHTML='<p>Sorry, unsupported browser.</p>';
    }
}

function stopcollectaudio(){
	//alert("stop collect");
	document.getElementById("audioapplet").sendCommand("StopCollectAudio");
}

function collectaudio(){
	//alert("start collect");
	document.getElementById("audioapplet").sendCommand("CollectAudio");
}
