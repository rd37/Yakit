package yakitmessenging;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.StringTokenizer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import server.iConServer;
import tester.iConWeb;

/**
 * Servlet implementation class AudioMessagerServlet
 */
public class SendAudioMessengerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SendAudioMessengerServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		MessageEngine engine = (MessageEngine) this.getServletContext().getAttribute("messageengine");
		if(engine==null){
			//response.getWriter().write("message engine is null");
			this.getServletContext().setAttribute("messageengine", engine = new MessageEngine());	
		}
		
		iConServer iconserver = (iConServer) this.getServletContext().getAttribute("iconserver");
		if(iconserver==null){
			//response.getWriter().write("iconserver is null");
			this.getServletContext().setAttribute("iconserver", iconserver = iConServer.getInstance());
			iconserver.intialize(765, 18);
			iconserver.setUrl("rigi-lab-03.cs.uvic.ca");
		}else{
			//response.getWriter().write("iconserver is avaiil");
		}
		
		iConWeb iconweb = (iConWeb) this.getServletContext().getAttribute("iconweb");
		if(iconweb==null){
			//response.getWriter().write("iconweb is null");
			this.getServletContext().setAttribute("iconweb", iconweb = iConWeb.getInstance());
			iconweb.addServer(iconserver);
		}else{
			//response.getWriter().write("iconweb is avaiil");
		}
		
		HashMap<String,Integer> dbtoicon = (HashMap<String, Integer>) this.getServletContext().getAttribute("dbtoicon");
		if(dbtoicon==null){
			this.getServletContext().setAttribute("dbtoicon", dbtoicon = new HashMap<String,Integer>() );
		}
		
		//String queryString = request.getQueryString();
		String id = request.getParameter("logid");
		String lng = request.getParameter("lngit"); 
		String rad = request.getParameter("radii"); 
		String msgkey = request.getParameter("msgky"); 
		String lat = request.getParameter("latit"); 
		String address = request.getRemoteAddr();
		int userkey=dbtoicon.get(id);
		
		String coverres = iconweb.getCoverage("rigi-lab-03.cs.uvic.ca", address, (new Double(lat)).doubleValue(), (new Double(lng)).doubleValue(), userkey, iconserver.metersToDegree((new Double(rad)).doubleValue())  );
		StringTokenizer st = new StringTokenizer(coverres);
		int msgcount=0;
		//System.out.println("Now uupdate "+st.countTokens()+" users that audio message is in");
		while(st.hasMoreTokens()){
			int key = (new Integer(st.nextToken()));
			iconweb.addMessageKey("rigi-lab-03.cs.uvic.ca",key,(new Integer(msgkey)).intValue(),Message.AUDIO);
			msgcount++;
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		MessageEngine engine = (MessageEngine) this.getServletContext().getAttribute("messageengine");
		if(engine==null){
			//response.getWriter().write("message engine is null");
			this.getServletContext().setAttribute("messageengine", engine = new MessageEngine());
			
		}
		String queryString = request.getQueryString();
		String msg = request.getParameter("logid");
		String msg2 = request.getParameter("latit");
		//queryString = queryString.replaceAll("%20", " ");
		//System.out.println("SendAudioMessengerServler::rcvd on POST "+queryString);
		//System.out.println("SendAudioMessengerServler::rcvd on POST "+msg+" "+msg2);

		String state = request.getParameter("send_audiostate");
		String audio_key = request.getParameter("audio_key");
		//System.out.println("state "+state+" audiokey "+audio_key);
		int key=0;
		if(state!=null&&state.equals("2")){
			//System.out.println("SendAudioMessageServlet::create new audio message");
			AudioMessage audioMsg = new AudioMessage(Message.AUDIO);
			key = engine.addMessage(audioMsg);
			response.getWriter().write( ""+key );  
		}else if(state!=null&&state.equals("3")){
			/*String msgString = request.getParameter("data_string");
			System.out.println("RCvd "+msgString.length());
			AudioMessage audioMSG = (AudioMessage) engine.getMessage((new Integer(audio_key)).intValue());
	        audioMSG.addBytes(msgString.getBytes());*/
			DataInputStream din = new DataInputStream(request.getInputStream());   
			byte[] data = new byte[0];
	        byte[] buffer = new byte[512];   
	        int bytesRead;   
	        while ((bytesRead = din.read(buffer)) > 0 ) {   
	        	//System.out.println("Just read in "+bytesRead+" into buffer ");
	        	//System.out.println(new String(buffer));
	            // construct large enough array for all the data we now have   
	        	//System.out.println("Read in "+bytesRead+" bytes");
	            byte[] newData = new byte[data.length + bytesRead];   
	            // copy data previously read   
	            System.arraycopy(data, 0, newData, 0, data.length);   
	            // append data newly read   
	            System.arraycopy(buffer, 0, newData, data.length, bytesRead);   
	            // discard the old array in favour of the new one   
	            data = newData;   
	        } 
	        
	        AudioMessage audioMSG = (AudioMessage) engine.getMessage((new Integer(audio_key)).intValue());
	        audioMSG.addBytes(data);
		}else{
			System.out.println("no state specifed, maybe data");
		}
		
		response.getWriter().close();
	}

}
