/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package visitForm.servlets;

import visitForm.models.User;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.NamingException;
import javax.naming.InitialContext;
import java.sql.SQLIntegrityConstraintViolationException;
/**
 *
 * @author Vlad
 */
@WebServlet(name = "register", urlPatterns = {"/Register"})
public class Register extends HttpServlet {


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
       request.getRequestDispatcher("WEB-INF/register.jsp").forward(request, response);
    }

   
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        User us=new User();
        Connection conn =null;
       
        

        try{

          
            conn = dataSource.getConnection();
           
            if (password.equals("") || password.length()>16){
                request.setAttribute("message", "Password is 1-16 long");
                request.getRequestDispatcher("WEB-INF/register.jsp").forward(request, response);
            }
            else if (username.equals("") || username.length()>30){
                request.setAttribute("message", "Username is 1-30 long");
                request.getRequestDispatcher("WEB-INF/register.jsp").forward(request, response);
            }
            else{
                 us.registerUser(username, password, conn);
                 //request.getRequestDispatcher("WEB-INF/Login.jsp").forward(request, response);
                 response.sendRedirect("Login");
            }
             
           
            

        }
        catch (SQLIntegrityConstraintViolationException e){
             request.setAttribute("message", "Username taken");
             request.getRequestDispatcher("WEB-INF/register.jsp").forward(request, response);
        }
        catch (SQLException sqle){
            sqle.printStackTrace();
            request.setAttribute("message", "Database error");
            request.getRequestDispatcher("WEB-INF/register.jsp").forward(request, response);
        }
        
        finally{
             if (conn != null){
                 try {conn.close();} 
                 catch (SQLException ignore) { }
             }
        }
        
        
        
        
        
        
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
