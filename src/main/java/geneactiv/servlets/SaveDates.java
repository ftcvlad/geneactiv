/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.servlets;

import geneactiv.models.User;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import com.google.gson.Gson;
import geneactiv.models.DateManager;
/**
 *
 * @author Vlad
 */
@WebServlet(name = "SaveDates", urlPatterns = {"/saveDates"})
public class SaveDates extends HttpServlet {
         private DataSource dataSource;
    
    @Override
    public void init() throws ServletException {
		try {
                        dataSource = (DataSource) new InitialContext().lookup("java:comp/env/" + "jdbc/db");
			
		} catch (NamingException e) {
		}
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       

        Connection conn = null ;
        HttpSession session = request.getSession(false);
     
        User us = (User) session.getAttribute("user");
        String activeUserEmail = us.getUsername();
        
    
        try {
         
            conn= dataSource.getConnection();
         
            int pcpair_id =  Integer.parseInt(request.getParameter("id"));
            String[][] selectedData =  new Gson().fromJson(request.getParameter("data"), String[][].class);

            DateManager dm = new DateManager();
            dm.saveDates(activeUserEmail,conn,pcpair_id,selectedData);
            
        }
        catch (SQLException sqle){
            
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Database error");
        }
        catch(Exception  e){
             e.printStackTrace();
             response.setStatus(400);
             response.getWriter().write(e.getMessage());
        }
        finally{
                if (conn != null){
                    try {conn.close();} 
                    catch (SQLException ignore) { }
                }
        }
    }
    

}