
var ajaxLocked = false;
 
$(function () {

 
    google.charts.load('current', {'packages':['corechart', 'table']});
    google.charts.setOnLoadCallback(function(){
              
     
               var data = new google.visualization.DataTable();
               data.addColumn('string', 'Name');
               data.addColumn('string', 'Surname');
               data.addColumn('string', 'Birth date');
               data.addColumn('number', 'id');
               data.addColumn('string', 'fillings');
                              
               var table = new google.visualization.Table(document.getElementById('tableHolderGene'));
               
               $("#listDbUsersBtn").click(function(){findSavedPatients(table, data);});
               $("#totalDeleteBtn").click(function(){deleteSelectedUser(table, data); });
               $("#addToShortlistBtn").click(function(){addToShortlist(table, data);});

               google.visualization.events.addListener(table, 'select', function(){
               
                     if( table.getSelection().length===0){
                             $("#totalDeleteBtn").prop("disabled",true);
                             $("#addToShortlistBtn").prop("disabled",true);
                     }
                     else{
                             $("#totalDeleteBtn").prop("disabled",false);
                             $("#addToShortlistBtn").prop("disabled",false);
                     }
               });
           
                var view = new google.visualization.DataView(data);
                view.setColumns([0,1,2]); //here you set the columns you want to display
                
              
                 table.draw(view, {width: '100%',  cssClassNames:{headerRow : "tableHeader", tableRow: "tableRow", oddTableRow: "oddRow", headerCell  :"headerCell" }});
  
     });



          
      


    $("#tabs").tabs();//mb move to some other place -- loads slowly

   
    
    var datepickerDivGene = $("#datepickerGENE");

   
    datepickerDivGene.datepicker({
        dateFormat: "yy-mm-dd",
        autoSize: true,
        maxDate:'0',
        showButtonPanel: true,
        currentText: "Clear selection",
        onClose: function () {
            $(this).data('datepicker').inline = false;
        },

        onSelect: datepickerOnSelect,
        beforeShowDay: datepickerBeforeShowDay
       
    });
    datepickerDivGene.data('datepicker').arrayOfDates = [];


   
    $("#frqGENE").selectmenu({
        width: 150
       
    });
    $("#frqGENE option").not(':eq(1)').attr("disabled", true);
    
 
    $("#graphTypeGene").selectmenu({width: 150});
    
    $("#userIDselect").selectmenu({width:150});
    

   
    $("#removeBtn").button({icons: {primary: " ui-icon-closethick"}});
    $("#addBtn").button({icons: {primary: "ui-icon-circle-plus"}});
    $("#retrieveBtnGene").button({icons: {primary: "ui-icon-circle-check"}});
    


    $( "#radioButtonSetGene" ).buttonset();

   
    $.datepicker._gotoToday = function (id) {//override and don't call original -- stay on current month

        //id is the #id of the input element, inst is the associated datepicker
        var target = $(id);
        var inst = this._getInst(target[0]);

        inst.arrayOfDates.length = 0;
        target.val("0");
        
       
        this._adjustDate(target);

    };

    $( ".dateTypeTip" ).tooltip({
      items: "[data-legend]",
      show:{duration:0},
      hide:{duration:0},
      content: function() {
      
        var element = $( this );
        if ( element.is( "[data-legend]" ) ) {
          
          return  '<span style="background-color:#68d898; width: 30px;height:10px; display: inline-block "></span><span> day saved to DB</span><br/>'+
                  '<span style="background-color:#78781a; width: 30px;height:10px; display: inline-block "></span><span> partly saved</span><br/>'+
                  '<span style="background-color:#357ae8; width: 30px;height:10px; display: inline-block "></span><span> selected</span><br/>';
      
       }
     
      }
    });
    
    $('#adduserTooltipShowerGene').tooltipster( {
            contentAsHTML: true,
            interactive: true,
            trigger: "click",
           
            functionReady: function(){
           
                 $("#addNewPatientBtnGene").button({icons: {primary: "ui-icon-circle-plus"}});
            },
            
            side:"bottom",
            functionPosition: function(instance, helper, position){
                position.coord.left = position.target - 360;
                return position;
            },
            delay:0,
            animationDuration:0,
            minWidth:375,
            maxWidth:375
      });
      
    $('#finduserTooltipShowerGene').tooltipster({
                contentAsHTML: true,
                interactive: true,
                trigger: "click",
                functionPosition: function(instance, helper, position){
                   position.coord.left = position.target - 485;
                    return position;
                },
                functionReady: function(instance, helper){
                   
                     $(helper.tooltip).css("min-height","300px");//set height of tooltipster's top element
                      $(helper.tooltip).css("max-height","300px");
                },
            
                side:"bottom",
                delay:0,
                animationDuration:0,
                minWidth:500,
                maxWidth:500
    });
  
    $('#logout').tooltipster( {
            contentAsHTML: true,
            interactive: true,
            trigger: "click",
        
            functionReady: function(){
           
                
                 $(".tooltipster-box").eq(0).parent().addClass("specialTooltipster");
            
               
            },
         
            
            side:"bottom",
            viewportAware:false,
            functionPosition: function(instance, helper, position){
                position.coord.left = position.target - position.size.width+15;
                return position;
            },
            delay:0,
            animationDuration:0,
            minWidth:175,
            maxWidth:575
           
      });
       
    console.log(new Date().getTime());
});





function sendLogoutRequest(){
   
    if (ajaxLocked){return;}

    doAjaxRequest("logout",{},
                    function(){
                         window.location.href = "Login";
                    },   
                           
                    function(jqXHR,errorStatus,errorThrown){
                    },
                    "post");

}

function doAjaxRequest(path, data, successF, failF, method){
    ajaxLocked=true;
    jQuery.ajax({
        method: method, 
        url: path, 
       // dataType: "json", // Data type, HTML, json etc.
        data: data,
        success: function ( response,textStatus,jqXHR){successF(response);},
        error: function(jqXHR, errorStatus, errorThrown) {
//alert(jqXHR.responseText);
            if( jqXHR.responseText==="Session expired" ) {
                        window.location="Login";
            }
            else{
                failF(jqXHR, errorStatus,errorThrown);
            }
        },
        complete: function(){ajaxLocked=false;}

    });
}




var datepickerBeforeShow = function(){


    return {maxDate:new Date()};

};


var datepickerBeforeShowDay = function (date) {

    var str = dateToYYYYMMDDstring(date);
   
   
   
  
    //this refers to input DOM element
    if ($(this).data("datepicker").arrayOfDates.indexOf(str) > -1) {
        return [true, "selected", ''];
    }
    else {
      
        var dayTypesObj = $('#userIDselect').find(":selected").data("foo");//DIFFERENT FOR GENEACTIV
      
      
      
        if (dayTypesObj!==null  ){
            if (dayTypesObj["full"].indexOf(str)>-1){
                return [true, "full", ''];
            }
            else if (dayTypesObj["part"].indexOf(str)>-1){
                return [true, "part", ''];
            }
           
        }
    }
    
    return [true, '', ''];
    
  
};

var datepickerOnSelect = function (dateText, inst) {


    $(this).data('datepicker').inline = true;


    var radioButtonsSiblings = $(this).siblings('input');
    var radioVal = $(radioButtonsSiblings[0]).is(':checked') ? $(radioButtonsSiblings[0]).val() : $(radioButtonsSiblings[1]).val();

    if (radioVal === "1") {//select dates

        var index = inst.arrayOfDates.indexOf(dateText);
        if (index === -1) {
            inst.arrayOfDates.push(dateText);

        }
        else {
            inst.arrayOfDates.splice(index, 1);
        }

    }
    else if (radioVal === "2") {//select range
        var len = inst.arrayOfDates.length;

        if (len === 0) {
            inst.arrayOfDates.push(dateText);
        }
        else if (len === 1) {
            var start;
            var end;
            if (dateText >= inst.arrayOfDates[0]) {
                start = inst.arrayOfDates[0];
                end = dateText;
            }
            else {
                end = inst.arrayOfDates[0];
                start = dateText;
            }
            inst.arrayOfDates = [];
            for (; start <= end;) {
                inst.arrayOfDates.push(start);
                start = incrementDate(start);
            }

        }
        else if (len > 1) {
            inst.arrayOfDates = [];
            inst.arrayOfDates.push(dateText);

        }

    }

   // console.log(inst.arrayOfDates);
    $(this).val(inst.arrayOfDates.length);
};


function dateToYYYYMMDDstring(date) {

    var month = (date.getMonth() + 1) + "";
    if (month.length === 1) {
        month = "0" + month;
    }

    var cislo = date.getDate() + "";
    if (cislo.length === 1) {
        cislo = "0" + cislo;
    }

    var year = date.getFullYear();

    return year + "-" + month + "-" + cislo;

}


function handleRadioChange(radioClicked) {

    var respectiveInput = $(radioClicked).siblings('input').last();

    respectiveInput.data("datepicker").arrayOfDates = [];
    respectiveInput.val("0");

}



//SOME DISABLING/ENABLING

function intraInterChangeGene(radioClicked) {

    var value = $(radioClicked).val();
    if (value === "en") {
        
        
        $('#radio2Gene').prop("disabled", false);
        $("#radioButtonSetGene").buttonset("refresh");
        
        
         $("#frqGENE").selectmenu("enable");
         $("#frqGENE").selectmenu("refresh");
        
         $("#graphTypeGene option").not(':eq(0)').attr("disabled", false);
         $("#graphTypeGene").selectmenu("refresh");
    }
    else if (value === "dis") {
        
        
        if ($('#radio2Gene').is(':checked')){
          $("#radio1Gene").prop("checked", true);
          $("#frqGENE option").attr("disabled", false);
          
          $('#userIDselect').selectmenu("disable");
          $('#removeBtn').prop("disabled", true);
        }
        $('#radio2Gene').prop("disabled", true);
        $("#radioButtonSetGene").buttonset("refresh");
        
      
        //frequency
        $("#frqGENE").selectmenu("disable");
        $("#frqGENE").selectmenu("refresh");
        
        
         
         //graph type
        $("#graphTypeGene option").not(':eq(0)').attr("disabled", true);
        $('#graphTypeGene').val('LC');
        $("#graphTypeGene").selectmenu("refresh");
    }

}


function fromFileSelected(){

      $("#frqGENE option").attr("disabled", false);
      $("#frqGENE").selectmenu("refresh");
     
      $('#userIDselect').selectmenu("disable");
      $('#removeBtn').prop("disabled", true);
      $('#file-input').prop("disabled", false);
     
}


function fromFileAndDbSelected(){
      $("#frqGENE option").not(':eq(1)').attr("disabled", true);
      $("#frqGENE").val("60");

   
      $("#frqGENE").selectmenu("refresh");
     

      $('#userIDselect').selectmenu("enable");
      $('#removeBtn').prop("disabled", false);
      $('#file-input').prop("disabled", false);
}


function fromDbSelected(){

     $("#frqGENE option").attr("disabled", false);
     $("#frqGENE option").eq(0).attr("disabled", true);
     
   
     if ($("#frqGENE option:selected").val()==="-1"){
         $("#frqGENE ").val("60");
     }
     $("#frqGENE").selectmenu("refresh");
   
      
      $('#userIDselect').selectmenu("enable");
      $('#removeBtn').prop("disabled", false);
      $('#file-input').prop("disabled", true);
      
}




function setStatus(divElement, message, classToAdd){

      if (classToAdd==="ui-state-highlight"){
         divElement.addClass("ui-state-highlight");
         divElement.removeClass("ui-state-error");
      }
      else{
         divElement.removeClass("ui-state-highlight");
         divElement.addClass("ui-state-error");
      }
      divElement.text(message);
      
     
}





//----------------------------------------------------------FOR GENEACTIV-------------------------------------------



//ADD USER
function addNewPatient(){
            if (ajaxLocked){return;}
            $('#addUserFormContainerGene > p:eq(0)').text("Adding...");

            var name = $("#addNameFieldGene").val();
            var surname = $("#addSurnameFieldGene").val();

            var monthNum = parseInt($("#addAgeFieldMMGene").val());
            var dayStr = $("#addAgeFieldDDGene").val();
            var yearStr = $("#addAgeFieldYYYYGene").val();
           
            var dataToSave;
            try{ 
                dataToSave = validateDate(yearStr, monthNum, dayStr);
                dataToSave.name = name;
                dataToSave.surname = surname;
            }
            catch(e){
                $('#addUserFormContainerGene > p:eq(0)').text(e);
                return;
            }

            doAjaxRequest("addPatient",{data:JSON.stringify(dataToSave)},
                    function(response){   
                            $('#userIDselect').prepend($('<option>', { 
                                  value: response.id,
                                  text : response.alias,
                                  "data-foo" :  JSON.stringify({ "full":[],"part":[]}),
                                  selected: "selected"
                            }));


                            $("#userIDselect").selectmenu("destroy").selectmenu({width:150});
                            $('#addUserFormContainerGene > p:eq(0)').text("User added successfully!");},
                    function(jqXHR,errorStatus,errorThrown){
                           $('#addUserFormContainerGene > p:eq(0)').text(jqXHR.responseText);

                    },"post");
       
     
}







//FIND USERS

function findSavedPatients(table, datatable){
        if (ajaxLocked){return;}
        $("#totalDeleteBtn").prop("disabled",true);
        $("#addToShortlistBtn").prop("disabled",true);



        $("#tableMessage").text("Retrieving patient list...");

      
        doAjaxRequest("findPatients",{name:$("#nameForFindInput").val()},
            function(response){ 
               datatable.removeRows(0,  datatable.getNumberOfRows());
               for (var i=0;i<response.length;i++){
                    datatable.addRow([response[i].name, response[i].surname, response[i].birthDate,response[i].id, 
                            JSON.stringify({fullDates:response[i].fullDates,  partDates:response[i].partDates})] ); 
               }
               var view = new google.visualization.DataView(datatable);
               view.setColumns([0,1,2]); //here you set the columns you want to display
               table.draw(view, {width: '100%',  cssClassNames:{headerRow : "tableHeader", tableRow: "tableRow", oddTableRow: "oddRow", headerCell  :"headerCell" }});
               $("#tableMessage").text("Done");
               
            },
            function(jqXHR,errorStatus,errorThrown){
                   $("#tableMessage").text(jqXHR.responseText);

        },"get");
      
            
}






//DELETE USER

function deleteSelectedUser(table, datatable){
        if (ajaxLocked){return;}
        $("#tableMessage").text("Deleting selected users...");
        var allUserIds = [];

        var allSelected =  table.getSelection();
        for (var i=0; i<allSelected.length; i++){
           
            allUserIds.push(datatable.getValue(allSelected[i].row,3));
        }
        
        
        doAjaxRequest("deletePatients",{idArray:JSON.stringify(allUserIds)},
            function(){ return updateTableListRemove(allUserIds,datatable,table);},
            function(jqXHR,errorStatus,errorThrown){
                  $("#tableMessage").text(jqXHR.responseText);

        },"post");
        
     
 
}


function updateTableListRemove(idsToRemove, datatable, table){

    if (idsToRemove.length>0){
        for (var i=0;i<idsToRemove.length;i++){
            $('#userIDselect').find('option[value="'+idsToRemove[i]+'"]').remove(); 
        }
        $("#userIDselect").selectmenu("destroy").selectmenu({width:150});
       
        
        for (var j=0; j< datatable.getNumberOfRows();j++){
            var nextId = datatable.getValue(j,3);
            if (idsToRemove.indexOf(nextId)>=0){
                datatable.removeRow(j);
                j--;
            }

        }

         var view = new google.visualization.DataView(datatable);
         view.setColumns([0,1,2]); 


        table.draw(view, {width: '100%',  cssClassNames:{headerRow : "tableHeader", tableRow: "tableRow", oddTableRow: "oddRow" }});

        $("#totalDeleteBtn").prop("disabled",true);
        $("#addToShortlistBtn").prop("disabled",true);
        

    }
    $("#tableMessage").text("Done"); 
    ajaxLocked = false;
}




//REMOVE FROM SHORTLIST

function removeFromShortList(){
    if (ajaxLocked){return;}

     var id = $("#userIDselect").val();
     var errorSpanGene = $("#errorSpanGENE");
     if (id===null){
          setStatus(errorSpanGene, "No id to remove!", "ui-state-error");  
     }
     else{
         
        doAjaxRequest("removeFromShortlist",{id:id},
            function(){ 
                $('#userIDselect').find('option[value="'+id+'"]').remove(); 
                $("#userIDselect").selectmenu("destroy").selectmenu({width:150});              
                errorSpanGene.text("Done");},
            function(jqXHR,errorStatus,errorThrown){
                 errorSpanGene.text(jqXHR.responseText);

        },"post");
        
     }
}


//ADD TO SHORTLIST

function addToShortlist(table, datatable){
        if (ajaxLocked){return;}
        $("#tableMessage").text("Adding selected users to shortlist...");
        var allUsers = [];

        var allSelected =  table.getSelection();
        for (var i=0; i<allSelected.length; i++){

              var row = allSelected[i].row;

              var id = datatable.getValue(row,3);
              var name = datatable.getValue(row,0);
              var surname = datatable.getValue(row,1);
              var birthDate = datatable.getValue(row,2);
              var fillings = datatable.getValue(row,4);

              var dates = JSON.parse(fillings);
              allUsers.push({id: id, name: name,surname:surname, birthDate:birthDate,fullDates: dates.fullDates, partDates: dates.partDates  });

        }
     
        doAjaxRequest("addToShortlist",{patients:JSON.stringify(allUsers)},
            function(response){return   updateSelectEnlist(response);},
            function(jqXHR,errorStatus,errorThrown){
                $("#tableMessage").text(jqXHR.responseText);

        },"post");
     
  
  
}





function updateSelectEnlist(patientsToAdd){
    
    if (patientsToAdd.length>0){
    
        $.each(patientsToAdd, function (i, nextPatient) {
        
            $('#userIDselect').prepend($('<option>', { 
                    value: nextPatient.id,
                    text : nextPatient.name+" "+nextPatient.surname,
                    "data-foo" :  JSON.stringify({"full":nextPatient.fullDates, "part":nextPatient.partDates}),
                    selected: "selected"
                }));
        });
        
        $("#userIDselect").selectmenu("destroy").selectmenu({width:150});
    }
    $("#tableMessage").text("Done"); 
    ajaxLocked = false;
}




function incrementDate(from_date) {
    var YYYY = from_date.substring(0, 4);
    var MM = from_date.substring(5, 7);
    var DD = from_date.substring(8);
    var nextDate = new Date(parseInt(YYYY, 10), parseInt(MM, 10) - 1, parseInt(DD, 10));
    nextDate.setDate(nextDate.getDate() + 1);


    return dateToYYYYMMDDstring(nextDate);

}





////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////










function readSingleFile() {

    if (ajaxLocked){return;}

    var errorSpanGene  = $("#errorSpanGENE");

    
    var retrieveType = $('input[name=radioGeneTop]:checked').val();
    var  allSelDates = $("#datepickerGENE").data("datepicker").arrayOfDates;
        
   
    if (allSelDates.length === 0){
        setStatus(errorSpanGene, "No dates selected!", "ui-state-error");
        return;
    }
    
    if (retrieveType!=="file"){
        var id = $("#userIDselect").val();
        if (id === null){
            setStatus(errorSpanGene, "No Id was selected. If no dropdown, add users first", "ui-state-error");
        }
    }




    if (retrieveType==="DB"){
    
        setStatus(errorSpanGene, "Retrieving...", "ui-state-highlight");
    
        
        ajaxLocked = true;
        
        var intraday = $('input[name=interIntraGene]:checked').val()==="en"?true:false;
        
    
        doAjaxRequest("getDates",{allDates: JSON.stringify(allSelDates.sort()), id:id, intraday:intraday },
                function(response){return dbGetSucceed(response,intraday);},
                function(jqXHR,errorStatus,errorThrown){
                     setStatus($("#errorSpanGENE"), jqXHR.responseText, "ui-state-error");
                     clearChartSliderAreaAndGetMemoryBack();
        },"get");
    

      
            
    }
    else if (retrieveType==="file" || retrieveType==="fileSave"){
         var file = document.getElementById("file-input").files[0];
         
         if (!file) {
            setStatus(errorSpanGene, "Select file!", "ui-state-error");
         }
         else{
             
           
            setStatus(errorSpanGene, "Reading file...", "ui-state-highlight");
            
            var allArrayData = [];
            Papa.parse(file, {
               // worker: true,
               // dynamicTyping: true,
                step: function(row) {
                    if (row.data[0].length===12){
                        allArrayData.push([row.data[0][0], parseFloat(row.data[0][7])]);
                    }
                },
                complete: function(results) {
                     processCsvString(allArrayData, allSelDates.sort(), retrieveType, id);
                    

                }
            }); 
            

             
             
         }
         
         
    }

 
}

 








function processCsvString(allArrayData, selDates, retrieveType, id) {

    var errorSpanGene = $("#errorSpanGENE");
 

     
    setStatus(errorSpanGene, "Processing data...", "ui-state-highlight");

    

    var intraday;
    var selectFrequency;
    
   
    intraday = $("#radioIntraGene").is(':checked') ? true : false;
    selectFrequency = parseInt($("#frqGENE").val());//(1,2,5,10,15,30,60,120)*60 --  all in seconds!
    
   

   
    var traverseIndex = 0;//big go through allArrayData
    
    if (intraday === true) {

        //add time column
        var selectedData = [['TimeG']];
       
        var columnToAdd = 0;
        var csvFrequency = 0;
        var targetFrequency = 0;


        for (var k = 0; k < selDates.length; k++) {
            var targetDate = selDates[k];



            //find first index of selected date
            var found = false;
            for (; traverseIndex < allArrayData.length; traverseIndex++) {
                if (allArrayData[traverseIndex][0] !== null && allArrayData[traverseIndex][0].substring(0, 10) === targetDate) {
                    found = true;
                    break;
                }
            }
           
            if (found === false) {
                traverseIndex = 0;
                continue;
            }
            else if (columnToAdd === 0) {//create time column which can be of different length

                if (traverseIndex + 1 < allArrayData.length &&
                    allArrayData[traverseIndex + 1][0] !== null &&
                    allArrayData[traverseIndex + 1][0].substring(0, 10) === targetDate) {//if there are at least 2 items for same date

                    var fst = new Date(0, 0, 0, parseInt(allArrayData[traverseIndex][0].substring(11, 13)), parseInt(allArrayData[traverseIndex][0].substring(14, 16)), parseInt(allArrayData[traverseIndex][0].substring(17, 19)), 0);
                    var snd = new Date(0, 0, 0, parseInt(allArrayData[traverseIndex + 1][0].substring(11, 13)), parseInt(allArrayData[traverseIndex + 1][0].substring(14, 16)), parseInt(allArrayData[traverseIndex + 1][0].substring(17, 19)), 0);
                    csvFrequency = Math.abs(snd.getTime() - fst.getTime()) / 1000;

                    

                    //selectFrequency cannot be smaller than csv frequency
                    targetFrequency = (selectFrequency === -1) ? csvFrequency : selectFrequency;

                }
                else {// never happens kind of -- single record for a date
                  
                    traverseIndex = 0;
                    continue;
                }

                var startDayTime = new Date(0, 0, 0, 0, 0, 0, 0);

                var hh = "";
                var mm = "";
                var ss = "";
                for (var t = 0; t < 24 * 3600 / targetFrequency; t++) {

                    startDayTime.setSeconds(startDayTime.getSeconds() + targetFrequency);//01:00 is the sum for 00:00-01:00

                    hh = startDayTime.getHours() + "";
                    if (hh.length < 2) {
                        hh = "0" + hh;
                    }
                    mm = startDayTime.getMinutes() + "";
                    if (mm.length < 2) {
                        mm = "0" + mm;
                    }
                    ss = startDayTime.getSeconds() + "";
                    if (ss.length < 2) {
                        ss = "0" + ss;
                    }
                    selectedData.push([hh + ":" + mm + ":" + ss]);
                     

                }
                selectedData[selectedData.length - 1] = ["24:00:00"];
            }

            columnToAdd++;
            
            //create next header
            selectedData[0].push(targetDate);
            //fill next column with nulls
            for (var i = 1; i < selectedData.length; i++) {
                selectedData[i].push(null);//??? NOT EFFECTIVE?
            }
            

            //at what index in selectedData to start putting data
            var secondsPassed = parseInt(allArrayData[traverseIndex][0].substring(11, 13)) * 3600 +
                parseInt(allArrayData[traverseIndex][0].substring(14, 16)) * 60 +
                parseInt(allArrayData[traverseIndex][0].substring(17, 19));
            var nextSelectDataIndex = Math.floor(secondsPassed / targetFrequency) + 1;//+1 for header row in selectedData


            var stepsForPeriod = 0;
            var everyNth = targetFrequency / csvFrequency;


            var ind = 0;
            var properStart = false;
            //for all csv rows that have targetDate

         
            while (traverseIndex !== allArrayData.length
            && allArrayData[traverseIndex][0] !== null //in case empty rows in the end of csv
            && allArrayData[traverseIndex][0].substring(0, 10) === targetDate) {

                

                if (!properStart) {//first period may be not full; output when first reached relevant time

                    var timeStr = allArrayData[traverseIndex][0].substring(11, 19);



                    if (selectedData[nextSelectDataIndex][0] <= timeStr) {//BUG :(

                        properStart = true;
                        selectedData[nextSelectDataIndex][columnToAdd] = Math.floor(stepsForPeriod*100)/100;//due to 0.1+0.2===0.30000004 ; googleLine rounds to 2 anyway, but it would be too long to save to db
                        stepsForPeriod = 0;
                        nextSelectDataIndex++;
                    }

                }
                else {
                    ind++;


                    if (ind % everyNth === 0) {
                        selectedData[nextSelectDataIndex][columnToAdd] = Math.floor(stepsForPeriod*100)/100;
                        stepsForPeriod = 0;
                        nextSelectDataIndex++;
                    }


                }
                stepsForPeriod += allArrayData[traverseIndex][1];
                traverseIndex++;
                
              


            }

            if (stepsForPeriod !== 0) {//if finished with series, output stepsForPeriod
                selectedData[nextSelectDataIndex][columnToAdd] = stepsForPeriod;
            }

            if (traverseIndex === allArrayData.length) {
                break;
            }


        }//end of for all dates
    }//end of intraday==true
    else if (intraday === false) {

        selectedData = [["Date", "Steps summary"]];

        for ( k = 0; k < selDates.length; k++) {
            targetDate = selDates[k];


            var found = false;
            for (; traverseIndex < allArrayData.length; traverseIndex++) {
                if (allArrayData[traverseIndex][0] !== null && allArrayData[traverseIndex][0].substring(0, 10) === targetDate) {
                    found = true;
                    break;
                }
            }

            if (found === false) {
                traverseIndex = 0;
                continue;
            }



            var sumForDate = 0;

            for (; traverseIndex < allArrayData.length; traverseIndex++) {
                if (allArrayData[traverseIndex][0] !== null && allArrayData[traverseIndex][0].substring(0, 10) === targetDate) {
                    sumForDate += allArrayData[traverseIndex][1];
                }
                else{
                    break;
                }
            }

            if (sumForDate !== 0) {
                selectedData.push([targetDate, sumForDate]);
            }
            else {
                traverseIndex = 0;
            }

        }
    }



    //if no data selected at all
    if (selectedData.length === 1) {
        setStatus(errorSpanGene, "No data in specified range", "ui-state-error");
        return;
    }


    if (retrieveType==="file"){
        if (intraday===false){
            targetFrequency = null;
        }
        
        setStatus(errorSpanGene, "Drawing graph...", "ui-state-highlight");
        drawGraph($("#graphTypeGene").val(), "Geneactiv", 'line_chart_divGENE', 'slider_divGENE', 'rangeGENE', selectedData, targetFrequency);

        setStatus(errorSpanGene, "Done", "ui-state-highlight");
    }
    else if (retrieveType==="fileSave"){
    
      
       var currFilling =  $('#userIDselect option[value="'+id+'"]').data("foo");
       for (var k=1;k<selectedData[0].length;k++){
            if (currFilling["full"].indexOf(selectedData[0][k])!==-1){
                for(var i = 0 ; i < selectedData.length ; i++){
                     selectedData[i].splice(k,1);
                }
                k--;
            }
       }
       
       //console.log(selectedData);
      
       if (selectedData[0].length===1){
           setStatus(errorSpanGene, "Selected dates are fully saved", "ui-state-error");
           return;
       }
        
        doAjaxRequest("saveDates",{data:JSON.stringify(selectedData ),id:id},
            function(response){return   dbSaveSucceed(response,id, selectedData,targetFrequency);},
            function(jqXHR,errorStatus,errorThrown){
                setStatus($("#errorSpanGENE"), jqXHR.responseText, "ui-state-error");
                clearChartSliderAreaAndGetMemoryBack();
           
        },"post");
        
    }
}


function dbSaveSucceed(response, id, selectedData, targetFrequency){

    //update data-foo
    $('#userIDselect option[value="'+id+'"]').data("foo",response );
    
    var errorSpanGene = $("#errorSpanGENE");
    setStatus(errorSpanGene, "Drawing graph...", "ui-state-highlight");
    drawGraph($("#graphTypeGene").val(), "Geneactiv", 'line_chart_divGENE', 'slider_divGENE', 'rangeGENE', selectedData, targetFrequency);

    setStatus($("#errorSpanGENE"), "Data saved", "ui-state-highlight");

}




  


function dbGetSucceed(responseArray,intraday){
    
    //[[2016-06-09,2016-06-10]["12","14"]["234","1212"]...]  for intraday -> add time column + respective frequency + parseInt
    //[[Date,Total steps][2016-06-09,"325876"][2016-06-10,"213111"]...] for interday -> parseInt
    
    var errorSpanGene = $("#errorSpanGENE");

    
    var frqSeconds;
    if (intraday===true){
        
        var genFrqData = [['Time']];
        frqSeconds= parseInt($("#frqGENE").val());
        var frqMinutes = (frqSeconds===-1) ? 1:(frqSeconds/60);

  //ADD TIME COLUMN

        var zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
        var hh;
        var mm;
        for (var n = 0; n < 24 * 60 / frqMinutes; n++) {

            zeroDate.setMinutes(zeroDate.getMinutes() + frqMinutes);
            hh = zeroDate.getHours() + "";
            if (hh.length < 2) {
                hh = "0" + hh;
            }
            mm = zeroDate.getMinutes() + "";
            if (mm.length < 2) {
                mm = "0" + mm;
            }

            var str = hh + ":" + mm;
            str = str === "00:00" ? "24:00" : str;


            genFrqData.push([str]);
        }


  //GENERATE SELECTED DATA

        var totalStepsForPeriod = null;
      
        for (var i=0;i<responseArray[0].length;i++){
        
            genFrqData[0].push(responseArray[0][i]);

            var dataAvailableLength = responseArray.length;
            var itemsPushed = 0;

            for (j = 1; j < dataAvailableLength; j++) {
                
                if (responseArray[j][i]!==null){
                    totalStepsForPeriod += parseInt(responseArray[j][i]);
                }


                if (j  % frqMinutes === 0 || j === (dataAvailableLength - 1)) {//add data every f hours or leftovers
                
                    genFrqData[itemsPushed + 1].push(totalStepsForPeriod);
                    totalStepsForPeriod = null;
                    itemsPushed++;
                }

            }

        }


 
        responseArray = genFrqData;
       
    
    }
    else if (intraday===false){
            frqSeconds = null;//just a big number
         
            console.log(responseArray[0]);
        for (var i=1;i<responseArray.length;i++){
            responseArray[i][1] = parseInt(responseArray[i][1]);
        }
    }
    
    //console.log(responseArray);
      
    setStatus(errorSpanGene, "Drawing graph...", "ui-state-highlight");
    drawGraph($("#graphTypeGene").val(), "Geneactiv", 'line_chart_divGENE', 'slider_divGENE', 'rangeGENE', responseArray,frqSeconds);

   

    setStatus(errorSpanGene, "Done", "ui-state-highlight");
    
}















//=========================================================================================================================================
//===============================================SAME AGAIN :) ============================================================================
//=========================================================================================================================================

var myDygraph = null;
var myGoogleChart = null;
var myHighchart = null;
function drawGraph(chartType, chartTitle, chartId, sliderId, rangeId, selectedData, targetFrequencySec) {


    clearChartSliderAreaAndGetMemoryBack();

    


    //DRAW GRAPHS

    var chartDiv = document.getElementById(chartId);
  
    if (chartType === "LC" || chartType === "LS") {
    
        if (targetFrequencySec===null || targetFrequencySec>=60 ){//null for interday
                
                var dataT = google.visualization.arrayToDataTable(selectedData);
                var options = {
                    title: chartTitle,//***
                    curveType: 'none',
                    legend: {position: 'bottom'},
                    //explorer: { keepInBounds: true},
                    chartArea: {/*height: 400, width: 'auto',*/left: 70, top: 50,  width: '90%', height: '75%'},
                    //hAxis: {gridlines: {count: 4}},
                    hAxis: {slantedText: true, slantedTextAngle: 90, viewWindow: {}},
                    width: 'auto',
                    height: 600,
                    // lineWidth: 1,
                    vAxis: {maxValue: 200, gridlines: {count: 10}, title:"Sum of vector magnitudes"},
        
                    // interpolateNulls: true,
                    isStacked: false
                };
                
                if (chartType === "LC") {
                    myGoogleChart = new google.visualization.LineChart(chartDiv);//***
        
                }
                else if (chartType === "LS") {
                    options.isStacked = true;
                    myGoogleChart = new google.visualization.AreaChart(chartDiv);
                }
                myGoogleChart.draw(dataT, options);
         }
         else{
             
               var headers =  selectedData.shift();
          
               //dygraph's x-axis should be date or number :(
               for (var j=0;j<selectedData.length;j++){
                   selectedData[j][0] = j+1;
               }
         
         
               myDygraph = new Dygraph(chartDiv,
                         selectedData,
                          {
                            labels:headers,
                            axes: {
                                  x: {
      
                                      axisLabelFormatter: function(x, gran) {
                                      
                                      
                                          return numberToTime(x, targetFrequencySec); 
                                          
                                      },
                                      //drawGrid :false
                                      pixelsPerLabel :50,
                                      valueFormatter: function(x) {
                                    
                                            return (numberToTime(x, targetFrequencySec)); 
                                       }
                                  }                
                               },
      
                               title:chartTitle,
                               labelsDiv : "slider_divGENE",
                               hideOverlayOnMouseOut : false,
                               legend : "always",
                             stackedGraph : (chartType==="LC") ? false:true,
                             strokeWidth :2,
                             colors :["red","blue","green","orange", "grey", "pink","purple","brown","cyan","tomato","teal","springgreen","navy","darkolivegreen"],
                             labelsSeparateLines :true,
                             ylabel: "Sum of vector magnitudes" 
                          });

         }
    }
    
    else if (chartType==="HL" || chartType==="HS" || chartType==="HP"){
    
            var myCategories = [];
            for (var i=1;i<selectedData.length;i++){
                myCategories.push(selectedData[i][0]);
            }
            
            var allSeries = [];
            for (var k=1;k<selectedData[0].length;k++){
               
               var nextData = [];
               for (i=1;i<selectedData.length;i++){
                   nextData.push(selectedData[i][k]);
               }
              
               var nextSeries = {
                    name: selectedData[0][k],
                    data: nextData,
                    pointPlacement: 'on',
                    cropThreshold:1
                };
                allSeries.push(nextSeries);
            
            }
           // selectedData.shift();//get rid of header, so that when it's used in slider, it has the same length as series
           
    
            Highcharts.seriesTypes.line.prototype.cropShoulder = 0;
            myHighchart = new Highcharts.Chart({

                chart: {
                    renderTo: chartId,
                    polar: true,
                    type: (chartType==="HL")? 'line':'area'
                },
        
                title: {
                    text: 'Geneactiv: Sum of vector magnitudes',
                    x: -80
                },
        
                pane: {
                    size: '80%'
                },
        
                xAxis: {
                    categories: myCategories,
                    tickmarkPlacement: 'on',
                    lineWidth: 0,
                    tickInterval:Math.round(50/(targetFrequencySec/60)),
                    minRange:1,
                    type:'linear',
                    endOnTick:false,
                    startOnTick:false,
                    min:0,
                    max:selectedData.length-1//-2 is not a solution for  all my problems :(
                            
                },
        
                yAxis: {
                    gridLineInterpolation: 'polygon',
                    lineWidth: 0,
                    min: 0
                },
        
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
                },
        
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 70,
                    layout: 'vertical'
                },
               plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        },
                        lineWidth: 1,
                        cropThreshold:1,
                        connectEnds:false
                      
                    },
                    area:{
                        marker: {
                            enabled: false
                        },
                        lineWidth: 1,
                        connectEnds:false,
                        stacking: (chartType==="HP")? 'percent':'normal'//percent,
                        
                    }
               }, 
        
               series: allSeries
        
            });
    }
 

   

    
    if (targetFrequencySec===null || targetFrequencySec>=60 ||  chartType==="HL" || chartType==="HS" ||  chartType==="HP"){


          var sliderDiv = $("#" + sliderId);
          var rangeDiv = $("#" + rangeId);  
          //row indexes in datatable are 0 based
          
        
          sliderDiv.slider({//***
              range: true,
              min: 1,
              max: selectedData.length - 1,
              values: [1, selectedData.length - 1],
              stop: function (event, ui) {
      
                  if (chartType === "LC" || chartType === "LS") {
                      options.hAxis.viewWindow.min = ui.values[0] - 1;
                      options.hAxis.viewWindow.max = ui.values[1];//range is [min,max)
      
                      myGoogleChart.draw(dataT, options);
                  }
                  else if(chartType==="HL" || chartType==="HS" ||  chartType==="HP"){
                  
                        myHighchart=$(chartDiv).highcharts();//lol var here --> -2 hours
                        myHighchart.xAxis[0].options.tickInterval = Math.ceil((50/(targetFrequencySec/60))/((selectedData.length - 1 - 1)/(ui.values[1]-1 - ui.values[0]-1)));
                        //  alert(chart.options.xAxis[0].tickInterval);
                        myHighchart.xAxis[0].setExtremes(ui.values[0] - 1, ui.values[1]-1);  
                        myHighchart.redraw();
                  }
              },
              slide: function (event, ui) {
                
                  rangeDiv.text(selectedData[ui.values[0]][0] + " - " + selectedData[ui.values[1]][0]);//***
              }
      
          });
        
          rangeDiv.text(selectedData[sliderDiv.slider("values", 0)][0] + " - " + selectedData[sliderDiv.slider("values", 1)][0]);//***
    
    }
   
}



function clearChartSliderAreaAndGetMemoryBack(){
    if (myDygraph!==null){//DYGRAPH
        myDygraph.destroy();
        myDygraph=null;
        $("#slider_divGENE").html('');
    }
    else {
        
        if (myHighchart!==null){//HIGHCHARTS
            myHighchart.destroy();
            myHighchart = null;
        }
        else if (myGoogleChart!==null){//GOOGLE CHART
            myGoogleChart.clearChart();
            myGoogleChart = null;
        }
        
        if (  $("#slider_divGENE").hasClass("ui-slider") ) {//if initialized
            $("#slider_divGENE").slider("destroy");
            $("#rangeGENE").text('');
        }
       
    }
}





function numberToTime(x, targetFrequencySec){
              var totalSec = x*targetFrequencySec;
                                    
              var hh = Math.floor(totalSec/3600)+"";
              hh= (hh.length===1) ? "0"+hh : hh;
              
              totalSec=totalSec%3600;
              
              var mm = Math.floor(totalSec/60)+"";
              mm= (mm.length===1) ? "0"+mm : mm;
              
              var ss = totalSec%60+"";
              ss= (ss.length===1) ? "0"+ss : ss;
              
              
              return hh+":"+mm+":"+ss;

}

function validateDate(yearStr, monthNum, dayStr){
   
           if (dayStr!=="" && yearStr!==""){
               var day = parseInt(dayStr);
               var year = parseInt(yearStr);
               
               if (!(/^\d+$/.test(dayStr)) || !(/^\d+$/.test(yearStr))){
                   throw "Date may contain numbers only";
               }
              
               if (day<=0 || year<=0){
                   throw "Date cannot be negative";
               }
               
               var maxDays;
               switch (monthNum) {
                 case 2 :
             
                     maxDays = ((year % 4 === 0 && year % 100!==0) ||year % 400 === 0) ? 29 : 28; 
                     break;
                 case 9 : case 4 : case 6 : case 11 :
                     maxDays = 30;
                     break;
                 default :
                       maxDays=  31;
             }
              
            
            
               if (day>maxDays){
                       throw (maxDays+ " days in selected month");
               }
               else if (yearStr.length!==4){
                       throw "year must have 4 digits";
               
               }
           
           }
           else{
             
               return {birthDate: null };
           }
         
         
        return {birthDate: year+"-"+monthNum+"-"+day };

}
