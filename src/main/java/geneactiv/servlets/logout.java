/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Vlad
 */
@WebServlet(name = "logout", urlPatterns = {"/logout"})
public class logout extends HttpServlet {

  
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        
        HttpSession session  = request.getSession(false);
        try
        {      
           
            session.removeAttribute("user");//to do it faster, garbage collector would do anyway after invalidate
            session.invalidate(); 
            
                                           
        }
        catch (Exception sqle)
        {
            System.out.println("error UserValidateServlet message : " + sqle.getMessage());
            System.out.println("error UserValidateServlet exception : " + sqle);
        }
        
    }
    
    
    

   

}
