package yakitmessenging;

import java.util.LinkedList;

public class AudioMessage extends Message {
	private String fileLocation="";
	LinkedList<byte[]> audioData=new LinkedList<byte[]>();
	
	public AudioMessage(int type) {
		super(type);
	}
	public void setFileLocation(String fileLocation) {
		this.fileLocation = fileLocation;
	}
	public String getFileLocation() {
		return fileLocation;
	}
	public void addBytes(byte[] data){
		audioData.add(data);
	}
	public byte[] getBytes(int index){
		if(index<audioData.size())
			return audioData.get(index);
		else
			return null;
	}
}
