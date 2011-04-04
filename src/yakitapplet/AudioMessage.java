package yakitapplet;

import java.util.LinkedList;

public class AudioMessage {
	int bytesize=0;
	private LinkedList<byte[]> message;//
	
	public AudioMessage(){
		message = new LinkedList<byte[]>();
	}
	
	public int getChunkSize(){
		return message.size();
	}
	
	public void addBytes(byte[] data){
		bytesize+=data.length;
		message.add(data);
	}
	
	public byte[] getBytes(int index){
		try{
			return message.get(index);
		}catch(Exception e){}
		return null;
	}
}
