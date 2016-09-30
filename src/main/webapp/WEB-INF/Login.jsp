
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

        <head>
            
            <link rel="stylesheet" type="text/css" href="/visitFormMaven/static/authentication.css">
           
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Login</title>
            
        </head>
        <body>

                <div class="container">

                    <div id="login-form">

                      <h3>Login</h3>

                      <fieldset>

                        <form method="POST"  action="Login">
                          <input type="text" required name="username"  placeholder="Username (1-30 characters)" maxlength="30" > 
                          <input type="text" required name="password"  placeholder="Password (1-16 characters)" maxlength="16" > 
                          <input type="submit" value="Login">
                          
                          <footer class="clearfix">
                            <p><span class="info">&#10140;</span><a href="Register">Register</a></p>
                          </footer>
                        </form>
                      </fieldset>
                      
                      <ul>
                        <% Object errors =  request.getAttribute("messages");
                            if (errors!=null){
                                %>
                                <%@ page import="java.util.HashMap" %>
                                <%
                                    HashMap<String, String> map = (HashMap) errors;
                                    for (Object value : map.values()) {
                                         %>
                                         <li><%=(String) value %></li>
                                         <%
                                    }
                            }
                        %> 
                       
                    </ul>

                    </div> <!-- end login-form -->
                    
              </div>

        </body>
</html>