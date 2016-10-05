/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.servlets;

import geneactiv.models.PatientManager;
import geneactiv.models.User;
import java.io.IOException;
import java.io.PrintWriter;
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
import java.util.ArrayList;
import geneactiv.models.Patient;
        
import com.google.gson.reflect.TypeToken;
/**
 *
 * @author Vlad
 */
@WebServlet(name = "AddToShortlist", urlPatterns = {"/addToShortlist"})
public class AddToShortlist extends HttpServlet {

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
        
        String json = request.getParameter("patients");
     
        
        
        
      

        try {
            ArrayList<Patient> selectedPatientsForEnlist = new Gson().fromJson(json, new TypeToken<ArrayList<Patient>>(){}.getType());
            ArrayList<Patient> addedPatients = us.addNonRepeatingPatients(selectedPatientsForEnlist);//add to session
            
            for (Patient o : addedPatients){
                System.out.println("--> " +o.getId());
            }
            
            
            conn= dataSource.getConnection();
            PatientManager pm =new PatientManager();
            pm.enlistPatients(activeUserEmail, addedPatients, conn);//set shortlisted =1 in DB
            
            String jsonResponse  = new Gson().toJson(addedPatients);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().print(jsonResponse);
        }
        catch (SQLException sqle){
                sqle.printStackTrace();
                response.setContentType("text/plain");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Database error");
        }
        catch(Exception  nfe){
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
