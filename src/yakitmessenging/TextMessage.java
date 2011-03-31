package yakitmessenging;

public class TextMessage extends Message {
	private String text = "";
	public TextMessage(int type) {
		super(type);
		
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getText() {
		return text;
	}

}
