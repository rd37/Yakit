package yakitmessenging;

public class AudioMessage extends Message {
	private String fileLocation="";
	public AudioMessage(int type) {
		super(type);
	}
	public void setFileLocation(String fileLocation) {
		this.fileLocation = fileLocation;
	}
	public String getFileLocation() {
		return fileLocation;
	}

}
