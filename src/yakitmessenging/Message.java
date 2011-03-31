package yakitmessenging;

public abstract class Message {
	public static int TEXT=0;
	public static int AUDIO=1;
	public static int VIDEO=2;
	
	private int type;
	protected Message(int type){
		this.type=type;
	}
	
	public int getType(){return type;}
	
}