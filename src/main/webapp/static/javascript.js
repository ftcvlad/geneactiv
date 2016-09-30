
var appsScriptLocked = false;
 
$(function () {

 
    google.charts.load('current', {'packages':['corechart', 'table']});
    google.charts.setOnLoadCallback(function(){
              
     
               var data = new google.visualization.DataTable();
               data.addColumn('string', 'Name');
               data.addColumn('string', 'Surname');
               data.addColumn('string', 'Birth date');
               data.addColumn('string', 'id');
               data.addColumn('string', 'fillings');
                              
               var table = new google.visualization.Table(document.getElementById('tableHolderGene'));
               
               $("#listDbUsersBtn").click(function(){findSavedUsers(table, data);});
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




//      $("#errorSpanGENE").text("Marking dates...");
      
      
//      //MARK DATES
//      $.get("markDates",function(dataArray){
//            for (var i=0;i<dataArray.length;i++){
//                $('#userIDselect option[value="'+dataArray[i].id+'"]').data("foo",dataArray[i].data);
//            }
//            $("#errorSpanGENE").text("Ready");  
//      })
//      .fail(function(jqXHR, errorStatus, errorThrown){
//            setStatus($("#errorSpanGENE"), errorThrown, "ui-state-error");
//      });
          
      


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
   
    if (appsScriptLocked){return;}
    
    appsScriptLocked = true;
    $.post("logout",function(){
        appsScriptLocked = false;
        window.location.href = "Login";
    })
    .fail(function(jqXHR, textStatus, errorThrown ) {
        appsScriptLocked = false;
        alert(errorThrown);
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

function intraInterChangeGene(radioClicked) {

    var value = $(radioClicked).val();
    if (value === "en") {
        
        
        $('#radio2Gene').prop("disabled", false);
        $("#radioButtonSetGene").buttonset("refresh");
        
        
         $("#frqGENE").selectmenu("enable");
         $("#frqGENE").selectmenu("refresh");
        
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
        
      
        $("#frqGENE").selectmenu("disable");
        $("#frqGENE").selectmenu("refresh");
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

            $.post("addPatient",{data:JSON.stringify(dataToSave)}, function(userAdded){
                //alert(JSON.stringify(user));
                
                  $('#userIDselect').prepend($('<option>', { 
                        value: userAdded.id,
                        text : userAdded.alias,
                        "data-foo" :  JSON.stringify({ "full":[],"part":[]}),
                        selected: "selected"
                  }));


                  $("#userIDselect").selectmenu("destroy").selectmenu({width:150});
                  $('#addUserFormContainerGene > p:eq(0)').text("User added successfully!");
            },"json")
            .fail(function(jqXHR, errorStatus,errorThrown){
                  $('#addUserFormContainerGene > p:eq(0)').text(jqXHR.responseText);
            })


       
     
}







//FIND USERS

function findSavedUsers(table, datatable){
 $("#totalDeleteBtn").prop("disabled",true);
 $("#addToShortlistBtn").prop("disabled",true);



 $("#tableMessage").text("Retrieving patient list...");
  google.script.run
            .withSuccessHandler(updateTable)
            .withFailureHandler(updateTableFail)
            .withUserObject({table:table, datatable: datatable})
            .findSavedUsers($("#nameForFindInput").val());
}

function updateTableFail(error){
    $("#tableMessage").text(error.message);

}

function updateTable(response, args){
              
               args.datatable.removeRows(0,  args.datatable.getNumberOfRows());
               
               for (var i=0;i<response.length;i++){
                    args.datatable.addRow([response[i].name, response[i].surname, response[i].birth,response[i].PCpair_id, JSON.stringify(response[i].fillings)] ); 
               }
               
                var view = new google.visualization.DataView(args.datatable);
                view.setColumns([0,1,2]); //here you set the columns you want to display
               
              
               args.table.draw(view, {width: '100%',  cssClassNames:{headerRow : "tableHeader", tableRow: "tableRow", oddTableRow: "oddRow", headerCell  :"headerCell" }});

             
               $("#tableMessage").text("Done");
}


//DELETE USER

function deleteSelectedUser(table, datatable){

      $("#tableMessage").text("Deleting selected users...");
      var allUserIds = [];
      
      var allSelected =  table.getSelection();
      for (var i=0; i<allSelected.length; i++){
              
              allUserIds.push(datatable.getValue(allSelected[i].row,3));
            
      }
     
     
      google.script.run
            .withSuccessHandler(updateListsRemove)
            .withFailureHandler(deleteUserFail)
            .withUserObject({datatable:datatable, table:table})
            .removeFromDb(allUserIds);
}

function deleteUserFail(error){
      $("#tableMessage").text(error.message);
}

function updateListsRemove(idsToRemove, args){

    if (idsToRemove.length>0){
        for (var i=0;i<idsToRemove.length;i++){
            $('#userIDselect').find('option[value="id_'+idsToRemove[i]+'"]').remove(); 
        }
        $("#userIDselect").selectmenu("destroy").selectmenu({width:150});
       
        if (args!==undefined){//removed in userDelete and delist(args==undefined)


               for (var j=0; j< args.datatable.getNumberOfRows();j++){
                   var nextId = args.datatable.getValue(j,3);
                   if (idsToRemove.indexOf(nextId)>=0){
                       args.datatable.removeRow(j);
                       j--;
                   }
               
               }

                var view = new google.visualization.DataView(args.datatable);
                view.setColumns([0,1,2]); 
               
             
               args.table.draw(view, {width: '100%',  cssClassNames:{headerRow : "tableHeader", tableRow: "tableRow", oddTableRow: "oddRow" }});
               
               $("#totalDeleteBtn").prop("disabled",true);
               $("#addToShortlistBtn").prop("disabled",true);
        }

    }
    $("#tableMessage").text("Done"); 
}

//REMOVE FROM SHORTLIST

function removeFromShortList(){

     var id = $("#userIDselect").val();
     if (id===null){
          var errorSpanFit = $("#errorSpanFit");
          setStatus(errorSpanFit, "No id to remove!", "ui-state-error");  
     }
     else{
          google.script.run
                .withSuccessHandler(updateListsRemove)
                .removeFromShortList(id);
     }

}


//ADD TO SHORTLIST

function addToShortlist(table, datatable){

      $("#tableMessage").text("Adding selected users to shortlist...");
      var allUsers = [];
      
      var allSelected =  table.getSelection();
      for (var i=0; i<allSelected.length; i++){
              
              var row = allSelected[i].row;
              
              var id = datatable.getValue(row,3);
              var name = datatable.getValue(row,0);
              var surname = datatable.getValue(row,1);
              var fillings = datatable.getValue(row,4);
            
              allUsers.push({id: id, name: name,surname:surname, fillings: fillings  });
            
      }
     
     
      google.script.run
            .withSuccessHandler(updateListsAdd)
            .addToShortList(allUsers);
}


function updateListsAdd(usersToAdd){
    
    if (usersToAdd.length>0){
    
        $.each(usersToAdd, function (i, item) {
        
            $('#userIDselect').prepend($('<option>', { 
                    value: "id_"+item.id,
                    text : item.name+" "+item.surname,
                    "data-foo" :  item.fillings,
                    selected: "selected"
                }));
        });
        
        $("#userIDselect").selectmenu("destroy").selectmenu({width:150});
    }
    $("#tableMessage").text("Done"); 
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

    if (appsScriptLocked){return;}

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
    
        
        appsScriptLocked = true;
        
        google.script.run
            .withSuccessHandler(dbGetSucceed)
            .withFailureHandler(dbGetFail)
            .getFromDB({allDates: allSelDates.sort(), id:id.substring(3), intraday: $('input[name=interIntraGene]:checked').val()==="en"?true:false});
            
            
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
                    console.log("fin");
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


            //console.log("GOING THERE!: " + targetFrequency + "   " + selectedData[nextSelectDataIndex] + "  dataToWrite: " + allArrayData[traverseIndex][0].substring(11, 19));


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

                   // console.log(timeStr + "---" + selectedData[nextSelectDataIndex][0]);


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
    if (selectedData.length == 1) {
        setStatus(errorSpanGene, "No data in specified range", "ui-state-error");
        return;
    }


    if (retrieveType==="file"){
        //console.log(selectedData);
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
    
    
   
        appsScriptLocked  = true;
        
        google.script.run
            .withSuccessHandler(dbSaveSucceed)
            .withUserObject({selectedData: selectedData, frq:targetFrequency})
            .withFailureHandler(dbSaveFailed)
            .saveToDB({selectedData: selectedData, id:id.substring(3) });
    
    
    }

   
}




function dbSaveFailed(error){
     setStatus($("#errorSpanGENE"), error.message, "ui-state-error");
     
     var sliderDiv = $("#slider_divGENE");
     if (sliderDiv.hasClass("ui-slider")) {//if initialized
         sliderDiv.slider("destroy");
     }
     else if (sliderDiv.children().length > 0){//if dygraph
     
         sliderDiv.html('');
     }
        
     $("#line_chart_divGENE").html('');
     $("#rangeGENE").text('');
     
     appsScriptLocked = false;
     
}

function dbSaveSucceed(response, obj){

     //add dates saved to DB
            
    var currFilling =  $('#userIDselect option[value="id_'+response.id+'"]').data("foo");
            
            
   // from current filling delete dates that may have changed status (can be only  "part") 
    var allChangedDates = response.changeFilling["part"].concat(response.changeFilling["full"]);
            
    for (var i=0;i<currFilling["part"].length;i++){
         if (allChangedDates.indexOf(currFilling["part"][i])!==-1){
            currFilling["part"].splice(i,1);
            i--;
         }
    } 
            
            //append new dates
    for (i in response.changeFilling){
         if (!response.changeFilling.hasOwnProperty(i)){continue};
            
         currFilling[i] = currFilling[i].concat(response.changeFilling[i]);
    }
            
    

    var errorSpanGene = $("#errorSpanGENE");
    setStatus(errorSpanGene, "Drawing graph...", "ui-state-highlight");
    drawGraph($("#graphTypeGene").val(), "Geneactiv", 'line_chart_divGENE', 'slider_divGENE', 'rangeGENE', obj.selectedData, obj.frq);

    setStatus(errorSpanGene, "Data saved", "ui-state-highlight");


    appsScriptLocked = false;

}



function dbGetFail(error){
       var errorSpanGene = $("#errorSpanGENE");
       var sliderDiv = $("#slider_divGENE");
       if (sliderDiv.hasClass("ui-slider")) {//if initialized
             sliderDiv.slider("destroy");
       }
       else if (sliderDiv.children().length > 0){//if dygraph
       
           sliderDiv.html('');
       }
         
       $("#line_chart_divGENE").html('');
       $("#rangeGENE").text('');
       setStatus(errorSpanGene, error.message, "ui-state-error");
       appsScriptLocked = false;
}



function dbGetSucceed(response){
    var errorSpanGene = $("#errorSpanGENE");

 
   if (response.intraday===true){
          
        var genFrqData = [['Time']];
        var frqMinutes = parseInt($("#frqGENE").val());
        frqMinutes = (frqMinutes===-1) ? 1:(frqMinutes/60);

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
            str = str == "00:00" ? "24:00" : str;


            genFrqData.push([str]);
        }

        console.log(genFrqData);

  //GENERATE SELECTED DATA

        var totalStepsForPeriod = null;
      
        for (var i=0;i<response.table[0].length;i++){
        
            genFrqData[0].push(response.table[0][i]);

            var dataAvailableLength = response.table.length;
            var itemsPushed = 0;

            for (j = 1; j < dataAvailableLength; j++) {
                
                if (response.table[j][i]!==null){
                    totalStepsForPeriod += response.table[j][i];
                }


                if (j  % frqMinutes == 0 || j == (dataAvailableLength - 1)) {//add data every f hours or leftovers
                console.log(itemsPushed+"  -  "+ genFrqData[itemsPushed + 1]);
                    genFrqData[itemsPushed + 1].push(totalStepsForPeriod);
                    totalStepsForPeriod = null;
                    itemsPushed++;
                }

            }

        }


 
        response.table = genFrqData;
    
    
    }
    
    console.log(response.table);
      
    setStatus(errorSpanGene, "Drawing graph...", "ui-state-highlight");
    drawGraph($("#graphTypeGene").val(), "Geneactiv", 'line_chart_divGENE', 'slider_divGENE', 'rangeGENE', response.table,frqMinutes*60);

   

    setStatus(errorSpanGene, "Done", "ui-state-highlight");
    appsScriptLocked = false;
}














//=========================================================================================================================================
//===================================================================================================================
//=========================================================================================================================================

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













//=========================================================================================================================================
//===============================================SAME AGAIN :) ============================================================================
//=========================================================================================================================================

var myDygraph = null;
function drawGraph(chartType, chartTitle, chartId, sliderId, rangeId, selectedData, targetFrequencySec) {


    if (targetFrequencySec===undefined){//this means it is interday and googleChart should be used
        targetFrequencySec = 100;
    }    
  

       if (targetFrequencySec>=60 && myDygraph!==null){//if after dygraphs
          myDygraph.destroy();
          $("#slider_divGENE").html('');
          myDygraph=null;
    }
    


    //DRAW GRAPHS

    var chartDiv = document.getElementById(chartId);
    var chart;
    if (chartType === "LC" || chartType === "LS") {
    
        if (targetFrequencySec>=60 ){//undefined for interday
                
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
                    chart = new google.visualization.LineChart(chartDiv);//***
        
                }
                else if (chartType === "LS") {
                    options.isStacked = true;
                    chart = new google.visualization.AreaChart(chartDiv);
                }
                chart.draw(dataT, options);
         }
         else{
               if (  $("#slider_divGENE").hasClass("ui-slider") ) {//if initialized
                    $("#slider_divGENE").slider("destroy");
                    $("#" + rangeId).text('');
               }
             
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
                                      
                                      console.log(gran);
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
    
    else if (chartType==="HL" || chartType==="HS"){
    
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
                    pointPlacement: 'on'            
                };
                allSeries.push(nextSeries);
            
            }
           
    
            Highcharts.seriesTypes.line.prototype.cropShoulder = 0;
            new Highcharts.Chart({

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
                    endOnTick:true,
                    startOnTick:true
                 
                            
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
                        stacking: 'normal'//percent
                    }
               }, 
        
               series: allSeries
        
            });
    
    
          
            
    
    
    
    }
 

    

    
    if (targetFrequencySec>=60 ||  chartType==="HL" || chartType==="HS"){


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
      
                      chart.draw(dataT, options);
                  }
                  else if(chartType==="HL" || chartType==="HS"){
                  
                        chart=$(chartDiv).highcharts();//lol var here --> -2 hours
                        chart.xAxis[0].options.tickInterval = Math.ceil((50/(targetFrequencySec/60))/((selectedData.length - 1 - 1)/(ui.values[1]-1 - ui.values[0]-1)));
                        //  alert(chart.options.xAxis[0].tickInterval);
                        chart.xAxis[0].setExtremes(ui.values[0] - 1, ui.values[1]-1);  
                        chart.redraw();
                  
                  }
      
              },
              slide: function (event, ui) {
                
                  rangeDiv.text(selectedData[ui.values[0]][0] + " - " + selectedData[ui.values[1]][0]);//***
              }
      
          });
        
          rangeDiv.text(selectedData[sliderDiv.slider("values", 0)][0] + " - " + selectedData[sliderDiv.slider("values", 1)][0]);//***
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


