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
	
	public String getMicMessageBytesAsString(int index){
		byte[] data = this.getMicMessageBytes(index);
		
		//System.out.println("bytes "+data);
		if(data==null)
			return null;
		String retString = new String();
		for(int i=0;i<data.length;i++){
			retString=retString+""+this.getStringFrom(data[i]);
		}
		return retString;
	}
	/*
	 * Get Message Data Bytes at index in byte stream
	 */
	public byte[] getMicMessageBytes(int index){
		if(sampledInputFromMIC.size()==0&&outMsg==null){
			return null;
		}
		if(outMsg==null){
			outMsg=sampledInputFromMIC.removeFirst();
		}
		byte[] ret= outMsg.getBytes(index);
		if(ret==null)
			outMsg=null;
		return ret;
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
		//this.outputForSpeaker.add(am);
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
	
	public void addAudioBytesForSpeakerFromString(String data){
		int numTokens=data.length();
		byte[] bytedata = new byte[numTokens/8];
		for(int i=0;i<numTokens;i=i+8){
			 String strbyte = data.substring(i, i+8);
			 bytedata[i/8]=this.getByteFromString(strbyte);
		}
		this.addAudioBytesForSpeaker(bytedata);
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

	private String getStringFrom(byte data){
		String strbyte = "";
		if( (data & 0x80)==128){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		//System.out.println(data+" "+(data & 0x40));
		if( (data & 0x40)==64){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		
		if( (data & 0x20)==32){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		
		if( (data & 0x10)==16){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		
		if( (data & 0x08)==8){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		
		if( (data & 0x04)==4){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		
		if( (data & 0x02)==2){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		
		if( (data & 0x01)==1){
			strbyte=strbyte+"1";
		}else{
			strbyte=strbyte+"0";
		}
		return strbyte;
	}
	
	public byte getByteFromString(String byteString){
		byte ret =0x00;
		char c1 = byteString.charAt(0);
		if(c1=='1'){
			ret=(byte) (ret|0x80);
		}
		char c2 = byteString.charAt(1);
		if(c2=='1'){
			ret=(byte) (ret|0x40);
		}
		char c3 = byteString.charAt(2);
		if(c3=='1'){
			ret=(byte) (ret|0x20);
		}
		char c4 = byteString.charAt(3);
		if(c4=='1'){
			ret=(byte) (ret|0x10);
		}
		char c5 = byteString.charAt(4);
		if(c5=='1'){
			ret=(byte) (ret|0x08);
		}
		char c6 = byteString.charAt(5);
		if(c6=='1'){
			ret=(byte) (ret|0x04);
		}
		char c7 = byteString.charAt(6);
		if(c7=='1'){
			ret=(byte) (ret|0x02);
		}
		char c8 = byteString.charAt(7);
		if(c8=='1'){
			ret=(byte) (ret|0x01);
		}
		return ret;
	}
}
