package yakitengine;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import yakitdb.YaKitDerbyDB;

/**
 * Servlet implementation class RegisterServlet
 */
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    private String getLoginID(String query){
    	int indexStart = query.indexOf("?logid=");
    	int indexEnd = query.indexOf("?logun=");
    	return query.substring( (indexStart+7), indexEnd) ;
    }
    
    private String getLoginUN(String query){
    	int indexStart = query.indexOf("?logun=");
    	int indexEnd = query.indexOf("&sid=");
    	return query.substring( (indexStart+7), indexEnd) ;
    }
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String queryString = request.getQueryString();
		queryString = queryString.replaceAll("%20", " ");
		String id = getLoginID(queryString);
		String un = getLoginUN(queryString);

		String address = request.getRemoteAddr();
		System.out.println("Registration Request "+id+" un "+un+" from "+address);
		YaKitDerbyDB database = YaKitDerbyDB.getInstance();
		database.initialize();
		String msg="";
		boolean success = database.register(id,un);
		if(success){
			System.out.println("Success Register User sent email "+un);
			msg="registration success for "+un+" an email has been sent to you to complete registration process";
		}else{
			System.out.println("No Success Registering User "+un);
			msg="-1";
		}
		database.showTable("users");
		response.getWriter().write(msg);
		response.getWriter().close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
