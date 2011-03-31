package yakitmessenging;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class AudioMessagerServlet
 */
public class AudioMessengerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AudioMessengerServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		MessageEngine engine = (MessageEngine) this.getServletContext().getAttribute("messageengine");
		if(engine==null){
			response.getWriter().write("message engine is null");
			this.getServletContext().setAttribute("messageengine", engine = new MessageEngine());
			
		}else{
			response.getWriter().write("message engine is avaiil");
		}
		/*
		 * 1. Determine if operation of user i.e. submit audiofile or get audiofiles
		 * 2. Get userkey, position, radius //radius if submit
		 * 3. if submit audio file
		 * 		3a. buffer the input file read from user
		 * 		3b. save buffer to file system
		 * 		3c. create AudioMessage object
		 *      3d. add message object to MessageEngine and get key back
		 *      3e. use position and radius to list of users nearby
		 *      3f. use keys to update each user ojbect with new audio msg key
		 *      3g. Create text message for sender on completion
		 * 4. if get audio file
		 * 		4a. access user object with user key and get list of audio key remaining
		 *      4b. send back audio list
		 * close 
		 */
		response.getWriter().close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
