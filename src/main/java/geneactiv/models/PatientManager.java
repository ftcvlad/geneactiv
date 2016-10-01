/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.models;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
/**
 *
 * @author Vlad
 */
public class PatientManager {
    
    
    public void savePatient(String activeUserEmail,Patient patient, Connection conn) throws SQLException{
      
          PreparedStatement stmt = conn.prepareStatement("INSERT INTO patients( Clinician, birthDate, name, surname,shortlisted)"+
                                           " VALUES (?,?,?,?,1);", 1);
                                                                   
          stmt.setString(1, activeUserEmail);      
          stmt.setString(2, patient.getBirthDate());    
          stmt.setString(3, patient.getName());  
          stmt.setString(4, patient.getSurname()); 
      
          stmt.execute();
          
           
          ResultSet  rs = stmt.getGeneratedKeys();
          rs.next();

          patient.setId(rs.getInt(1));//last_inserted_id 
          
    }
    
    
     public ArrayList<Patient> getShortlistedPatientsAndDates(String username, Connection conn) throws SQLException{
        
 
        PreparedStatement stmt = conn.prepareStatement("SELECT dates.Date,dates.filling,patients.PCpair_id, patients.name, patients.surname, patients.birthDate"+
                                            " FROM dates"+
                                            " RIGHT JOIN patients ON (dates.PCpair_id=patients.PCpair_id)"+
                                            " WHERE patients.Clinician=? AND patients.shortlisted=1"+
                                            " ORDER BY 3 ;",ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
        stmt.setString(1,username);
       
        return  createPatientList(stmt);
    }
    
    

     public ArrayList<Patient> findPatientsAndDates(String nameToFind, String activeUserEmail, Connection conn) throws SQLException{
         
            String nameCondition="";
            if (!nameToFind.equals("")){
                nameCondition = "AND patients.name=?";
            }

            PreparedStatement stmt = conn.prepareStatement("SELECT dates.Date,dates.filling,patients.PCpair_id, patients.name, patients.surname, patients.birthDate"+
                                              " FROM dates"+
                                              " RIGHT JOIN patients ON (dates.PCpair_id=patients.PCpair_id)"+
                                              " WHERE patients.Clinician=? "+nameCondition+
                                              " ORDER BY 3 ;",ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);

            stmt.setString(1,activeUserEmail);
            if (!nameToFind.equals("")){
                stmt.setString(2, nameToFind);
            }

            return createPatientList(stmt);
     }
     
     
     
     private ArrayList<Patient> createPatientList(PreparedStatement stmt) throws SQLException{
        ResultSet rs = stmt.executeQuery();
      
        int previousUserId =0;  
        Patient nextPatient = new Patient();  
        ArrayList<Patient> myPatients = new  ArrayList<>();
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
                    nextPatient.setBirthDate(rs.getString(6));
                    rs.next();

                    myPatients.add(nextPatient);

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
                   nextPatient.setBirthDate(rs.getString(6));
                   myPatients.add(nextPatient);
                }
              

        }
        return myPatients;
     }
     
    public void deletePatients(String activeUserEmail, Connection conn, String[] idsToDelete)throws SQLException{

            String whereStr="WHERE Clinician =? AND (";
            for (String id : idsToDelete){
                whereStr+="PCpair_id=?||";
            }
            whereStr = whereStr.substring(0,whereStr.length()-2);

            PreparedStatement stmt = conn.prepareStatement("DELETE FROM patients "+whereStr+");");

            stmt.setString(1,activeUserEmail);
            for (int i=0;i<idsToDelete.length;i++){
                stmt.setString(i+2, idsToDelete[i]);

            }

            stmt.execute();
   
    }
    
    public int delistPatient(String activeUserEmail, int idToDelist,Connection conn ) throws SQLException{
        
        
        PreparedStatement stmt = conn.prepareStatement("UPDATE patients "+
                " SET shortlisted=0"+
                " WHERE Clinician=? AND PCpair_id=?");
                
        stmt.setString(1,activeUserEmail);    
        stmt.setInt(2,idToDelist);
        
        return stmt.executeUpdate();
    }
    
    
    public int enlistPatients(String activeUserEmail, ArrayList<Patient> addedPatients,Connection conn ) throws SQLException{
        
        if (addedPatients.size()>0){
                String inString="";
                for (Patient p:addedPatients){
                    inString+=p.getId()+",";
                }
                inString = inString.substring(0,inString.length()-1);

                PreparedStatement stmt = conn.prepareStatement("UPDATE patients "+
                        " SET shortlisted=1"+
                        " WHERE Clinician=? AND ((PCpair_id) IN ("+inString+"))");

                stmt.setString(1,activeUserEmail);    


                return stmt.executeUpdate();
        }
        return 0;
        
        
    }
    
}
