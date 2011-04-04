package yakitapplet;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.TargetDataLine;

public class SampleSound implements Runnable{
	private YakitAudioApplet applet;
	private boolean collectAudio=false;
	private AudioMessage audioMessage=null;
	private TargetDataLine lineIn;
	
	public SampleSound(YakitAudioApplet applet){
		this.applet=applet;
	}
	
	public void startCollectingAudio(){
		collectAudio=true;
	}
	
	public void stopCollectingAudio(){
		collectAudio=false;
	}
	
	@Override
	public void run() {
		while(true){
			try{
				Thread.sleep(100);
				if(collectAudio){
					if(audioMessage==null){
						this.initializeAudio();
						audioMessage = new AudioMessage();
					}
					/*
					 * fill only a couple of bytes then check collect audio again
					 * if read bytes exceed 50000 bytes (3 secs) then end loop 
					 */
					int numBytesRead;
			        int totalBytesRead=0;
			        while (totalBytesRead<50000&&collectAudio) {
			           byte[] data = new byte[lineIn.getBufferSize() / 5];
			           numBytesRead =  lineIn.read(data, 0, data.length);
			           totalBytesRead+=numBytesRead;
			           audioMessage.addBytes(data);
			        }     
				}else{
					if(audioMessage!=null){//a message was collected so store it in applet to be sent to servlet
						applet.addAudioMessageFromMic(audioMessage);
						audioMessage=null;
						lineIn.stop();
				        lineIn.close();
					}
				}
			}catch(Exception e){}
		}
	}
	
	private void initializeAudio(){
		Mixer microPhoneMixer=null;
		Mixer.Info infoArray[] = AudioSystem.getMixerInfo();
		for(int i=0;i<infoArray.length;i++){
			Mixer.Info info = infoArray[i];
			if(info.getName().contains("Primary Sound Capture")){
				microPhoneMixer=AudioSystem.getMixer(info);
			}
		}
		if(microPhoneMixer==null){
			System.out.println("Please Plugin in or turn on you microphone");
			System.exit(0);
		}
		AudioFormat format = new AudioFormat(16000, 8, 1, false, true);
	    DataLine.Info infoIn = new DataLine.Info(TargetDataLine.class, format); 
	    if (!AudioSystem.isLineSupported(infoIn)) {
	        System.err.println("Line error  not supported ");
	        System.exit(0);
	    }
	    try {
	        lineIn = (TargetDataLine) microPhoneMixer.getLine(infoIn);
	        lineIn.open(format);
	        lineIn.start();
	    } catch (LineUnavailableException ex) {
	       	System.out.println("Error occured "+ex);
	       	ex.printStackTrace();
	    }
	}
}
