/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import geneactiv.models.User;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.sql.SQLException;

import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import java.sql.Connection;
import javax.naming.NamingException;
import javax.naming.InitialContext;
import java.util.ArrayList;



import com.google.gson.Gson;
import geneactiv.models.Patient;
import java.io.PrintWriter;
import geneactiv.models.PatientManager;

/**
 *
 * @author Vlad
 */
@WebServlet(name = "FindPatients", urlPatterns = {"/findPatients"})
public class FindPatients extends HttpServlet {



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
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       
       
        
        String nameToFind = request.getParameter("name");
        
        
        Connection conn = null ;
        HttpSession session = request.getSession(false);
     
        User us = (User) session.getAttribute("user");
        String activeUserEmail = us.getUsername();
        
      
        try {

            conn= dataSource.getConnection();
         
            
            PatientManager pm =new PatientManager();
            ArrayList<Patient> allPatients = pm.findPatientsAndDates(nameToFind,activeUserEmail,conn);
            
            //Gson gson = new com.google.gson.GsonBuilder().setPrettyPrinting().create();
            //System.out.println(jsonResponse);
            String jsonResponse  = new Gson().toJson(allPatients);

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
        finally{
                if (conn != null){
                    try {conn.close();} 
                    catch (SQLException ignore) { }
                }
        }
         


    }


}



