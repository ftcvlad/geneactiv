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

/**
 *
 * @author Vlad
 */
public class DateManager {
    
    
    
    public void saveDates(String activeUserEmail, Connection conn, int pcpair_id, String[][]  selectedData) throws ValidationException, SQLException, Exception{
        
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
        
        
//        
//         var responseObject = {
//                changeFilling: {"full":[], "part":[]},
//                id: obj.id
//         };
        
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
        

        PreparedStatement stmt = conn.prepareStatement("INSERT INTO dates(Date,filling,totalSteps,PCpair_id) "+datesString+
        " ON DUPLICATE KEY UPDATE Date = Date, filling= VALUES(filling), totalSteps=VALUES(totalSteps), PCpair_id =  PCpair_id;");
        
         for (int i=1;i<selectedData[0].length;i++){
             stmt.setString(i,selectedData[0][i]);
         }
        
        stmt.executeUpdate();
        stmt.close();
        
        
        
// //SELECT JUST INSERTED DATES
//        
//        
//                var whereStr='where PCpair_id='+pcpair_id +' AND ( ';
//                for (i=1;i<obj.selectedData[0].length;i++){
//                  whereStr+= 'Date=?||';
//                }
//                whereStr = whereStr.substring(0,whereStr.length-2);//get rid of last ||
//              
//                
//                var stmt2 = conn.prepareStatement('select Date, date_id from Dates '+whereStr+');');
//                
//                for (i=1;i<obj.selectedData[0].length;i++){
//                    stmt2.setString(i, obj.selectedData[0][i]);
//                }
//                
//                
//                var stmt2Rs = stmt2.executeQuery(); 
//        
// 
// 
//  //INSERT VALUES FOR EACH DATE (in arrToSave all have steps >0). batch is slower! https://code.google.com/p/google-apps-script-issues/issues/detail?id=5421
//               
//               
//              
//                var index;
//                var stmt3;
//                while(stmt2Rs.next()){
//                
//                
//                    index = obj.selectedData[0].indexOf(stmt2Rs.getString(1));
//                    var date_id = stmt2Rs.getInt(2);
//                 
//
//                    var valuesString="VALUES ";
//                    for ( j=1;j<obj.selectedData.length;j++){
//                        valuesString+='("'+j+'",'+date_id+',?),';
//                    }
//                    valuesString = valuesString.substring(0,valuesString.length-1);//get rid of last comma
//                   
//                   
//                   
//                   stmt3 = conn.prepareStatement('INSERT INTO stepsintime(Time,date_id,value) '+valuesString+
//                    ' ON DUPLICATE KEY UPDATE value=IFNULL(VALUES(value), value);');
//             
//
//                   for ( j=1;j<obj.selectedData.length;j++){
//                       if (obj.selectedData[j][index]!==null){
//                           stmt3.setInt(j, obj.selectedData[j][index]);
//                       }
//                       else{
//                           stmt3.setNull(j, 4); //4 is constant for java.sql.Types.INTEGER
//                       }
//                   }
//             
//                   stmt3.execute();
//        
//                }
//
//              return responseObject;
        
        
        
        
    }
    
    
}
