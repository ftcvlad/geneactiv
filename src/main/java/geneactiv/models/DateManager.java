/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package geneactiv.models;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
/**
 *
 * @author Vlad
 */
public class DateManager {
    
    
    
    public HashMap<String,ArrayList<String>>  saveDates(String activeUserEmail, Connection conn, int pcpair_id, String[][]  selectedData) throws ValidationException, SQLException, Exception{
        
        if (selectedData.length!=1441){
                 throw new Exception("Bad input: != 1441");    
        }
 //AUTHENTICATION            
        try (PreparedStatement authStmt = conn.prepareStatement( "SELECT PCpair_id "+
                "FROM patients "+
                "WHERE Clinician=? AND PCpair_id=?;")) {
            authStmt.setString(1, activeUserEmail);
            authStmt.setInt(2, pcpair_id);
            ResultSet authRs = authStmt.executeQuery();
            
            if (authRs.next()==false){//no user-clinician (again, user modified some javascript)
                throw new Exception("Bad input: Current clinician cannot save for selected patient");    
            }
        }
        

        
    ArrayList<String> fullDatesAdded = new ArrayList<>();
    ArrayList<String> partDatesAdded = new ArrayList<>();

    //INSERT DATES 
        StringBuilder datesStringBuilder= new StringBuilder("Values ");
      
        boolean hasNull;
        for (int i=1;i<selectedData[0].length;i++){
            hasNull= false;
            double totalSteps = 0;
            for (int j=1;j<1441;j++){
                  if (selectedData[j][i]==null){
                       hasNull= true;
                  }
                  else{
                      totalSteps+=Double.parseDouble(selectedData[j][i]);
                  }
            }
            
            totalSteps = Math.floor(totalSteps);
            if (hasNull){
                datesStringBuilder.append("(?,\"part\",").append(totalSteps).append(",").append(pcpair_id).append("),");//assume that by adding another file with part, we cannot get full (1441 rows)
                partDatesAdded.add(selectedData[0][i]);
            }
            else{
                datesStringBuilder.append("(?,\"full\",").append(totalSteps).append(",").append(pcpair_id).append("),");//assume that by adding another file with part, we cannot get full (1441 rows)
                fullDatesAdded.add(selectedData[0][i]);
            }  
        }
      
        
        String datesString = datesStringBuilder.substring(0,datesStringBuilder.length()-1);
        

        try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO dates(Date,filling,totalSteps,PCpair_id) "+datesString+
                " ON DUPLICATE KEY UPDATE Date = Date, filling= VALUES(filling), totalSteps=VALUES(totalSteps), PCpair_id =  PCpair_id;")) {
            for (int i=1;i<selectedData[0].length;i++){
                stmt.setString(i,selectedData[0][i]);
            }
            
            stmt.executeUpdate();
        }
        
        
        
 //SELECT JUST INSERTED DATES
        
                
                String whereStr="WHERE PCpair_id="+pcpair_id +" AND ( ";
                for (int i=1;i<selectedData[0].length;i++){
                  whereStr+= "Date=?||";
                }
                whereStr = whereStr.substring(0,whereStr.length()-2);//get rid of last ||
              
                
                PreparedStatement stmt2 = conn.prepareStatement("SELECT Date, date_id from Dates "+whereStr+");");
                
                for (int i=1;i<selectedData[0].length;i++){
                    stmt2.setString(i, selectedData[0][i]);
                }

                ResultSet stmt2Rs = stmt2.executeQuery(); 
        
 
// 
//  //INSERT VALUES FOR EACH DATE (in arrToSave all have steps >0). batch is slower! https://code.google.com/p/google-apps-script-issues/issues/detail?id=5421
               
               
              
                int index;
                PreparedStatement stmt3;
                List<String> selectedData0AsList = Arrays.asList(selectedData[0]);
                while(stmt2Rs.next()){
                
                
                    index = selectedData0AsList.indexOf(stmt2Rs.getString(1));
                    int date_id = stmt2Rs.getInt(2);
                 

                    StringBuilder sb= new StringBuilder("VALUES ");
                    for ( int j=1;j<selectedData.length;j++){//@@@ remove nulls???
                        sb.append("(").append(j).append(",").append(date_id).append(",?),");
                    }
                    String valuesString = sb.substring(0,sb.length()-1);//get rid of last comma
                   
                   
                   
                   stmt3 = conn.prepareStatement("INSERT INTO stepsintime (Time,date_id,value) "+valuesString+
                    " ON DUPLICATE KEY UPDATE value=IFNULL(VALUES(value), value);");
             

                   for ( int j=1;j<selectedData.length;j++){
                       if (selectedData[j][index]!=null){
                           stmt3.setInt(j, (int)Math.round(Double.parseDouble(selectedData[j][index])));
                       }
                       else{//@@@ remove nulls???
                           stmt3.setNull(j, 4); //4 is constant for java.sql.Types.INTEGER
                       }
                   }
             
                   stmt3.execute();
        
                }

                HashMap<String,ArrayList<String>> datesAddedMap = new HashMap<>();
                datesAddedMap.put("full", fullDatesAdded);
                datesAddedMap.put("part", partDatesAdded);
                
                return datesAddedMap;
        
        
        
        
    }
    
    
}
