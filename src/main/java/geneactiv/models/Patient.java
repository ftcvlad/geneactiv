/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.models;
import java.util.ArrayList;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
/**
 *
 * @author Vlad
 */
public class Patient {
    
    ArrayList<String> fullDates = new ArrayList<String>();
    ArrayList<String> partDates = new ArrayList<String>();
    String name;
    String surname;
    String birthDate;
    int id;
    
    
    public Patient(){
        
    }
    

   
    public void addDate(String date, String filling){
        if (filling.equals("full")){
            fullDates.add(date);
        }
        else if (filling.equals("part")){
            partDates.add(date);
        }
    }
    
    
    
    public void setId(int id){
       this.id = id;
    }
    
    public void setName(String name){
        this.name = name;
    }
    
    public void setSurname(String surname){
        this.surname = surname;
    }
    
    public String getName(){
        return this.name ;
    }
    
    public String getSurname(){
        return this.surname ;
    }
    
    public int getId(){
        return this.id ;
    }
    
    public ArrayList<String> getFullDates(){
        return this.fullDates ;
    }

    
    public ArrayList<String> getPartDates(){
        return this.partDates ;
    }
    
    
    public void setBirthDate(String birthDate){
        this.birthDate = birthDate;
    }
    
    public String getBirthDate(){
        return this.birthDate;
    }
    
    public void setFullDates(){
        this.fullDates = new ArrayList<>(); 
    }
    public void setPartDates(){
        this.partDates = new ArrayList<>(); 
    }
    
    
    public void save(String activeUserEmail, Connection conn) throws SQLException{
      
          PreparedStatement stmt = conn.prepareStatement("INSERT INTO patients( Clinician, birthDate, name, surname,shortlisted)"+
                                           " VALUES (?,?,?,?,1);", 1);
                                                                   
          stmt.setString(1, activeUserEmail);      
          stmt.setString(2, this.birthDate);    
          stmt.setString(3, this.name);  
          stmt.setString(4, this.surname); 
      
          stmt.execute();
          
           
          ResultSet  rs = stmt.getGeneratedKeys();
          rs.next();
            
          id= rs.getInt(1);//last_inserted_id 
          
    }
}
