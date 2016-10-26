package geneactiv.servlets;

import geneactiv.models.User;
import geneactiv.models.PatientManager;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.Map;
import java.util.HashMap;
import javax.servlet.RequestDispatcher;


import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.NamingException;
import javax.naming.InitialContext;


@WebServlet(urlPatterns = {"/Login"})
public class Login extends HttpServlet {

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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        System.out.println("I am Login get and I feel alright :)");
        request.getRequestDispatcher("WEB-INF/Login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        Map<String, String> messages = new HashMap<String, String>();

        if (username == null || username.isEmpty()) {
            messages.put("username", "Please enter username");
        }

        if (password == null || password.isEmpty()) {
            messages.put("password", "Please enter password");
        }

        if (messages.isEmpty()) {
            
            Connection conn =null;
            User us=new User();
            try{
               
                long start = System.currentTimeMillis();
                conn = dataSource.getConnection();
                boolean isValid = us.isValidUser(username, password, conn);
                 System.out.println("Time passed: "+(System.currentTimeMillis()-start));
               
                if (isValid){
                    us.setUsername(username);
                   
                    PatientManager pm = new PatientManager();
                    us.setAllPatients(pm.getShortlistedPatientsAndDates(username,conn));
                   
                    //request.getSession().setAttribute("user", us);//here session created!

                    HttpSession session = request.getSession();
//                    session.setMaxInactiveInterval(10);
                    session.setAttribute("user", us);
                    
                    
                    response.sendRedirect(request.getContextPath()+"/");
                    return;
                }
                else{
                     messages.put("login", "Login or password incorrect");
                }
                   
            }
            catch (SQLException sqle){
                sqle.printStackTrace();
                messages.put("login", "Database error");
            }
            finally{
                 if (conn != null){
                     try {conn.close();} 
                     catch (SQLException ignore) { }
                 }
            }
        }

        request.setAttribute("messages", messages);
        request.getRequestDispatcher("WEB-INF/Login.jsp").forward(request, response);
    }

}