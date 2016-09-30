package visitForm.models;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



import java.sql.Connection;


import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLIntegrityConstraintViolationException;

import java.util.ArrayList;
/**
 *
 * @author Administrator
 */
public class User {
   
    String username;
    public ArrayList<Patient> allPatients = new ArrayList<Patient>();
    public User(){
        
    }
    
    public void setUsername(String username){
        this.username = username;
    }
    
    public String getUsername(){
        return username;
    }

    public boolean isValidUser(String username, String password, Connection conn) throws SQLException {

       
        PreparedStatement stmt;
        
        stmt = conn.prepareStatement("SELECT password from allclinicians where username =?");
        stmt.setString(1,username);
        ResultSet rs = stmt.executeQuery();


        if (rs.isBeforeFirst()){
             while(rs.next()){
                String storedPass = rs.getString("password");
                if (storedPass.compareTo(password) == 0){
                    return true;
                }
            }
            return false;
        }
        return false;
    
    
    }
    
    
    public void registerUser(String username, String password, Connection conn) throws SQLException, SQLIntegrityConstraintViolationException {
       
        PreparedStatement stmt;

        stmt = conn.prepareStatement("INSERT INTO allclinicians (username, password) VALUES (?,?)");
        stmt.setString(1,username );
        stmt.setString(2,password );
        stmt.executeUpdate();
    }
    

    
    
    public void addShortlistedPatientsAndDates(String username, Connection conn) throws SQLException{
        
 
        PreparedStatement stmt = conn.prepareStatement("SELECT dates.Date,dates.filling,patients.PCpair_id, patients.name, patients.surname"+
                                            " FROM dates"+
                                            " RIGHT JOIN patients ON (dates.PCpair_id=patients.PCpair_id)"+
                                            " WHERE patients.Clinician=? AND patients.shortlisted=1"+
                                            " ORDER BY 3 ;",ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
         
        stmt.setString(1,username);
        ResultSet rs = stmt.executeQuery();
        
   
        int previousUserId =0;  
        Patient nextPatient = new Patient();  
        while(rs.next()){
             
                String date = rs.getString(1);
                String filling = rs.getString(2);
                int PCpair_id = rs.getInt(3);
               
                if (rs.isFirst()){
                   previousUserId = PCpair_id;
                }

                if (PCpair_id !=  previousUserId  ){//1ST PUT PATIENT CASE

                    nextPatient.setId(previousUserId);
                    rs.previous();
                    nextPatient.setName(rs.getString(4));
                    nextPatient.setSurname(rs.getString(5));
                    rs.next();

                    allPatients.add(nextPatient);

                    nextPatient = new Patient();
                    previousUserId = PCpair_id;

                }

                if (filling!=null){//for NULL, NULL, userID, name, surname rows -- no dates in dates table
                    nextPatient.addDate(date,filling);
                }

                if (rs.isLast()){//2nd PUT PATIENT CASE
                   nextPatient.setId(PCpair_id);
                   nextPatient.setName(rs.getString(4));
                   nextPatient.setSurname(rs.getString(5));
                   allPatients.add(nextPatient);
                }
              

         }
    }
}
