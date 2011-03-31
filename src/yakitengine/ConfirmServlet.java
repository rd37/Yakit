package yakitengine;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import yakitdb.YaKitDerbyDB;

/**
 * Servlet implementation class ConfirmServlet
 */
public class ConfirmServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConfirmServlet() {
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
    	int indexEnd = query.indexOf("?logpw=");
    	return query.substring( (indexStart+7), indexEnd) ;
    }
    
    private String getLoginPW(String query){
    	int indexStart = query.indexOf("?logpw=");
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
		String pw = getLoginPW(queryString);
		System.out.println("Login Request "+id+" un "+un+" pw "+pw);
		YaKitDerbyDB database = YaKitDerbyDB.getInstance();
		database.initialize();
		boolean result= database.confirm(id,un,pw);
		String msg="";
		if(result){
			System.out.println("Successful confirm");
			msg="<html><head></head><body>confirmation complete please login at <a href='http://yakit.ca'>http://yakit.ca</a></body></html>";
		}else{
			System.out.println("Error confirming "+un);
			msg="confirmation of "+un+" failed";
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
