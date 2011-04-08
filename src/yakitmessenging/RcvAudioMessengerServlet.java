package yakitmessenging;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import server.iConServer;
import tester.iConWeb;

/**
 * Servlet implementation class RcvAudioMessengerServlet
 */
public class RcvAudioMessengerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RcvAudioMessengerServlet() {
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
			
		}else{
			//response.getWriter().write("message engine is avaiil");
		}
		iConServer iconserver = (iConServer) this.getServletContext().getAttribute("iconserver");
		if(iconserver==null){
			//response.getWriter().write("iconserver is null");
			this.getServletContext().setAttribute("iconserver", iconserver = iConServer.getInstance());
			iconserver.intialize(765, 7);
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
		
		
		String id = request.getParameter("logid");
		String op = request.getParameter("opera");
		String messagekey = request.getParameter("msgky"); 
		String dataindex = request.getParameter("index");
		//String address = request.getRemoteAddr();
		int userkey=dbtoicon.get(id);
		
		if(op.equals("GetAudioMessageKey")){
			//System.out.println("Get next audio message key and send back to client java script");
			int ret[] =iconweb.getAudioMessageKey("rigi-lab-03.cs.uvic.ca",userkey);
			//int countleft=ret[0];
			int msgkey=ret[1];
			AudioMessage textMsg = (AudioMessage) engine.getMessage(msgkey);
			String returnmessage="";
			if(textMsg!=null){
				//System.out.println("get messages "+textMsg.getText());
				returnmessage=""+msgkey;
			}else{
				//System.out.println("get messages, there are no messages waiting");
				returnmessage="";
			}
			response.getWriter().write(returnmessage);
		}else if(op.equals("GetAudioBytes")){//maybe tough
			//System.out.println("Get Audio Bytes from Audio message and send bytes bakc to java script using index "+dataindex);
			AudioMessage textMsg = (AudioMessage) engine.getMessage((new Integer(messagekey)));
			byte[] data = textMsg.getBytes((new Integer(dataindex)));
			
			if(data!=null){
				response.getWriter().write(new String(data));
			}else{
				//System.out.println("End of audio message return -1");
				response.getWriter().write(-1);
			}
			response.getWriter().close();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
