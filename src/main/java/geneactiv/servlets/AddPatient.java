package geneactiv.servlets;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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

import geneactiv.models.PatientManager;

import com.google.gson.Gson;
import geneactiv.models.Patient;
import java.io.PrintWriter;
/**
 *
 * @author Vlad
 */
@WebServlet(urlPatterns = {"/addPatient"})
public class AddPatient extends HttpServlet {

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
        try {
            //creates empty lists as well
            Patient patient  = new Gson().fromJson(request.getParameter("data"), Patient.class);



            patient.setName(patient.getName().trim());
            patient.setSurname(patient.getSurname().trim());



            if (patient.getBirthDate()!=null){
                String[] parts = patient.getBirthDate().split("-");
                if (parts.length==3){
                    String dayStr = parts[2];
                    String yearStr = parts[0];
                    String monthStr = parts[1];

                    dayStr = (dayStr.length()==1) ? ("0"+dayStr): dayStr;
                    monthStr = (monthStr.length()==1) ? ("0"+monthStr): monthStr;
                    patient.setBirthDate(yearStr+"-"+monthStr+"-"+dayStr);
                }
            }


            if (patient.getName().equals("") && patient.getSurname().equals("")){
                  patient.setName("noname");
            }



          
            HttpSession session = request.getSession(false);

            User us = (User) session.getAttribute("user");
            String activeUserEmail = us.getUsername();
        
      
        

            conn= dataSource.getConnection();
            PatientManager pm = new PatientManager();
            pm.savePatient(activeUserEmail, patient,conn);
           
            
            us.allPatients.add(patient);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            String alias = patient.getName()+" "+patient.getSurname();
            response.getWriter().print("{\"id\":"+patient.getId()+",\"alias\":\""+ alias+"\"}");
           
           

        }
        catch (SQLException sqle){
                sqle.printStackTrace();
                response.setContentType("text/plain");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Database error");
        }
        catch (Exception e){
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
