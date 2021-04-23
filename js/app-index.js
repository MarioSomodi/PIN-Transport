//Current ticket to be bought
var globalTicket;
//Function that will we triggered when the DOC element is ready.
$(document).ready(function() {
  //Get all tickets their passangers, and all counties and their cities.
  GetAllCountiesAndCities();
  GetAllTicketsAndPassangers();
  //Animates some elements on the webpage.
  textAnimation();
  //Show back to top button when user scrolls past header.
  backToTop();
  //Fix the navbar to the top when user scrolls past the header.
  navBarStickToTop();
  //Fill the ticket table.
  fillTicketTable();
  //Initialize all select element and also fill the two main select elements with counties and their cities.
  fillSelectElements();
  //Initialize date pickers.
  initDatepickers();
  //Disable the return date if the ticket type is oneway or enable if return journey
  checkTicketType();
  //Ticket table search
  ticketSearch();
  //Ticket passangers table search
  passangerSearch();
  //Page loader
  siteLoader();
});

//Logic of the back to top button.
function backToTop(){
  var headerHeight = $('#header').height() + 50;
  $(window).scroll(function(){
    if($(window).scrollTop() > headerHeight)
      $('#backToTop').addClass('visibleUpTop');
    else
      $('#backToTop').removeClass('visibleUpTop');
  });
}

//Logic to stick the navbar to the top.
function navBarStickToTop(){
  var nav = $('#PINNavbar');
  var headerHeight = $('#header').height() + 50;
  $(window).scroll(function(){
    if($(window).scrollTop() > headerHeight)
      nav.addClass('fixed-top')
    else
      nav.removeClass('fixed-top')
  });
}

//Bootstrap-datepicker init.
function initDatepickers(){
  $('.datepicker-pol').datepicker({
    clearBtn:true,
    disableTouchKeyboard:true,
    language:'hr',
    title:"Odabir datuma polaska",
    todayHighlight:true
  });
  $('.datepicker-pov').datepicker({
    clearBtn:true,
    disableTouchKeyboard:true,
    language:'hr',
    title:"Odabir datuma povratka",
    todayHighlight:true
  });
}

//Init of custom typed.js objects.
function textAnimation(){
  var typed = new Typed("#element1", {
    strings:["izija"],
    typeSpeed:100,
    backSpeed:100,
    cursorChar: '_',
    smartBackspace:false,
    loop:true,
    loopCount:Infinity
  });

  var typed = new Typed("#element2", {
    strings:["isija"],
    typeSpeed:100,
    backSpeed:100,
    cursorChar: '_',
    smartBackspace:false,
    loop:true,
    loopCount:Infinity
  });
}

//Focus on the date picker by button click.
function triggerDatepicker(input)
{
  $(input).focus();
}

//Fill the two main selects with the counties and their cities and also init all bootstrap-select elements.
function fillSelectElements(){
  var selectPolaziste = $('#polaziste');
  var selectOdrediste = $('#odrediste');
  oDbCounties.on('value', function(oOdgovorPosluzitelja)
  {
    counties.forEach(function(county){
      selectPolaziste.append(
        '<optgroup id="polOptGroup' + county.countyId + '" label="' + county.countyName + '">'+
        '</optgroup'
      );
      selectOdrediste.append(
        '<optgroup id="odrOptGroup' + county.countyId + '" label="' + county.countyName + '">'+
        '</optgroup'
      );
      county.cities.forEach(function(city){
        var polOptGroup = '#polOptGroup' + county.countyId;
        var odrOptGroup = '#odrOptGroup' + county.countyId;
        if(city.countySeat == true)
        {
          $(polOptGroup).attr('data-subtext', city.cityName)
          $(odrOptGroup).attr('data-subtext', city.cityName)
        }
        $(polOptGroup).append(
          '<option value="' + city.cityName + '" id="polOption' + city.cityId + '">' + city.cityName +
          '</option>'
        )
        $(odrOptGroup).append(
          '<option value="' + city.cityName + '" id="odrOption' + city.cityId + '">' + city.cityName +
          '</option>'
        )
        if(city.cityActiveOrInactive == false)
        {
          var polOption = '#polOption' + city.cityId;
          var odrOption = '#odrOption' + city.cityId;
          $(polOption).attr('disabled', '1');
          $(polOption).addClass('disabledOpt');
          $(odrOption).attr('disabled', '1');
          $(odrOption).addClass('disabledOpt');
        }
      });
    });
    $('select').selectpicker();
    $('select').selectpicker('refresh');
  });
}

//Logic for the button that switches the destination and departure.
function switchOptions(){
  var selectPol = $('#polaziste');
  var selectOdr = $('#odrediste');
  var selectedOptionPol = selectPol.val();
  var selectedOptionOdr = selectOdr.val();

  selectPol.selectpicker('val', selectedOptionOdr);
  selectOdr.selectpicker('val', selectedOptionPol);

  selectPol.selectpicker('refresh');
  selectOdr.selectpicker('refresh');
}

//Checks the ticket type and according to it disabled the end date for the oneway and enables it for the return yourney.
function checkTicketType(){
  var datumPov = $('#datumPov');
  var vrstaKarte = $('#vrstaKarte');
  var button = $('#dpPov');
  vrstaKarte.on("changed.bs.select", function(e) {
    var selector = "#datumPov";
    if(vrstaKarte.val() == "Jednosmjerna karta")
    {
      datumPov.attr('disabled', true);
      datumPov.selectpicker('refresh');
      button.attr('disabled', true);
      removeSuccesOrError(".datumBorderPov", "both");
      $(selector).attr("placeholder", "Datum povratka nije potreban.")
      removeErrorMessage("#datumPovError");
    }
    else
    {
      $(selector).attr("placeholder", "Datum povratka..")
      datumPov.removeAttr('disabled');
      button.removeAttr('disabled');
      datumPov.selectpicker('refresh');
    }
  });
}

//Adds the red shadow to incorrently submitted form elements.
function setError(dataId, type){
  if(type == "select")
  {
    var selector = 'button[data-id="' + dataId + '"]';
    $(selector).removeClass("success");
    $(selector).addClass("error");
  }
  else if(type == "input")
  {
    var selector = dataId;
    $(selector).removeClass("success");
    $(selector).addClass("error");
  }
}

//Adds the green shadow for correctly submitted form elements.
function setSuccess(dataId, type){
  if(type == "select")
  {
    var selector = 'button[data-id="' + dataId + '"]';
    $(selector).removeClass("error");
    $(selector).addClass("success");
  }
  else if(type == "input")
  {
    var selector = dataId;
    $(selector).addClass("success");
    $(selector).removeClass("error");
  }
}

//Adds the error message under the incorretly submitted form element.
function setErrorMessage(idOfErrorFiled, message){
  var selector = $(idOfErrorFiled);
  selector.text(message);
  selector.addClass("visible");
  selector.removeClass("hiddenElement");
}

//Removes the error message under the incorretly submitted form element.
function removeErrorMessage(idOfErrorFiled)
{  
  var selector = $(idOfErrorFiled);
  selector.addClass("hiddenElement");
  selector.removeClass("visible");
}

//Removes error shadow, succes shadow or both from the form element.
function removeSuccesOrError(dataId, type)
{
  var selector = dataId;
  if(type == "error")
  {
    $(selector).removeClass("success");
  }
  else if (type == "both")
  {
    $(selector).removeClass("success");
    $(selector).removeClass("error");
  }
  else
  {
    $(selector).removeClass("error");
  }
}

//Validates all new ticket form elements.
function validateNewTicketForm(){
  var vrstaKarte = $('#vrstaKarte');
  var selectPol = $('#polaziste');
  var selectOdr = $('#odrediste');
  var datumPol = $('#datumPol');
  var datumPov = $('#datumPov');
  var passangerNum = $('#passangerNum');
  var razredKarte = $('#razredKarte');
  var validacija = "";
  //
  //Validation of ticket type.
  //
  if(vrstaKarte.val() == "")
  {
    setErrorMessage("#vrstaKarteError", "Morate odabrati vrstu karte!");
    setError("vrstaKarte", "select");
  }
  else
  {
    removeErrorMessage("#vrstaKarteError");
    setSuccess("vrstaKarte", "select");
    validacija = validacija + "1";
  }
  //
  //Validation of ticket point of departure.
  //
  if(selectPol.val() == "")
  {
    setErrorMessage("#polazisteError", "Morate odabrati polaziste!");
    setError("polaziste", "select");
  }
  else if(selectPol.val() == selectOdr.val())
  {
    setErrorMessage("#polazisteError", "Polaziste ne moze biti jednako odredistu!");
    setError("polaziste", "select");
  }
  else
  {
    removeErrorMessage("#polazisteError");
    setSuccess("polaziste", "select");
    validacija = validacija + "2";
  }
  //
  //Validation of ticket destination.
  //
  if(selectOdr.val() == "")
  {
    setErrorMessage("#odredisteError", "Morate odabrati odrediste!");
    setError("odrediste", "select");
  }
  else if(selectOdr.val() == selectPol.val())
  {
    setErrorMessage("#odredisteError", "Odrediste ne moze biti jednako polazistu!");
    setError("odrediste", "select");
  }  
  else
  {
    removeErrorMessage("#odredisteError");
    setSuccess("odrediste", "select");
    validacija = validacija + "3";
  }
  //
  //Validation of start date.
  //
  var currentDate = new Date();
  var enteredDatePol = new Date(datumPol.val());
  currentDate.setHours(0,0,0,0);
  enteredDatePol.setHours(0,0,0,0);
  if(datumPol.val() == "")
  {
    setErrorMessage("#datumPolError", "Morate odabrati datum polaska!");
    setError(".datumBorderPol", "input");
  }
  else if(enteredDatePol < currentDate)
  {
    setErrorMessage("#datumPolError", "Odabrani datum polaska ne smije biti manji od danasnjeg datuma!");
    setError(".datumBorderPol", "input");
  }
  else
  {
    removeErrorMessage("#datumPolError");
    setSuccess(".datumBorderPol", "input");
    validacija = validacija + "4";
  }
  //
  //Validation of end date.
  //
  var enteredDatePov = new Date(datumPov.val());
  enteredDatePov.setHours(0,0,0,0);
  if(datumPov.val() == "")
  {
    if(vrstaKarte.val() != "Jednosmjerna karta")
    {
      setErrorMessage("#datumPovError", "Morate odabrati datum povratka!");
      setError(".datumBorderPov", "input");
    }
    else
    {
      removeSuccesOrError(".datumBorderPov", "error");
      validacija = validacija + "5";
    }
  }
  else if(enteredDatePov < currentDate)
  {
    if(vrstaKarte.val() != "Jednosmjerna karta")
    {
      setErrorMessage("#datumPovError", "Odabrani datum povratka ne smije biti manji od danasnjeg datuma!");
      setError(".datumBorderPov", "input");
    }    
    else
    {
      removeSuccesOrError(".datumBorderPov", "error");
      validacija = validacija + "5";
    }
  }
  else if(enteredDatePov < enteredDatePol)
  {
    if(vrstaKarte.val() != "Jednosmjerna karta")
    {
      setErrorMessage("#datumPovError", "Odabrani datum povratka ne smije biti manji od odabranog datuma polaska!");
      setError(".datumBorderPov", "input");
    }    
    else
    {
      removeSuccesOrError(".datumBorderPov", "error");
      validacija = validacija + "5";
    }
  }
  else
  {
    if(vrstaKarte.val() != "Jednosmjerna karta")
    {
      removeErrorMessage("#datumPovError");
      setSuccess(".datumBorderPov", "input");
    }
    else
    {
      removeSuccesOrError(".datumBorderPov", "324");
      removeErrorMessage("#datumPovError");
    }
    validacija = validacija + "5";
  }
  //
  //Validation of ticket passangers number.
  //
  if(passangerNum.val() == "")
  {
    setErrorMessage("#passangerNumError", "Morate specifirati broj putnika!");
    setError("#passangerNum", "input");
  }
  else if(passangerNum.val() <= 0)
  {
    setErrorMessage("#passangerNumError", "Broj putnika moze najmanje biti 1!");
    setError("#passangerNum", "input");
  }
  else
  {
    removeErrorMessage("#passangerNumError");
    setSuccess("#passangerNum", "input");
    validacija = validacija + "6";
  }
  //
  //Validation of ticket class.
  //
  if(razredKarte.val() == "")
  {
    setErrorMessage("#classError", "Morate odabrati razred karte!");
    setError("razredKarte", "select");
  }
  else
  {
    removeErrorMessage("#classError");
    setSuccess("razredKarte", "select");
    validacija = validacija + "7";
  }
  //
  //Changing the position of the exhange button on start so it is responsive by checking what form elements are correct or incorrect.
  //
  var btnExchange = $(".exchange");
  responsivnesOfTheExchangeButton(btnExchange);
  //Doing the same thing every time the window is resized so it will be always responsive.
  $( window ).resize(function() {
    responsivnesOfTheExchangeButton(btnExchange);
  });
  //Checks if all form elements where correctly submited. if so calls the enterPassanger function that allows the input of ticket passangers.
  if(validacija == "1234567")
  {
    enterPassangerInfo(passangerNum.val())
  }
}

//Sets the exchange buttons position based on the form elements.
function responsivnesOfTheExchangeButton(btnExchange)
{
  if(($('button[data-id="odrediste"]').hasClass("error") || $('button[data-id="polaziste"]').hasClass("error")) && $( window ).width() > 558)
  {
    btnExchange.addClass("placeholder");
  }
  else
  {
    btnExchange.removeClass("placeholder");
  }
  if($('button[data-id="odrediste"]').hasClass("error") && $( window ).width() < 559)
  {
    btnExchange.attr("style", "bottom : 7.7rem");
  }
  else
  {
    btnExchange.removeAttr("style");
  }
}
//Global variable that is binded to the HTML so we can access the selected number of passangers that the ticket has.
var numOfPassangersToAdd = 0;
//Function that allows multiple inputs of passangers for the current ticket.
function enterPassangerInfo(numOfPassangers)
{
  $("#closeButton").removeClass("visible");
  $("#closeButton").addClass("hiddenElement");
  $('#addPassanger').removeClass('disabled');
  $('#addPassanger').removeAttr('disabled');
  window.numOfPassangersToAdd = numOfPassangers;
  var numOfPassangersToAdd = $('#numOfPassangersToAdd');
  var passangerFirstName = $('#passangerFirstName');
  var passangerLastName = $('#passangerLastName');
  var passangerOIB = $('#passangerOIB');
  numOfPassangersToAdd.text("Putnika za dodati: " + numOfPassangers);
  var passangers = [];
  var passangerCount = 0;
  //
  //Listens for the click on the button to add the new passanger.
  //
  $("#addPassanger").click(function(e) {
    e.stopImmediatePropagation();
    var validacija = "";
    var passangerOIBs = [];
    //
    //Makes an array that contains all currently entered passangers OIBs will be used later to check that the passangers don't have the same OIB.
    //
    passangers.forEach(function(passanger){
      passangerOIBs.push(passanger.passangerOIB);
    });
    //
    //Validation of first name.
    //
    if(passangerFirstName.val() == "")
    {
      setErrorMessage("#passangerFirstNameError", "Ime putnika ne moze biti prazno!");
      setError("#passangerFirstName", "input");
    }
    else if(passangerFirstName.val().length < 2)
    {
      setErrorMessage("#passangerFirstNameError", "Ime putnika ne moze biti manje od 2 slova!");
      setError("#passangerFirstName", "input");
    }
    else if(passangerFirstName.val().length > 32)
    {
      setErrorMessage("#passangerFirstNameError", "Ime putnika ne moze biti dulje od 32 slova!");
      setError("#passangerFirstName", "input");
    }
    else if(/\d/.test(passangerFirstName.val()))
    {
      setErrorMessage("#passangerFirstNameError", "Ime putnika ne moze sadrzavati broj!");
      setError("#passangerFirstName", "input");
    }
    else if(passangerFirstName.val()[0] != passangerFirstName.val()[0].toUpperCase())
    {
      setErrorMessage("#passangerFirstNameError", "Ime putnika ne moze poceti sa malim slovom!");
      setError("#passangerFirstName", "input");
    }
    else
    {
      removeErrorMessage("#passangerFirstNameError");
      setSuccess("#passangerFirstName", "input");
      validacija = validacija + "1";
    }
    //
    //Validation of last name.
    //
    if(passangerLastName.val() == "")
    {
      setErrorMessage("#passangerLastnameError", "Prezime putnika ne moze biti prazno!");
      setError("#passangerLastName", "input");
    }
    else if(passangerLastName.val().length < 2)
    {
      setErrorMessage("#passangerLastnameError", "Prezime putnika ne moze biti manje od 2 slova!");
      setError("#passangerLastName", "input");
    }
    else if(passangerLastName.val().length > 25)
    {
      setErrorMessage("#passangerLastnameError", "Prezime putnika ne moze biti dulje od 25 slova!");
      setError("#passangerLastName", "input");
    }
    else if(/\d/.test(passangerLastName.val()))
    {
      setErrorMessage("#passangerLastnameError", "Prezime putnika ne moze sadrzavati broj!");
      setError("#passangerLastName", "input");
    }
    else if(passangerLastName.val()[0] != passangerLastName.val()[0].toUpperCase())
    {
      setErrorMessage("#passangerLastnameError", "Prezime putnika ne moze poceti sa malim slovom!");
      setError("#passangerLastName", "input");
    }
    else
    {
      removeErrorMessage("#passangerLastnameError");
      setSuccess("#passangerLastName", "input");
      validacija = validacija + "2";
    }
    //
    //Validation of OIB.
    //
    if(passangerOIB.val() == "")
    {
      setErrorMessage("#passangerOIBError", "OIB putnika ne moze biti prazan!");
      setError("#passangerOIB", "input");
    }
    else if(passangerOIB.val().length < 11)
    {
      setErrorMessage("#passangerOIBError", "OIB putnika ne moze biti manji od 11 znamenki!");
      setError("#passangerOIB", "input");
    }
    else if(passangerOIB.val().length > 11)
    {
      setErrorMessage("#passangerOIBError", "OIB putnika ne moze biti veci od 11 znamenki!");
      setError("#passangerOIB", "input");
    }
    else if(passangerOIB.val()[0] == 0)
    {
      setErrorMessage("#passangerOIBError", "OIB putnika ne moze imati broj 0 na pocetku!");
      setError("#passangerOIB", "input");
    }
    else if(passangerOIBs.includes(passangerOIB.val())) //Using the previously generated array to check if passanger OIB already exists.
    {
      setErrorMessage("#passangerOIBError", "Svaki putnik mora imati unikatni OIB!");
      setError("#passangerOIB", "input");
    }
    else
    {
      removeErrorMessage("#passangerOIBError");
      setSuccess("#passangerOIB", "input");
      validacija = validacija + "3";
    }
    //
    //Check if all form elements where submitted correctly.
    //
    if(validacija == "123")
    {
      //
      //Make an object of Type passanger contains all the passanger info and push it to the array.
      //
      const passanger = new Passanger(window.numOfPassangersToAdd, passangerFirstName.val(), passangerLastName.val(), passangerOIB.val(), passangerCount);
      passangerCount++;
      passangers.push(passanger);
      //
      //Decrament the number of passangers to add cause one was added.
      //
      window.numOfPassangersToAdd = window.numOfPassangersToAdd - 1;
      //
      //Show the succes message.
      //
      $('#successMassage').addClass("visible");
      $('#successMassage').removeClass("hiddenElement");
      //
      //If the number of passangers to be added is equal to 0 or less then disabled the add passanger button and hide the Add passanger modal.
      //Trigger the buyTicket function that handles the making of the new ticket.
      //
      if(window.numOfPassangersToAdd <= 0)
      {
        var vrstaKarte = $('#vrstaKarte');
        var selectPol = $('#polaziste');
        var selectOdr = $('#odrediste');
        var datumPol = $('#datumPol');
        var datumPov = $('#datumPov');
        var razredKarte = $('#razredKarte');
        var passangerNum = $('#passangerNum')
        $('#addPassanger').addClass('disabled');
        $('#addPassanger').attr('disabled', true);
        $("#closeButton").addClass("visible");
        $("#closeButton").removeClass("hiddenElement");
        setTimeout(function (){
          $('#modalAddPassangers').modal('hide')
          buyTicket(vrstaKarte.val(), selectPol.val(), selectOdr.val(), datumPol.val(), datumPov.val(), razredKarte.val(), passangers, passangerNum.val());
          passangers = [];
        }, 1500);
      }
      else
      {
        $("#closeButton").removeClass("visible");
        $("#closeButton").addClass("hiddenElement");
      }
      //
      //Update the form if there are still passangers to be added.
      //
      setTimeout(function (){
        numOfPassangersToAdd.text("Putnika za dodati: " + window.numOfPassangersToAdd);
        passangerFirstName.val("");
        passangerLastName.val("");
        passangerOIB.val("");
        removeSuccesOrError("#passangerFirstName", "error");
        removeSuccesOrError("#passangerLastName", "error");
        removeSuccesOrError("#passangerOIB", "error");
      }, 1000);
      setTimeout(function (){
        $('#successMassage').removeClass("visible");
        $('#successMassage').addClass("hiddenElement");
      }, 3000);
    }
  });
  //
  //Listens for a click on the odustani button if clicked closes the modal.
  //
  $("#closeAddPassanger").click(function(e) {
    e.stopImmediatePropagation();
    $('#modalAddPassangers').modal('hide');
  });
  //
  //Listens for a click on the x button and only allows exit if the number of passangers to be added is equal 0 or less.
  //
  $("#closeButton").click(function(e) {
    e.stopImmediatePropagation();
    if(window.numOfPassangersToAdd <= 0)
    {
      $('#modalAddPassangers').modal('hide');
    }
  });
  //
  //Setting some default values for the modal.
  //
  $('#modalAddPassangers').modal({
    backdrop: 'static',
    keyboard: false
  });
  //
  //Removes the bootstrap added offset(padding on the right of the screen) so closing the modal and showing it does not look wierd.
  //
  $('body').removeAttr("style");
}

//Make the new ticket object and calls all the nedded function for that creation.
function buyTicket(ticketType, ticketPointOfDeparture, ticketDestination, ticketStartDate, ticketEndDate, ticketClass, passangers, numOfPassangers)
{
  var modalTicketPolaziste = $('#modalTicketPolaziste');
  var arrowForTicket = $('#arrowForTicket');
  var modalTicketOdrediste = $('#modalTicketOdrediste');
  var modalTicketType = $('#modalTicketType')
  var modalTicketClass = $('#modalTicketClass');
  var modalStartDate = $('#modalStartDate');
  var modalTicketExpiry = $('#modalTicketExpiry');
  var modalNumOfPassan = $('#modalNumOfPassan');
  var modalFullPrice = $('#modalFullPrice');
  //
  //Sets some info on the ticket modal so we can show the user what he is buying.
  //
  modalTicketPolaziste.text(ticketPointOfDeparture);
  modalTicketOdrediste.text(ticketDestination);
  modalTicketType.text("Vrsta karte: " + ticketType);
  modalTicketClass.text("Razred karte: " + ticketClass);
  modalStartDate.text("Datum polaska (mm.dd.yyyy): " + ticketStartDate);
  modalNumOfPassan.text("Broj putnika: " + numOfPassangers);
  var ticketExpiry, ticketId;
  //
  //Check the ticket type.
  //
  if(ticketType == "Jednosmjerna karta")
  {
    arrowForTicket.addClass("fa-arrow-right");
    arrowForTicket.removeClass("fa-arrows-alt-h");
    //If ticket is oneway we don't need the end date.
    ticketEndDate = "/"
    ticketId = generateTicketId();
    //Calls the function DateOfTicketExpiry that will add 7 days to the ticket start date and set it as the ticket expiry date.
    ticketExpiry = DateOfTicketExpiry(1, ticketStartDate, ticketEndDate);
    //Calls the function that returns the ticket's full price for all passangers
    ticketPrice = getTicketPrice(ticketPointOfDeparture, ticketDestination, ticketType, ticketClass, numOfPassangers);
    //Sets the full price to be seen on the ticket modal.
    modalFullPrice.text("Puna cijena (cijena za sve putnike): " + ticketPrice + " kn");
    //Sets the ticket expiry on the ticket modal.
    modalTicketExpiry.text("Datum isteka valjanosti karte (mm.dd.yyyy): " + ticketExpiry);
  }
  else if (ticketType == "Povratna karta")
  {
    arrowForTicket.removeClass("fa-arrow-right");
    arrowForTicket.addClass("fa-arrows-alt-h");
    ticketId = generateTicketId();
    //Calls the function DateOfTicketExpiry that will add 14 days to the ticket end date and set it as the ticket expiry date.
    ticketExpiry = DateOfTicketExpiry(2, ticketStartDate, ticketEndDate);
    //Calls the function that returns the ticket's full price for all passangers
    ticketPrice = getTicketPrice(ticketPointOfDeparture, ticketDestination, ticketType, ticketClass, numOfPassangers);
    //Sets the full price to be seen on the ticket modal.
    modalFullPrice.text("Puna cijena (cijena za sve putnike): " + ticketPrice + " kn");
  }
  //
  //Makes the ticket object
  //
  const ticket = new Ticket(ticketId, ticketType, ticketPointOfDeparture, ticketDestination, ticketStartDate, ticketEndDate, ticketExpiry, ticketClass, ticketPrice, passangers, 0); 
  //
  //Calls the function that triggers the ticket modal.
  //
  globalTicket = ticket;
  triggerNewTicketModal();
}

//Generate unique 6 digit id for the ticket.
function generateTicketId()
{
  var ids = [];
  //Get all currently used ids.
  oDbTickets.on('value', function(sOdgovorPosluzitelja){
    tickets.forEach(function(ticket){
      ids.push(ticket.ticketId);
    });
  });
  var ticketId = Math.floor(100000 + Math.random() * 900000);
  var idGenerated = false;
  //Runs this code until a unique 6 digit id is generated
  while(!idGenerated){
    if(ids.includes(ticketId))
    {
      ticketId = Math.floor(100000 + Math.random() * 900000);
      idGenerated = false;
    }
    else
      idGenerated = true;
  }
  //When the id generated bool variables is true it will return the ticket id.
  if(idGenerated)
  {
    return ticketId;
  }
}

//Add 7 days on the start date for the oneway ticket and 14 on the end date for the return yourney ticket.
function DateOfTicketExpiry(ticketType, sD, eD)
{
    if(ticketType == 1)
    {
      var date = new Date(sD);
      const startDate = addDays(date, 7);
      var dd = startDate.getDate();
      var MM = startDate.getMonth() + 1;
      var yyyy = startDate.getFullYear(); 
      var sDatum = MM + "/" + dd + "/" + yyyy;
      return sDatum;
    }
    else if(ticketType == 2)
    {
      var date = new Date(eD);
      const endDate = addDays(date, 14);
      var dd = endDate.getDate();
      var MM = endDate.getMonth() + 1; 
      var yyyy = endDate.getFullYear(); 
      var sDatum = MM + "/" + dd + "/" + yyyy;
      return sDatum;
    }
}

//Adds days to date.
function addDays(date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}

//Generates the ticket price and returns it's full value.
function getTicketPrice(ticketPointOfDeparture, ticketDestination, ticketType, ticketClass, numOfPassangers){
  //
  //Gets the current ticket point of departure long and lat, and the current ticket destinations long and lat.  
  //
  var latitudeDeparture, longitudeDeparture, latitudeDestination, longitudeDestination;
  oDbCounties.on('value', function(sOdgovorPosluzitelja){
    counties.forEach(function(county){
      county.cities.forEach(function(city){
        if(city.cityName == ticketPointOfDeparture)
        {
          latitudeDeparture = city.cityLatitude;
          longitudeDeparture = city.cityLongitude;
        }
        else if(city.cityName == ticketDestination)
        {
          latitudeDestination = city.cityLatitude;
          longitudeDestination = city.cityLongitude;
        }
      });
    });
  });
  //
  //Calls the funtion getDistanceFromLatLonInKm that return the distance in KM from two sets of long and lat.
  //
  var distanceInKM = getDistanceFromLatLonInKm(latitudeDeparture, longitudeDeparture, latitudeDestination, longitudeDestination);
  var modalInitialPrice = $('#modalInitialPrice');
  if(ticketType == "Jednosmjerna karta")
  {
    //Calls the function that returns the onweway ticket full price.
    var onewayTicketPrice = getOnewayTicketPrice(ticketClass, distanceInKM, numOfPassangers);
    return onewayTicketPrice;
  }
  else if (ticketType == "Povratna karta")
  {
    var onewayTicketPrice = getOnewayTicketPrice(ticketClass, distanceInKM, numOfPassangers) / numOfPassangers;
    var priceToSubstract = 0.30 * (onewayTicketPrice * 2);
    //Price for one passanger.
    var basePrice = (onewayTicketPrice * 2) - priceToSubstract;
    //Calculates the full ticket price.
    var returnTicketPrice = Math.round(basePrice * numOfPassangers);
    //Sets the initial price(price for one passager) on the ticket modal.
    modalInitialPrice.text("Prvobitna cijena (cijena za jednog putnika): " + Math.round(basePrice) + " kn");
    return returnTicketPrice;
  }
}

//Return the full price of the oneway ticket. 
function getOnewayTicketPrice(ticketClass, distanceInKM, numOfPassangers)
{
  var modalInitialPrice = $('#modalInitialPrice');
  var baseTicketPrice, priceWithPassangers;
  //Checks ticket class
  if(ticketClass == "Prvi razred")
  {
    baseTicketPrice = 0.7 * distanceInKM;
  }
  else if(ticketClass == "Drugi razred")
  {
    baseTicketPrice = 0.35 * distanceInKM;
  }
  //Sets the initial price on the ticket modal.
  modalInitialPrice.text("Prvobitna cijena (cijena za jednog putnika): " + Math.round(baseTicketPrice) + " kn");
  return priceWithPassangers = Math.round(baseTicketPrice * numOfPassangers);
}

//Returns the distance in KM from two sets of long and lat by using the Haversine formula.
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var distanceInKM = R * c;
  return Math.round(distanceInKM);
}

//Input degrees get radian.
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

//Triggers the new ticket modal and if ticket is bought writes the ticket to firebase.
function triggerNewTicketModal()
{
  var ticketDiscount = $("#ticketDiscount");
  var btnDiscount = $('#btnDiscount')
  btnDiscount.removeClass("disabled")
  btnDiscount.removeAttr("disabled", true);
  ticketDiscount.removeClass("disabled")
  ticketDiscount.removeAttr("disabled", true);
  ticketDiscount.text("")
  $('#buyTicketModal').removeClass('disabled')
  $('#buyTicketModal').removeAttr('disabled', true)
  $('#successMassageTicket').removeClass("visible");
  $('#successMassageTicket').addClass("hiddenElement");
  $('#modalTicketPrice').modal('show');
  $('body').removeAttr("style");
  //Listens for the click on the x button and closes the ticket modal.
  $('#buttonCloseTicket').click(function(e){
    e.stopImmediatePropagation();
    $('#modalTicketPrice').modal('hide');
  });
  //Listens for click on odustani and closes the ticket modal.
  $('#closeBuyTicket').click(function(e){
    e.stopImmediatePropagation();
    $('#modalTicketPrice').modal('hide');
  });
}

//Writes the newly bought ticket to the DB.
function ticketToFB(){
  $('#buyTicketModal').addClass('disabled')
    $('#buyTicketModal').attr('disabled', true)
    //
    //Writes the ticket to firebase.
    //
    const autoId = oDbTickets.push().key;
    oDbTickets.child(autoId).set({
      passangers : globalTicket.passangers,
      ticketClass : globalTicket.ticketClass,
      ticketDestination : globalTicket.ticketDestination,
      ticketEndDate : globalTicket.ticketEndDate,
      ticketExpiry : globalTicket.ticketExpiry,
      ticketId : globalTicket.idOfTicket,
      ticketPointOfDeparture : globalTicket.ticketPointOfDeparture,
      ticketPrice : globalTicket.ticketPrice,
      ticketStartDate : globalTicket.ticketStartDate,
      ticketType : globalTicket.ticketType
    });
    //
    //Show the succes message.
    //
    $('#successMassageTicket').addClass("visible");
    $('#successMassageTicket').removeClass("hiddenElement");
    //Hide the modal.
    setTimeout(function (){
      $('#modalTicketPrice').modal('hide');
    }, 3000);  
}

//Fills the bootstrap table that contains all tickets.
function fillTicketTable(){
  var tbody = $('#ticketsTable tbody');
  oDbTickets.on('value', function(sOdgovorPosluzitelja){
    tbody.empty();
    tickets.forEach(function(ticket){
      tbody.append(
        '<tr>' +
          '<th scope="row">' + ticket.idOfTicket + '</th>' +
          '<th>' + ticket.ticketType + '</th>' +
          '<th>' + ticket.ticketPointOfDeparture + '</th>' +
          '<th>' + ticket.ticketDestination + '</th>' +
          '<th>' + ticket.ticketStartDate + '</th>' +
          '<th>' + ticket.ticketEndDate + '</th>' +
          '<th>' + ticket.ticketExpiry + '</th>' +
          '<th>' + "<button class='btn btn-danger' onclick='showTicketPasssangers(" + ticket.idOfTicket + ")'>" + ticket.passangerNum + "</button>" + "</th>" +
          '<th>' + ticket.ticketClass + '</th>' +
          '<th>' + ticket.ticketPrice + ' kn</th>' +
          '<th>' + "<button class='btn btn-danger' onclick='generatePDF(" + ticket.idOfTicket + ")'><i class='fas fa-print'></i></button></th>" +
          '<th>'+ "<button class='btn btn-danger' onclick='fillTicketForPrintAndShow(" + ticket.idOfTicket + ")'><i class='fas fa-id-card'></i></button></th>" +
        '</tr>'
      );
    });
    tbody.append(
      '<tr class="hiddenElement" id="noResultsTicket">' +
        '<td>Vasa pretraga nema rezultata.</td>' +
      '</tr>'
      )
  });
}

//Shows and fills the passangers table od specific ticket on button click.
function showTicketPasssangers(ticketId){
  var tbody = $('#ticketsPassangersTable tbody');
  var passangerTableContainer = $('#passangersOfSelectedTicket');
  var odabranaKarta = $('#odabranaKarta');
  odabranaKarta.text("Putnici odabrane karte: " + ticketId);
  passangerTableContainer.removeClass("visible");
  passangerTableContainer.addClass("hiddenElement");
  oDbTickets.on('value', function(sOdgovorPosluzitelja){
    tbody.empty();
    tickets.forEach(function(ticket){
      if(ticket.idOfTicket == ticketId)
      {
        passangerTableContainer.removeClass("hiddenElement");
        passangerTableContainer.addClass("visible");
        ticket.passangers.forEach(function(passanger){
          tbody.prepend(
            '<tr>' +
              '<th scope="row">' + passanger.passangerId + '</th>' +
              '<th>' + passanger.passangerFirstName + '</th>' +
              '<th>' + passanger.passangerLastname + '</th>' +
            '</tr>'
          )
        });
      }
    });
    tbody.append(
      '<tr class="hiddenElement" id="noResultsPassangers">' +
        '<td>Vasa pretraga nema rezultata.</td>' +
      '</tr>'
      )
  });
}

//Closes the passanger table.
function closePassangerTable(){
  var passangerTableContainer = $('#passangersOfSelectedTicket');
  passangerTableContainer.removeClass("visible");
  passangerTableContainer.addClass("hiddenElement");
}

//Live search on the ticket table.
function ticketSearch()
{
  $('#noResultsTicket').addClass("hiddenElement");
  $('#noResultsTicket').removeClass("visible");
  $("#searchTickets").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#ticketsTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      if($(this).text().toLowerCase().indexOf(value) > -1)
      {
        $(this).attr("data-id","visibleRow");
        $('#noResultsTicket').removeAttr("style");
      }else
      {
        $(this).removeAttr("data-id");
      }
      if($('#ticketsTable tbody tr[data-id="visibleRow"]').length == 0)
      {
        $('#noResultsTicket').attr("style", "display:block");
        $('#noResultsTicket td').attr("style", "border-top:0");
      }
    });
  });
}

//Live search on the passanger table.
function passangerSearch()
{
  $('#noResultsPassangers').addClass("hiddenElement");
  $('#noResultsPassangers').removeClass("visible");
  $("#searchPassangers").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#ticketsPassangersTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      if($(this).text().toLowerCase().indexOf(value) > -1)
      {
        $(this).attr("data-id","visibleRow");
        $('#noResultsPassangers').removeAttr("style");
      }else
      {
        $(this).removeAttr("data-id");
      }
      if($('#ticketsPassangersTable tbody tr[data-id="visibleRow"]').length == 0)
      {
        $('#noResultsPassangers').attr("style", "display:block");
        $('#noResultsPassangers td').attr("style", "border-top:0");
      }
    });
  });
}

//Discounts the price of the ticket for the given % amount.
function discountTicket(){
  var ticketDiscount = $("#ticketDiscount");
  var modalFullPrice = $("#modalFullPrice");
  var btnDiscount = $('#btnDiscount')
  var discount = ticketDiscount.val();
  if(discount == "")
  {
    setError("#ticketDiscount", "input");
    setErrorMessage("#ticketDiscountError", "Popust ne moze biti prazan!");
  }
  else if(discount <= 0)
  {
    setError("#ticketDiscount", "input");
    setErrorMessage("#ticketDiscountError", "Popust ne moze biti manji ili jednak 0!");
  }
  else if(discount > 99)
  {
    setError("#ticketDiscount", "input");
    setErrorMessage("#ticketDiscountError", "Popust ne moze biti veci od 99%!");
  }
  else
  {
    btnDiscount.addClass("disabled")
    btnDiscount.attr("disabled", true);
    ticketDiscount.addClass("disabled")
    ticketDiscount.attr("disabled", true);
    setSuccess("#ticketDiscount", "input");
    removeErrorMessage("#ticketDiscountError");
    var discountPercent = discount/100;
    var fullPrice = modalFullPrice.text().split(":");
    var priceToSubstract = fullPrice[1].split("k")[0] * discountPercent;
    var discountPrice = fullPrice[1].split("k")[0] - priceToSubstract;
    globalTicket.ticketPrice = Math.round((discountPrice + Number.EPSILON) * 100) / 100;
    modalFullPrice.text("Puna cijena (cijena za sve putnike): " + globalTicket.ticketPrice + " kn");
  }
}

//Fills the modal that shows all ticket info to the user.
function fillTicketForPrintAndShow(ticketId){
  var tbody = $('#pdfTicketsPassangersTable tbody')
  var pdfTicketId = $('#pdfTicketId')
  var pdfTicketPolaziste = $('#pdfTicketPolaziste')
  var pdfarrowForTicket = $('#pdfarrowForTicket')
  var pdfTicketOdrediste = $('#pdfTicketOdrediste')
  var pdfTicketType = $('#pdfTicketType')
  var pdfTicketClass = $('#pdfTicketClass')
  var pdfTicketStartDate = $('#pdfTicketStartDate')
  var pdfTicketEndDate = $('#pdfTicketEndDate')
  var pdfTicketExpiry = $('#pdfTicketExpiry')
  var pdfTicketPrice = $('#pdfTicketPrice')
  oDbTickets.on('value', function(sOdgovorPosluzitelja){
    tickets.forEach(function(ticket){
      if(ticket.idOfTicket == ticketId)
      {
        tbody.empty();
        pdfTicketId.text(ticket.idOfTicket);
        pdfTicketPolaziste.text("Polaziste: " + ticket.ticketDestination);
        pdfTicketOdrediste.text("Odrediste: " + ticket.ticketPointOfDeparture);
        if(ticket.ticketType == "Jednosmjerna karta")
        {
          pdfTicketType.text("Vrsta: Jednosmjerna");
          pdfarrowForTicket.addClass("fa-arrow-right");
          pdfarrowForTicket.removeClass("fa-arrows-alt-h");
        }
        else
        {
          pdfTicketType.text("Vrsta: Povratna");
          pdfarrowForTicket.removeClass("fa-arrow-right");
          pdfarrowForTicket.addClass("fa-arrows-alt-h");
        }
        pdfTicketClass.text("Razred: " + ticket.ticketClass);
        pdfTicketStartDate.text("Polazak: " + ticket.ticketStartDate);
        pdfTicketEndDate.text("Odlazak: " + ticket.ticketStartDate);
        pdfTicketExpiry.text("Istek valjanosti: " + ticket.ticketExpiry);
        pdfTicketPrice.text("Cijena: " + ticket.ticketPrice + " kn");
        ticket.passangers.forEach(function(passanger){
          tbody.prepend(
            '<tr>' +
              '<th scope="row">' + passanger.passangerId + '</th>' +
              '<th>' + passanger.passangerFirstName + '</th>' +
              '<th>' + passanger.passangerLastname + '</th>' +
            '</tr>'
          )
        });
      }
    });
  });
  $('#modalTicketToPdf').modal('show');
}

//Generates a pdf with the ticket ready to be printed.
function generatePDF(ticketId){
  fillTicketForPrintAndShow(ticketId);
  var pdfTicketId = $('#pdfTicketId')
  html2canvas($('#modalTicketToPdf'), {
    useCORS: true,
    allowTaint: true,
    scrollY: -window.scrollY,
  }).then(canvas => {
    const image = canvas.toDataURL('image/png');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio;
    const canvasHeight = canvas.height * ratio;

    const marginX = (pageWidth - canvasWidth) / 2;
    const marginY = (pageHeight - canvasHeight) / 2;

    doc.addImage(image, 'PNG', marginX, marginY, canvasWidth, canvasHeight);
    doc.setDisplayMode(5, "single", "UseOutlines");
    doc.save('ticket' + pdfTicketId.text() + '.pdf');
  });
  $('#modalTicketToPdf').modal('hide');
}

//Site loader so we can fill the tables from the DB in the background
function siteLoader(){
  var counter = 0;
  // Start the changing images
  setInterval(function() {
    if(counter == 2) { 
      counter = 0; 
    }
    changeImage(counter);
    counter++;
  }, 3000);
  // Set the percentage off
  loading();
}

//Changes images that rotate.
function changeImage(counter) {
  var images = [
    '<i class="fas fa-ticket-alt text-danger"></i>',
    '<i class="fas fa-train text-danger"></i>',
  ];
  $(".loader .image").html(""+ images[counter] +"");
}

//Incements the counter and shows the content when finished.
function loading(){
  var num = 0;
  for(i=0; i<=100; i++) {
    setTimeout(function() { 
      $('.loader span').html(num+'%');
      if($('.image i').hasClass("fa-codepen"))
      {
        $('.image i').removeClass("fa")
        $('.image i').removeClass("fa-codepen")
        $('.image i').addClass("fas fa-train text-danger");
      }
      if(num == 100) {
        $('.body-content').removeClass("hiddenElement");
        $('.body-content').addClass("visible");
        $('.loader').removeClass("visible");
        $('.loader').addClass("hiddenElement");
      }
      num++;
    },i*30);
  };
}