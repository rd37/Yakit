package yakitemail;
import javax.mail.*; 
import javax.mail.internet.*; 
import javax.activation.*; 
//import java.io.*; 
import java.util.Properties; 

public class JavaMail {
	public JavaMail(){};
	
	public void sendMail(String to,String msg){
		try {
			String[] att = new String[0];
			sendMail("smtp.uvic.ca","yakit.ca@gmail.com",to,"YaKit Registration",msg,att);
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendMail(String mailServer, String from, String to, 
            String subject, String messageBody, 
            String[] attachments) throws MessagingException, AddressException 
	{ 
		// Setup mail server 
		Properties props = System.getProperties(); 
		props.put("mail.smtp.host", mailServer); 
		
		// Get a mail session 
		Session session = Session.getDefaultInstance(props, null); 
		
		// Define a new mail message 
		Message message = new MimeMessage(session); 
		message.setFrom(new InternetAddress(from)); 
		message.addRecipient(Message.RecipientType.TO, new InternetAddress(to)); 
		message.setSubject(subject); 
		
		// Create a message part to represent the body text 
		BodyPart messageBodyPart = new MimeBodyPart(); 
		messageBodyPart.setText(messageBody); 
		
		//use a MimeMultipart as we need to handle the file attachments 
		Multipart multipart = new MimeMultipart(); 
		
		//add the message body to the mime message 
		multipart.addBodyPart(messageBodyPart); 
		
		// add any file attachments to the message 
		addAttachments(attachments, multipart); 
		
		// Put all message parts in the message 
		message.setContent(multipart); 
		
		// Send the message 
		Transport.send(message); 
	} 

	protected void addAttachments(String[] attachments, Multipart multipart) 
    throws MessagingException, AddressException 
	{ 
		for(int i = 0; i<= attachments.length -1; i++) 
		{ 
			String filename = attachments[i]; 
			MimeBodyPart attachmentBodyPart = new MimeBodyPart(); 
			
			//use a JAF FileDataSource as it does MIME type detection 
			DataSource source = new FileDataSource(filename); 
			attachmentBodyPart.setDataHandler(new DataHandler(source)); 
			
			//assume that the filename you want to send is the same as the 
			//actual file name - could alter this to remove the file path 
			attachmentBodyPart.setFileName(filename); 
			
			//add the attachment 
			multipart.addBodyPart(attachmentBodyPart); 
		} 
	} 

	public void test(){
		String server="pop3.uvic.ca"; 
        String from="yakit@gmail.com"; 
        String to = "ron.desmarais@gmail.com"; 
        String subject="yakit yak"; 
        String message="yak testingTesting"; 
        String[] filenames = {"c:\\someefile.txt"}; 
     
        try {
			sendMail(server,from,to,subject,message,filenames);
		} catch (AddressException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
