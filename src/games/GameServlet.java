package games;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class GameEngine
 */
public class GameServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private static int count=0;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GameServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		GameEngine engine = (GameEngine) this.getServletContext().getAttribute("gameengine");
		if(engine==null){
			response.getWriter().write("engine is null");
			this.getServletContext().setAttribute("gameengine", engine = new GameEngine());
			
		}else{
			response.getWriter().write("engine is avaiil");
		}
		count++;engine.count++;
		response.getWriter().write("Count is "+count+" engine count "+engine.count);
		response.getWriter().close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
