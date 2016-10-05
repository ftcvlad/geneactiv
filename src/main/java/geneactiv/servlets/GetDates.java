/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.servlets;

import com.google.gson.Gson;
import geneactiv.models.DateManager;
import geneactiv.models.Patient;
import geneactiv.models.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

/**
 *
 * @author Vlad
 */
@WebServlet(name = "GetDates", urlPatterns = {"/getDates"})
public class GetDates extends HttpServlet {

    private DataSource dataSource;
    
    @Override
    public void init() throws ServletException {
		try {
                        dataSource = (DataSource) new InitialContext().lookup("java:comp/env/" + "jdbc/db");
			
		} catch (NamingException e) {
		}
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       

        Connection conn = null ;
        HttpSession session = request.getSession(false);
     
        User us = (User) session.getAttribute("user");
        String activeUserEmail = us.getUsername();
        
    
        try {
         
            conn= dataSource.getConnection();
         
            int pcpair_id =  Integer.parseInt(request.getParameter("id"));
            String[] datesToGet =  new Gson().fromJson(request.getParameter("allDates"),String[].class);
            boolean intraday = Boolean.parseBoolean(request.getParameter("intraday"));
            

            DateManager dm = new DateManager();
            String [][] responseArray = dm.getDates(datesToGet, activeUserEmail, conn, pcpair_id,intraday);
            
            String jsonResponse = new Gson().toJson(responseArray);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
             
            response.getWriter().print(jsonResponse);
            
            
        }
        catch (SQLException sqle){
                sqle.printStackTrace();
                response.setContentType("text/plain");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().print("Database error");
        }
        catch(Exception  e){
                e.printStackTrace();
                response.setContentType("text/plain");
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
