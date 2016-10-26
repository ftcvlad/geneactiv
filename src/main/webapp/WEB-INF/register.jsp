<%-- 
    Document   : Login
    Created on : 18-Sep-2016, 20:44:51
    Author     : Vlad
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Register</title>
        <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/authentication.css">
    </head>
    <body>
        
        <div class="container">

            <div id="login-form">

                <h3>Register</h3>

                <fieldset>

                    <form method="POST"  action="Register">
                        <input type="text" required name="username"  placeholder="Username (1-30 characters)" maxlength="30"> 
                        <input type="text" required name="password"  placeholder="Password (1-16 characters)" maxlength="16"> 
                        <input type="submit" value="Register">

                        <footer class="clearfix">
                          <p><span class="info">&#10140;</span><a href="Login">Login</a></p>
                        </footer>
                    </form>
                </fieldset>
                
                <ul>
                  <%
                       Object o = request.getAttribute("message");

                       if (o!=null){
                           String str =  (String) o;
                   %>  <li>     <%= str %>  </li>
                   <%
                       }
                   %>
                </ul>

            </div> <!-- end login-form -->
            
        </div>               
                         
    </body>
</html>
