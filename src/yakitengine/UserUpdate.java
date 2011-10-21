package yakitengine;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Set;

import tester.iConWeb;

import yakitdb.YaKitDerbyDB;

public class UserUpdate implements Runnable{
	private HashMap<String,Long> userlist;
	private LinkedList<String> removedUsers = new LinkedList<String>();
	private Long timeoutLimit = new Long(15000);
	private iConWeb iconweb;
	private YaKitDerbyDB database;
	private HashMap<String,Integer> dbtoicon;
	
	@Override
	
	public void run() {
		System.out.println("Start user checker");
		while(true){
			try{
				
				Thread.sleep(10000);
				Set<String> keys = userlist.keySet();
				Iterator<String> it = keys.iterator();
				while(it.hasNext()){
					String key = it.next();
					Long userUpdate = userlist.get(key);
					if((userUpdate+timeoutLimit)<System.currentTimeMillis() ){
						System.out.println("A user has timed out. so remove from system "+key);
						try{
							Integer dkey = dbtoicon.remove(key);
							if(dkey!=null)
								iconweb.removeUser("rigi-lab-03.cs.uvic.ca", dkey);
							removedUsers.add(key);
						
							database.removeUserID(key);
						}catch(Exception ee){
							System.out.println("Error deleting from db or web remove"+key);
							ee.printStackTrace();
						}
					}
				}
				for(int i=0;i<removedUsers.size();i++){
					userlist.remove(removedUsers.get(i));
				}
			}catch(Exception e){
				System.out.println("Self timer error deleting users "+e);
				e.printStackTrace();
			}
		}
	}

	public UserUpdate(HashMap<String,Long> userlist,iConWeb iconweb,HashMap<String,Integer> dbtoicon,YaKitDerbyDB database){
		this.userlist=userlist;
		this.iconweb = iconweb;
		this.dbtoicon = dbtoicon;
		this.database = database;
	}
}
