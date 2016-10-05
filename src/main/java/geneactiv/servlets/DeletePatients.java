/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.servlets;

import com.google.gson.Gson;
import geneactiv.models.Patient;
import geneactiv.models.PatientManager;
import geneactiv.models.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
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
@WebServlet(name = "DeletePatients", urlPatterns = {"/deletePatients"})
public class DeletePatients extends HttpServlet {

    private DataSource dataSource;
    
    @Override
    public void init() throws ServletException {
		try {
                        dataSource = (DataSource) new InitialContext().lookup("java:comp/env/" + "jdbc/db");
			
		} catch (NamingException e) {
			e.printStackTrace();
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
            String[] idsToDel = new Gson().fromJson(request.getParameter("idArray"), String[].class);
            conn= dataSource.getConnection();
            PatientManager pm =new PatientManager();
            pm.deletePatients(activeUserEmail,conn,idsToDel);//delete from DB
            us.removePatientById(idsToDel);//remove from session
        }
        catch (SQLException sqle){
                sqle.printStackTrace();
                response.setContentType("text/plain");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Database error");
        }
        catch(Exception e){//if user changed value in <select>
                response.setStatus(400);
                response.setContentType("text/plain");
                response.getWriter().write("Bad input --shouldn't happen!");
        }
        finally{
                if (conn != null){
                    try {conn.close();} 
                    catch (SQLException ignore) { }
                }
        }
    }
}
