package yakitmessenging;

import java.util.HashMap;
import java.util.Random;

public class MessageEngine {
	private HashMap<Integer,Message> messages = new HashMap<Integer,Message>();
	private Random randomGen;
	
	public MessageEngine(){
		randomGen = new Random(4567);
	}
	public int addMessage(Message msg){
		int key = randomGen.nextInt();
		messages.put(key, msg);
		return key;
	}
	
	public Message getMessage(int key){
		return messages.get(key);
	}
}
