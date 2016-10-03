

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
   <head>
   
      <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
       <!-- This CSS package applies Google styling; it should always be included. ???????-->
      <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">
      <link rel="stylesheet" type="text/css" href="static/style.css">
      
     
      
      <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
     
    
      <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
   
       
      <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
       
       
      <link rel="stylesheet" type="text/css" href="static/tooltipsterCSS.css">
      <script src="static/tooltipster.js"></script>
<script>console.log("-- "+new Date().getTime())</script>
    <script src="https://code.highcharts.com/highcharts.js" ></script>
    <script src="https://code.highcharts.com/highcharts-more.js" ></script>
    <script src="https://code.highcharts.com/modules/exporting.js" ></script>
 <script>console.log("-- "+new Date().getTime())</script>   
   
      <script src="//cdnjs.cloudflare.com/ajax/libs/dygraph/1.1.1/dygraph-combined.js" async></script>
      
       <script src="static/PapaParse.js"></script>
       <script src="static/javascript.js"></script>
     
   </head>
   <body>
    
      <div id="tabs">
         
         
         <div id="topRow">
           <ul>
              <li><a href="#tabs-2">GENEActiv</a></li>
           </ul>
           <div id="linksSection">
                <button class="imageButton" id="fitbitLink"  onclick="location.href='https://script.google.com/macros/s/AKfycbwhTCgEysLClLPQSp8yYkyr51qjQVpICQR-MTFbFVQPNafxyNY/exec'"></button>
                <button class="imageButton" id="formLink" onclick="location.href='https://script.google.com/macros/s/AKfycbxXETkjT1OnF3g7M5u7ONMqOxF7mpR2q6_rUEjM-AxGS6yiBBg/exec'" ></button>                
                <button class="imageButton tooltipShower" id="logout" data-tooltip-content="#logoutFrame" ></button>
                 
                <div class="tooltip_content">

                      <div id="logoutFrame">

                           <p >${sessionScope.user.username}</p>
                          <button onclick="sendLogoutRequest();" >Sign out</button>
                      </div>
                </div>
               
           </div> 
           
         </div>  
         
         
         <div id="tabs-2">
            <div class="container">
                <div id="radioButtonSetGene" >
                  <label for="radio1Gene" class="radioTopLabel">from File</label>
                  <input type="radio" id="radio1Gene" name="radioGeneTop" value="file" class="radioGeneTop" onchange="fromFileSelected()">
                  <label for="radio2Gene" class="radioTopLabel">File+Save to DB</label>
                  <input type="radio" id="radio2Gene" name="radioGeneTop" value="fileSave" class="radioGeneTop" checked="checked" onchange="fromFileAndDbSelected()">
                  <label for="radio3Gene" class="radioTopLabel">from DB</label>
                  <input type="radio" id="radio3Gene"  class="radioGeneTop" value="DB" name="radioGeneTop" onchange="fromDbSelected()">
                </div>
              
                
               
                <div >
                    <div id="adduserTooltipShowerGene"  class="tooltipShower"  data-tooltip-content="#addUserFormContainerGene">+</div>
        
        
                    
                    <div id="finduserTooltipShowerGene"  class="tooltipShower"  data-tooltip-content="#removeuserFormContainerGene">&#9776;</div>
            
                    <div class="tooltip_content">
                        
                         <div id="addUserFormContainerGene">
                             <h3>Add user to DB <i>(all fields optional)</i></h3>
                             <p> </p>
                             <label for="addNameFieldGene">Name</label>
                             <input type="text" id="addNameFieldGene" maxlength="18"><br>
                             <label for="addSurnameFieldGene">Surname</label>
                             <input type="text" id="addSurnameFieldGene" maxlength="18"><br>
                             <label for="addAgeFieldMMGene">Birth Date</label>
                             <span class="sameHeightAge">
                                 <select id="addAgeFieldMMGene">
                                     <option value="1">January</option>
                                     <option value="2">February</option>
                                     <option value="3">March</option>
                                     <option value="4">April</option>
                                     <option value="5">May</option>
                                     <option value="6">June</option>
                                     <option value="7">July</option>
                                     <option value="8">August</option>
                                     <option value="9">September</option>
                                     <option value="10">October</option>
                                     <option value="11">November</option>
                                     <option value="12">December</option>
                                 </select>
                                 <input type="text" maxlength="2" placeholder="dd" id="addAgeFieldDDGene">
                                 <input type="text" maxlength="4" placeholder="yyyy" id="addAgeFieldYYYYGene"><br></span>
                            
                             <button type="button" id="addNewPatientBtnGene" onclick="addNewPatient()">Add</button>
                             
                         </div>
                        
                  
                    </div>
                    
                    
                    
                     <div class="tooltip_content">
                        
                         <div id="removeuserFormContainerGene">
                                <div id="buttonHolder" >
                                     <button type="button" id="listDbUsersBtn" title="Find in database">Find</button>
                                     <button type="button" id="totalDeleteBtn" title="Delete user entirely" disabled>Delete</button>
                                     <button type="button" id="addToShortlistBtn" title="Add user to shortlist" disabled>Enlist</button>
                                     
                                     <input type="text" maxlength="18" placeholder="Search by Name (optional)" id="nameForFindInput">
                                
                                </div>
                                <div id="tableMessage">Ready</div>
                                <div id="tableHolderGene"></div>
                               
                         </div>
                         
                     </div>
                    
                
                
                </div>
             </div>
             <br/>
         

         
           <fieldset>
            <form id="myFormGENE">
            
               <div class="flexDiv" >
                  
                  
                  <label for="radioIntraGene">Intraday</label>
                  <input type="radio" name="interIntraGene" id="radioIntraGene" value="en" checked=true onchange="intraInterChangeGene(this)"  />
                  <label for="radioInterGene">Interday</label>
                  <input type="radio" name="interIntraGene" id="radioInterGene" value="dis" onchange="intraInterChangeGene(this)"/><br/>
                     
             <!--frequency picker-->
                  <label for="frqGENE"  class="selectorLabel">Select frequency</label>
                  <select name="frqGENE" id="frqGENE">
                     <option value="-1" >csv frequency</option>
                     <option value="60" selected="selected">1 min</option>
                     <option value="120">2 min</option>
                     <option value="300">5 min</option>
                     <option value="600">10 min</option>
                     <option value="900">15 min</option>
                     <option value="1800">30 min</option>
                     <option value="3600">1 h</option>
                  </select>
                  <br/>   
                     
                     <label for="graphTypeGene"  class="selectorLabel">Graph type</label>
                     <select name="graphTypeG" id="graphTypeGene">
                       
                        <option value="LC" >Line</option>
                        <option value="LS" >LineStacked</option>
                        <option value="HL" selected="selected" >RadarLine</option>
                        <option value="HS">RadarStacked</option>
                        <option value="HP">RadarStackedPercent</option>
                        
                     </select>               
              <!--submit-->
                  <br/>
                  <button type="button" id="retrieveBtnGene" onclick="readSingleFile()">Plot</button>
                  
               </div>
               
               <div class="flexDiv">
              <!--radio buttons-->
                  <label for="radioDay">Daily</label>
                  <input type="radio" name="radioGene" id="radioDay" value="1" checked=true onchange="handleRadioChange(this)"  />
                  <label for="radioRange">Range</label>
                  <input type="radio" name="radioGene" id="radioRange" value="2" onchange="handleRadioChange(this)"/><br/>
              <!--date pickers-->
                  <label class="selectorLabel" for="datepickerGENE" id="datepickerLabel">Days selected </label><span class="dateTypeTip" data-legend="">?</span><br/>
                  <input name="pickDate" id= "datepickerGENE" type="text"  />
               </div>
               
               <div class="flexDiv">
                      <label class="selectorLabel" for="userIDselect">Shortlisted Accounts</label>
                      <select name="userId" id="userIDselect">
                          
                            ${htmlString} 
                            
                      </select>
                      <button type="button" id="removeBtn" onclick="removeFromShortList()">Delist</button>
                      <hr>
                      
                      <input type="file" id="file-input" /><br/>
                </div>
               
               
               
            </form>
            <div id="errorSpanGENE" class="ui-state-highlight" style="color:red">Ready</div>
           </fieldset>
           
           
            <div id="dashboard_divGENE">
             
               <p id="rangeGENE" ></p>
               <div id="slider_divGENE"></div>
               <div id="line_chart_divGENE" style="height:600px"></div>
            </div>
         </div>
         
         

         
      </div>
     
   </body>
</html>
