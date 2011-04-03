package yakitapplet;

import java.applet.Applet;
import java.awt.Graphics;
import java.util.LinkedList;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.SourceDataLine;
import javax.sound.sampled.TargetDataLine;

public class YakitAudioApplet extends Applet implements Runnable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7156043676407132658L;
	private String msg="yakit audio 5";
	private int retrieveAudio=-1;;
	private LinkedList<byte[]> list;
	private Mixer speakerMixer;
	private DataLine.Info infoOut;
	private AudioFormat format;
	
	public void init(){
		Thread thisThread = new Thread(this);
		thisThread.start();
	}
	
	public void sendCommand(String msg){
		if(msg.equals("CollectAudio")){
			retrieveAudio=1;
		}else if(msg.equals("StopCollectAudio")){
			retrieveAudio=0;
		}else
			retrieveAudio=-1;
	}
	
	public void echoSound(){
		try{
			System.out.println("Output audio Collected");
	        SourceDataLine lineOut = (SourceDataLine) speakerMixer.getLine(infoOut);
	        //SourceDataLine lineOut = (SourceDataLine) AudioSystem.getLine(infoOut);
	        lineOut.open(format);
	        lineOut.start();
	        
	        int index=0;
	        while(index<list.size()){
	        	lineOut.write(list.get(index), 0, list.get(index).length);
	        	index++;
	        }
	        lineOut.stop();
	        lineOut.close();
	        retrieveAudio=-1;
		}catch(Exception e){};
	}
	@Override
	public void run() {
		while(true){
			try{
				Thread.sleep(500);
				if(retrieveAudio==1){
					retrieveAudio=-1;
					this.sampleSound();
				}
				if(retrieveAudio==0)
					this.echoSound();
			}catch(Exception e){}
		}
	}
	
	public void sampleSound(){
				this.msg="type audio capture and relay";this.repaint();
				Mixer microPhoneMixer=null;
				speakerMixer=null;
				Mixer.Info infoArray[] = AudioSystem.getMixerInfo();
				for(int i=0;i<infoArray.length;i++){
					Mixer.Info info = infoArray[i];
					System.out.println(i+":"+info.getDescription()+","+info.getName());
					if(info.getName().contains("Primary Sound Capture")){
						microPhoneMixer=AudioSystem.getMixer(info);
					}
					if(info.getDescription().contains("DirectSound")&&info.getName().contains("Speaker")){
						System.out.println("Found Speakers");
						speakerMixer=AudioSystem.getMixer(info);
						//break;
					}
				}
				if(microPhoneMixer==null){
					System.out.println("Please Plugin in or turn on you microphone");
					System.exit(0);
				}
				/*Line.Info[] lines = microPhoneMixer.getSourceLineInfo();
				for(int i=0;i<lines.length;i++){
					System.out.println("L"+i+":"+lines[i].toString());
				}*/
			    format = new AudioFormat(16000, 8, 1, false, true);
			    //DataLine line = (DataLine)microPhoneMixer.getLineInfo().getLineClass();
			    DataLine.Info infoIn = new DataLine.Info(TargetDataLine.class, format); 
			    infoOut = new DataLine.Info(SourceDataLine.class, format); 
			    if (!AudioSystem.isLineSupported(infoIn)||!AudioSystem.isLineSupported(infoOut)) {
			        System.err.println("Line error  not supported ");
			        System.exit(0);
			    }
			   
				    try {
				        TargetDataLine lineIn = (TargetDataLine) microPhoneMixer.getLine(infoIn);
				        
				        lineIn.open(format);
				        System.out.println("Line is open start reading till buffer full");
				        //ByteArrayOutputStream[] out  = new ByteArrayOutputStream[10];
				        
				        int numBytesRead;
				        int totalBytesRead=0;
				        //byte[] data = new byte[lineIn.getBufferSize() / 5];
				        list = new LinkedList<byte[]>();
				        
				        // Begin audio capture.
				        lineIn.start();
			
				        // Here, stopped is a global boolean set by another thread.
				        int index=0;
				        while (totalBytesRead<50000) {
				           // Read the next chunk of data from the TargetDataLine.
				           byte[] data = new byte[lineIn.getBufferSize() / 5];
				           numBytesRead =  lineIn.read(data, 0, data.length);
				           // Save this chunk of data.
				           totalBytesRead+=numBytesRead;
				           //System.out.println("Read so far "+totalBytesRead);
				           //out[index].write(data, 0, numBytesRead);
				           list.add(data);
				           index++;
				        }     
				        lineIn.stop();
				        lineIn.close();
				        
				    } catch (LineUnavailableException ex) {
				       	System.out.println("Error occured "+ex);
				       	ex.printStackTrace();
				    }
				this.repaint();
			
	}
	
	public void paint(Graphics g){
		g.drawString(msg, 10, 10);
	}

	
}
