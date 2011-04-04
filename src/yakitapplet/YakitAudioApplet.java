package yakitapplet;

import java.applet.Applet;
import java.awt.Graphics;
import java.util.LinkedList;

public class YakitAudioApplet extends Applet{
	/**
	 * 
	 */
	private static final long serialVersionUID = 7156043676407132658L;
	private SampleSound sampleSound;
	private EchoSound echoSound;
	private LinkedList<AudioMessage> sampledInputFromMIC = new LinkedList<AudioMessage>();
	private LinkedList<AudioMessage> outputForSpeaker = new LinkedList<AudioMessage>();
	private AudioMessage inMsg=null;
	private AudioMessage outMsg=null;
	private String msg="Yakit Audio System";
	
	/*
	 * Called from javascript to get next microphone message
	 */
	public int getMicMessageCount(){
		return sampledInputFromMIC.size();
	}
	
	/*
	 * Get Message Data Bytes at index in byte stream
	 */
	public byte[] getMicMessageBytes(int index){
		if(sampledInputFromMIC.size()==0){
			return null;
		}
		if(outMsg==null){
			outMsg=sampledInputFromMIC.removeFirst();
		}
		return outMsg.getBytes(index);
	}
	
	/*
	 * Called by Echo Sound class
	 */
	public int getSpeakerCnt(){
		return outputForSpeaker.size();
	}
	
	/*
	 * Called by Echo Sound class
	 */
	public AudioMessage getMessageForSpeaker(){
		return outputForSpeaker.removeFirst();
	}
	
	/*
	 * Called from SampleSound once a sample is taken from the microphone
	 */
	public void addAudioMessageFromMic(AudioMessage am){
		sampledInputFromMIC.add(am);
	}
	
	/*
	 * Called from the javascript to submit audio msg
	 */
	public void submitAudioMessageForSpeaker(){
		if(inMsg!=null){
			outputForSpeaker.add(inMsg);
			inMsg=null;
		}
	}
	
	/*
	 * called from java script to submit data into a message
	 * for the speakers.
	 */
	public void addAudioBytesForSpeaker(byte[] data){
		if(inMsg==null){
			inMsg=new AudioMessage();
		}
		inMsg.addBytes(data);
	}
	
	
	public void init(){
		sampleSound = new SampleSound(this);
		echoSound = new EchoSound(this);
		(new Thread(sampleSound)).start();
		(new Thread(echoSound)).start();
	}
	
	public void sendCommand(String msg){
		if(msg.equals("CollectAudio")){
			sampleSound.startCollectingAudio();
		}else if(msg.equals("StopCollectAudio")){
			sampleSound.stopCollectingAudio();
		}
	}
	
	public void paint(Graphics g){
		g.drawString(msg, 10, 10);
	}

	
}
