package yakitapplet;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.SourceDataLine;

public class EchoSound implements Runnable{
	private YakitAudioApplet applet;
	
	public EchoSound(YakitAudioApplet applet){
		this.applet=applet;
	}
	
	@Override
	public void run() {
		while(true){
			try{
				Thread.sleep(100);
				int msgs = applet.getSpeakerCnt();
				if(msgs>0){
					AudioMessage am = applet.getMessageForSpeaker();
					echoSound(am);
				}
			}catch(Exception e){};
		}
	}
	
	private void echoSound(AudioMessage am){
		try{
			Mixer speakerMixer=null;
			Mixer.Info infoArray[] = AudioSystem.getMixerInfo();
			for(int i=0;i<infoArray.length;i++){
				Mixer.Info info = infoArray[i];
				
				if(info.getDescription().contains("DirectSound")&&info.getName().contains("Speaker")){
					speakerMixer=AudioSystem.getMixer(info);
				}
			}
			AudioFormat format = new AudioFormat(16000, 8, 1, false, true);
		    //DataLine line = (DataLine)microPhoneMixer.getLineInfo().getLineClass();
		    DataLine.Info infoOut = new DataLine.Info(SourceDataLine.class, format); 
		    SourceDataLine lineOut = (SourceDataLine) speakerMixer.getLine(infoOut);
	        
	        lineOut.open(format);
	        lineOut.start();
	        
	        for(int i=0;i<am.getChunkSize();i++){
	        	lineOut.write(am.getBytes(i), 0, am.getBytes(i).length);
	        }
	        lineOut.stop();
	        lineOut.close();
		}catch(Exception e){}
	}

}
