package yakitdb;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.Properties;

import yakitemail.JavaMail;

public class YaKitDerbyDB {
	private static YaKitDerbyDB database = new YaKitDerbyDB();
	
	private YaKitDerbyDB(){}
	
	public static YaKitDerbyDB getInstance(){return database;};
	
	/* the default framework is embedded*/
    //private String framework = "embedded";
    private String driver = "org.apache.derby.jdbc.EmbeddedDriver";
    private String protocol = "jdbc:derby:";
    
    private String litToolDB = "YaKitDataBase";
    private Connection conn;
    
    private PreparedStatement userInsert = null;
    private PreparedStatement userUpdate = null;
    private PreparedStatement userUpdateState = null;
    private PreparedStatement userRemove = null;
    
    private LinkedList<Statement> sqlStatements = new LinkedList<Statement>();
    private static boolean initialized=false;
	/*
	 * check if tables exist
	 * if so, then create groups,products,literature review, and reviews
	 * if not,
	 * then done.
	 */
	public void initialize(){
		if(initialized){
			return;
		}else{
			initialized=true;
		}
		/* 
		 * load the desired JDBC driver 
		 * Starts the derby service, but not database
		 * */
        loadDriver();
        try{
        	Properties props = new Properties(); // connection properties
            // providing a user name and password is optional in the embedded
            // and derby client frameworks
            props.put("user", "yakittool");
            props.put("password", "yakittool@929!");
            /*
             * This connection specifies create=true in the connection URL to
             * cause the database to be created when connecting for the first
             * time. To remove the database, remove the directory derbyDB (the
             * same as the database name) and its contents.
             *
             * The directory derbyDB will be created under the directory that
             * the system property derby.system.home points to, or the current
             * directory (user.dir) if derby.system.home is not set.
             */
            conn = DriverManager.getConnection(protocol + litToolDB
                    + ";create=true", props);

            System.out.println("Connected to and created database " + litToolDB);

            // We want to control transactions manually. Autocommit is on by
            // default in JDBC.
            conn.setAutoCommit(false);
            Statement s = conn.createStatement();
            try{
            	s.execute("create table users( id int primary key, username varchar(40),userpw varchar(40), userstate int ) ");
             }catch(Exception e){
            	// e.printStackTrace();
            	System.out.println("Tables created, carry on");
            }
            sqlStatements.add(s);
            
            userInsert = conn.prepareStatement("insert into users values (?, ?, ?, ?)");
            
            userUpdate = conn.prepareStatement("update users set username=? ,userpw=?,userstate=? where id=?");
            
            userUpdateState = conn.prepareStatement("update users set userstate=? where id=?");
            
            userRemove = conn.prepareStatement("delete from users where id=?");
            
        }catch(Exception e){
        	System.out.println("Unable to initialize database "+e);
        	e.printStackTrace();
        }
	}
	public void removeUserID(String id){
		int intID = (new Integer(id)).intValue();
		try{
			userRemove.setInt(1, intID);
			userRemove.executeUpdate();
			conn.commit();
		}catch(Exception e){
			System.out.println("Error removing id "+id);
			e.printStackTrace();
		}
	}
	public void updateUserState(String id,int state){
		int intID = (new Integer(id)).intValue();
		try{
			userUpdateState.setInt(1, state);
			userUpdateState.setInt(2, intID);
			userUpdateState.executeUpdate();
			conn.commit();
		}catch(Exception e){
			System.out.println("Error update user state "+id+" state "+state);
		}
		
	}
	public boolean checkids(String id,String un){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where username='"+un+"'");
			while(prodSet.next()){
				int tableid=prodSet.getInt(1);
				if(id.equals(""+tableid)){
					return true;
				}else{
					return false;
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return false;
	}
	
	public boolean confirm(String id,String un,String pw){
		ResultSet userentry;
		try {
			userentry = sqlStatements.get(0).executeQuery("select * from users where id="+id+" and username='"+un+"' and userpw='"+pw+"'");
			while(userentry.next()){
				userUpdateState.setInt(1, 3);
				userUpdateState.setInt(2, (new Integer(id).intValue()) );
				userUpdateState.executeUpdate();
				conn.commit();
				System.out.println("Confirmation of "+id+" un "+un+" pw "+pw+" completed");
				return true;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}
	
	public boolean register(String id,String un){
		//ensure un is not in use
		if(checkUser(un)){
			int state = getUserState(un);
			String pw = getUserPassword(un);
			int un_id = getUserID(un);
			if(state==2){//user already exists, but resend confirm email then
				JavaMail mail = new JavaMail();
				String msg = "please click on the confirm link below to complete registration \n"+
				"http://yakit.ca/Yakit/ConfirmServlet?logid="+un_id+"?logun="+un+"?logpw="+pw+"&sid="+pw+"\n"+
				"your username is "+un+"\n"+
				"your password is "+pw;
				System.out.println("Registration success for "+un+" try to send email ");
				mail.sendMail(un, msg);
				mail.sendMail("yakit.ca@gmail.com","New Registrant "+un);
				return true;
			}
			System.out.println("Unable to register this user, already registered "+un+" as id "+id);
			return false;
		}else{
			try{
				ResultSet userentry = sqlStatements.get(0).executeQuery("select * from users where id="+id);
				while(userentry.next()){
					int state = userentry.getInt(4);
					if(state==1){
						userUpdate.setString(1, un);
						int pwtmp=(int)(Math.random()*1000000);
						userUpdate.setString(2, ""+pwtmp);
						userUpdate.setInt(3, 2);
						userUpdate.setInt(4, (new Integer(id).intValue()));
						userUpdate.executeUpdate();
						conn.commit();
						//send email
						JavaMail mail = new JavaMail();
						String msg = "please click on the confirm link below to complete registration \n"+
						"http://yakit.ca/Yakit/ConfirmServlet?logid="+id+"?logun="+un+"?logpw="+pwtmp+"&sid="+pwtmp+"\n"+
						"your username is "+un+"\n"+
						"your password is "+pwtmp;
						System.out.println("Registration success for "+un+" try to send email ");
						mail.sendMail(un, msg);
						mail.sendMail("yakit.ca@gmail.com","New Registrant "+un);
						return true;
					}else{
						if(state==2){
							
						}else{
							System.out.println("Cannot Register, Must be in state 1 or 2");
							return false;
						}
					}
				}
				
			}catch(Exception e){
				System.out.println("Error REgistering user for some reason "+un+" id "+id);
				e.printStackTrace();
			}
		}
		return false;
	}
	
	public boolean verify(String un,String pw){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where username='"+un+"' AND userpw='"+pw+"'");
			int count=0;
			while(prodSet.next())
				count++;
			if(count==0)
				return false;
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	public int getUserID(String username){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where username='"+username+"'");
			while(prodSet.next()){//if user is in state 1 or 2 then return true;
				return prodSet.getInt(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return -1;
	}
	
	public int getUserState(String username){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where username='"+username+"'");
			while(prodSet.next()){//if user is in state 1 or 2 then return true;
				return prodSet.getInt(4);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return -1;
	}
	
	public String getUserName(String id){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where id="+id+"");
			while(prodSet.next()){//if user is in state 1 or 2 then return true;
				return prodSet.getString(2);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "guest";
	}
	
	public String getUserPassword(String username){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where username='"+username+"'");
			while(prodSet.next()){//if user is in state 1 or 2 then return true;
				return prodSet.getString(3);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "guest";
	}
	
	public boolean checkUser(String username){
		try {
			ResultSet prodSet = sqlStatements.get(0).executeQuery("select * from users where username='"+username+"'");
			int count=0;
			while(prodSet.next())
				count++;
			if(count==0)
				return false;
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	public String insertUser(String username,String userpw,int state){
		try{
			int id;
			userInsert.setInt(1, id = (int) (Math.random()*1000000) );
			userInsert.setString(2, username);
			userInsert.setString(3, userpw);
			userInsert.setInt(4, state);
			userInsert.executeUpdate();
			conn.commit();
			//conn.close();
			return ""+id;
		}catch(Exception e){
			System.out.println("Error:"+e);
		}
		return "error inserting new default user";
	}
	
	public void updateUser(String userid,String userip,String usergpslat,String usergpslong,String usergpsalt){
		
	}
	
	private void loadDriver() {
        try {
            Class.forName(driver).newInstance();
            System.out.println("Loaded the appropriate driver");
        } catch (ClassNotFoundException cnfe) {
            System.err.println("\nUnable to load the JDBC driver " + driver);
            System.err.println("Please check your CLASSPATH.");
            cnfe.printStackTrace(System.err);
        } catch (InstantiationException ie) {
            System.err.println(
                        "\nUnable to instantiate the JDBC driver " + driver);
            ie.printStackTrace(System.err);
        } catch (IllegalAccessException iae) {
            System.err.println(
                        "\nNot allowed to access the JDBC driver " + driver);
            iae.printStackTrace(System.err);
        }
    }
	
	public void showTable(String type){
		try{
			if(type.equals("users")){
				ResultSet set = this.sqlStatements.get(0).executeQuery("select * from users");
				System.out.println("****************Groups****************");
				System.out.println("| id \t\t| username \t| userpw \t| userstate \t| ");
				while(set.next()){ 
					System.out.println("|"+set.getInt(1)+"\t|"+set.getString(2)+"\t|"+set.getString(3)+"\t|"+set.getInt(4)+"\t|");
				}
				System.out.println("**************************************");
			}
		}catch(Exception e){
			System.out.println("error showing talbe "+e);
			e.printStackTrace();
		}
	}
}
