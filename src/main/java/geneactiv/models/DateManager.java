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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.HashMap;

/**
 *
 * @author Vlad
 */
public class DateManager {
    
    
    
    public HashMap<String,ArrayList<String>>  saveDates(String activeUserEmail, Connection conn, int pcpair_id, String[][]  selectedData) throws SQLException, Exception{
        
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
                for ( int j=1;j<selectedData.length;j++){
                    if (selectedData[j][index]!=null){
                        sb.append("(").append(j).append(",").append(date_id).append(",?),");
                    }
                   
                }
                String valuesString = sb.substring(0,sb.length()-1);//get rid of last comma




                stmt3 = conn.prepareStatement("INSERT INTO stepsintime (Time,date_id,value) "+valuesString+
                " ON DUPLICATE KEY UPDATE value=VALUES(value);");

               int preparedSetIndex = 1; 
               for ( int j=1;j<selectedData.length;j++){
                   if (selectedData[j][index]!=null){
                       stmt3.setInt(preparedSetIndex, (int)Math.round(Double.parseDouble(selectedData[j][index])));
                       preparedSetIndex++;
                   }

               }

               stmt3.execute();

            }

            HashMap<String,ArrayList<String>> datesAddedMap = new HashMap<>();
            datesAddedMap.put("full", fullDatesAdded);
            datesAddedMap.put("part", partDatesAdded);

            return datesAddedMap;

    }
    
    
     private String incrementDate(String from_date) throws java.text.ParseException{
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();
        c.setTime(sdf.parse(from_date));
        c.add(Calendar.DATE, 1);  // number of days to add
        from_date = sdf.format(c.getTime());  // dt is now the new date

        return from_date;

    }
    
    
    
    public String[][] getDates(String[] datesToGet,String activeUserEmail, Connection conn, int pcpair_id, boolean intraday) throws SQLException, Exception{
        
        try (PreparedStatement authStmt = conn.prepareStatement( "SELECT PCpair_id "+
                  "FROM patients "+
                  "WHERE Clinician=? AND PCpair_id=?;")) {
              authStmt.setString(1, activeUserEmail);
              authStmt.setInt(2, pcpair_id);
              ResultSet authRs = authStmt.executeQuery();

              if (authRs.next()==false){//no user-clinician (again, user modified some javascript)
                  throw new Exception("Bad input: Current clinician cannot get selected patient's data");    
              }
        }
     
  


        //GET SELECTED DATES THAT ARE IN DATABASE. same for interday and intraday
        String whereStr="WHERE PCpair_id="+pcpair_id+" AND (";
        for (String s : datesToGet) {
            whereStr+= "Date=?||";
        }
        whereStr = whereStr.substring(0,whereStr.length()-2);//get rid of last ||
        whereStr+=")";
        
     

        PreparedStatement stmt = conn.prepareStatement("SELECT Date, date_id, totalSteps "+
                                      "FROM dates "+ whereStr+" ORDER BY Date ASC;");

        for (int i=0; i<datesToGet.length;i++){
            stmt.setString(i+1,datesToGet[i]);
        }


        ResultSet rsDates = stmt.executeQuery();   
     
    
        int rowcountTable = 0;
        if (rsDates.last()) {
            rowcountTable = rsDates.getRow();
            rsDates.beforeFirst(); 
        }
        else {
            throw new Exception("No data in specified range db");
        }
        
        
        
        if (intraday == true){
                String[][] table= new String[1441][rowcountTable];
                PreparedStatement stmt2;


                //FOR EACH DATE/ROW SELECT VALUES
                int colIndex=0;
                while (rsDates.next()){

                              String date = rsDates.getString(1);
                              int date_id = rsDates.getInt(2);


                              table[0][colIndex] = date;
                              stmt2 = conn.prepareStatement("SELECT value, Time "+
                                                            "FROM stepsintime "+
                                                            "WHERE date_id="+date_id+";");

                              ResultSet rsValues = stmt2.executeQuery();

                              String val;
                              
                              //nulls are there by default :)
                              while(rsValues.next()){
                                    val = ""+rsValues.getInt(1);
                                    table[rsValues.getInt(2)][colIndex] = val;
                              }
                              
                              stmt2.close();
                              colIndex++;
                }
                
                return table;

        }
        else{//interday
                String[][] table= new String[rowcountTable][2];

                int rowIndex = 0;
                while (rsDates.next()){
                     table[rowIndex][0] = rsDates.getString(1);
                     table[rowIndex][1] = ""+rsDates.getInt(3);
                     rowIndex++;
                }

               //may be 0step dates, and to do interday, should be no gaps


                String firstDate=datesToGet[0];
                String lastDate = datesToGet[datesToGet.length-1];
          //count size of arrWithZeros
                int rowCountWithZeros=1;
                String currentDate = firstDate;
                while( currentDate.compareTo(lastDate)<=0){
                    currentDate = incrementDate(currentDate);
                    rowCountWithZeros++;
                }

                String[][] arrWithZeros = new String[rowCountWithZeros][2];
                arrWithZeros[0][0] = "Date";
                arrWithZeros[0][1] = "Steps summary";


                currentDate = firstDate;
                int ind=0;//which item from table are we looking for
                rowIndex = 1;
                while(currentDate.compareTo(lastDate)<=0){

                    if ( ind<rowcountTable && table[ind][0].equals(currentDate)){
                        arrWithZeros[rowIndex][0] = table[ind][0];
                        arrWithZeros[rowIndex][1] = table[ind][1];
                        ind++;
                    }
                    else {
                         arrWithZeros[rowIndex][0] = currentDate;
                         arrWithZeros[rowIndex][1] = "0";
                    }
                    currentDate = incrementDate(currentDate);
                    rowIndex++;
                }

                return arrWithZeros;

        }


    }
    
 
   
    
    
    
}
