var loggedIn = false;

$(document).ready(function() {
    //Sites loader
    siteLoader();
    //Get all tickets their passangers, and all counties and their cities.
    GetAllCountiesAndCities();
    GetAllTicketsAndPassangers();
    //Animates some elements on the webpage.
    textAnimation();
    //Show back to top button when user scrolls past header.
    backToTop();
    //Fix the navbar to the top when user scrolls past the header.
    navBarStickToTop();
    //Fill ticket and passangers table
    fillTicketTable();
    //Fill counties and their cities.
    fillCountiesTable();
    //Search tickets
    ticketSearch();
    //Search tickets passangers
    passangerSearch();
    //Search counties
    countiesSearch();
    //Search cities of counties
    citiesSearch();
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

//Animate text
function textAnimation(){
    var typed = new Typed("#element3", {
        strings:["arte i putnici"],
        typeSpeed:100,
        backSpeed:100,
        cursorChar: '_',
        smartBackspace:false,
        loop:true,
        loopCount:Infinity
    });

    var typed = new Typed("#element4", {
        strings:["upanije i gradovi"],
        typeSpeed:100,
        backSpeed:100,
        cursorChar: '_',
        smartBackspace:false,
        loop:true,
        loopCount:Infinity
    });
}

//Adds the red shadow to incorrently submitted form elements.
function setError(dataId){
    var selector = dataId;
    $(selector).removeClass("success");
    $(selector).addClass("error");
}
  
//Adds the green shadow for correctly submitted form elements.
function setSuccess(dataId){
    var selector = dataId;
    $(selector).addClass("success");
    $(selector).removeClass("error");
}
  
//Adds the error message under the incorretly submitted form element.
function setErrorMessage(idOfErrorFiled, message){
    var selector = $(idOfErrorFiled);
    selector.text(message);
    selector.addClass("visible");
    selector.removeClass("hiddenElement");
}
  
//Removes the error message under the incorretly submitted form element.
function removeErrorMessage(idOfErrorFiled){  
    var selector = $(idOfErrorFiled);
    selector.addClass("hiddenElement");
    selector.removeClass("visible");
}
  
//Removes error shadow, succes shadow or both from the form element.
function removeSuccesOrError(dataId, type)
{
    var selector = dataId;
    if(type == "success")
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

//Sign into administration
function signIn()
{
    var signInModal = $('#modalSignIn');
    var signInButton = $('#signInButton');
    var userEmailError = $('#userEmailError')
    var userPasswordError = $('#userPasswordError')
    removeErrorMessage("#userEmailError");
    removeErrorMessage("#userPasswordError");
    signInModal.modal({
        backdrop: 'static',
        keyboard: false
      });
    setModalBackdrop();
    $('body').removeAttr("style");
    signInButton.click(function(e) {
        e.stopImmediatePropagation();
        var email = $('#userEmail').val();
        var password = $('#userPassword').val();
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            $('#succesLogIn').addClass("visible");
            $('#succesLogIn').removeClass("hiddenElement");
            removeErrorMessage("#userPasswordError");
            setSuccess("#userPassword");
            removeErrorMessage("#userEmailError");
            setSuccess("#userEmail");
            setTimeout(function (){
                signInModal.modal('hide');
            }, 1000);
            loggedIn = true;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if(email == "")
            {
                setError("#userEmail");
                setErrorMessage("#userEmailError", "Email ne moze biti prazan!")
            }
            else
            {
                if(error)
                setError("#userEmail");
                setErrorMessage("#userEmailError", errorMessage)
            }
            if(password == "")
            {
                setError("#userPassword");
                setErrorMessage("#userPasswordError", "Lozinka ne moze biti prazna!")
            }
            else
            {
                setError("#userPassword");
                setErrorMessage("#userPasswordError", errorMessage)
            }
        });
    });
    $('#forgotPasswordButton').click(function(){
        var auth = firebase.auth();
        var email = $('#userEmail').val();
        if (email != '') {
          auth.sendPasswordResetEmail(email).then(function(){
            setSuccess("#userEmail");
            setErrorMessage("#userEmailError", "Link za povrat lozinke je poslan na Vaš email!");
          })
          .catch(function(error){
            var errorMessage = error.message;
            setError("#userEmail");
            setErrorMessage("#userEmailError", errorMessage)
          });
        }else{
            setError("#userEmail");
            setErrorMessage("#userEmailError", "Molim prvo unesite vas email!")
        }
      
      });
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
            '<th>' + "<button class='btn btn-danger' onclick='deleteTicket(" + ticket.idOfTicket + ")'><i class='far fa-trash-alt'></i></button></th>" +
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
                '<th>' + "<button class='btn btn-danger' onclick='updatePassanger(" + passanger.passangerId + ',' + ticketId + ")'><i class='fas fa-pencil-alt'></i></button></th>" +
                '<th>' + "<button class='btn btn-danger' onclick='deletePassanger(" + passanger.passangerId + ',' + ticketId + ")'><i class='far fa-trash-alt'></i></button></th>" +
                '</tr>'
            )
            });
            tbody.append(
                '<tr class="hiddenElement" id="noResultsPassangers">' +
                  '<td>Vasa pretraga nema rezultata.</td>' +
                '</tr>'
                )
        }
        });
    });
}
  
//Closes the passanger table.
function closePassangerTable(){
    var passangerTableContainer = $('#passangersOfSelectedTicket');
    passangerTableContainer.removeClass("visible");
    passangerTableContainer.addClass("hiddenElement");
}

//Fills the counties table with all counties from DB.
function fillCountiesTable(){
    var tbody = $('#showCountiesTable tbody');
    oDbCounties.on('value', function(sOdgovorPosluzitelja){
        tbody.empty();
        counties.forEach(function(county){
        tbody.append(
            '<tr>' +
            '<th scope="row">' + county.countyId + '</th>' +
            '<th>' + county.countyName + '</th>' +
            '<th>' + "<button class='btn btn-danger' onclick='showCountyCities(" + county.countyId + ")'>" + county.numOfCities + "</button>" + "</th>" +
            '<th>' + "<button class='btn btn-danger' onclick='updateCounty(" + county.countyId + ")'><i class='fas fa-pencil-alt'></i></button></th>" +
            '<th>' + "<button class='btn btn-danger' onclick='deleteCounty(" + county.countyId + ")'><i class='far fa-trash-alt'></i></button></th>" +
            '</tr>'
        );
        });
        tbody.append(
            '<tr class="hiddenElement" id="noResultsCounty">' +
              '<td>Vasa pretraga nema rezultata.</td>' +
            '</tr>'
            )
    });
}

//Shows a table with the cities of a selected county.
function showCountyCities(countyId){
    var tbody = $('#countiesCitiesTable tbody');
    var citiesOfSelectedCounty = $('#citiesOfSelectedCounty');
    var odabranaZupanija = $('#odabranaZupanija');
    citiesOfSelectedCounty.removeClass("visible");
    citiesOfSelectedCounty.addClass("hiddenElement");
    oDbCounties.on('value', function(sOdgovorPosluzitelja){
        tbody.empty();
        counties.forEach(function(county){
        if(county.countyId == countyId)
        {
            odabranaZupanija.text("Putnici odabrane zupanije: " + county.countyName);
            citiesOfSelectedCounty.removeClass("hiddenElement");
            citiesOfSelectedCounty.addClass("visible");
            county.cities.forEach(function(city){
            tbody.append(
                '<tr>' +
                '<th scope="row">' + city.cityId + '</th>' +
                '<th>' + city.cityName + '</th>' +
                '<th>' + city.cityLatitude + '</th>' +
                '<th>' + city.cityLongitude + '</th>' +
                '<th>' +
                '<button class="btn btn-danger form-control" onclick="changeActiveState('+ city.cityId +')" id="' + city.cityId + '">' +
                    'Aktivan' +
                '</button>' +
                '</th>' +
                '<th>' + "<button class='btn btn-danger' onclick='updateCity(" + city.cityId + ',' + countyId + ")'><i class='fas fa-pencil-alt'></i></button></th>" +
                '<th>' + "<button class='btn btn-danger' onclick='deleteCity(" + city.cityId + ',' + countyId + ")'><i class='far fa-trash-alt'></i></button></th>" +
                '</tr>'
            )
            if(city.cityActiveOrInactive)
            {
                $("button#" + city.cityId).text("Aktivan");
            }
            else
            {
                $("button#" + city.cityId).text("Neaktivan");
            }
            });
            tbody.append(
                '<tr class="hiddenElement" id="noResultsCity">' +
                  '<td>Vasa pretraga nema rezultata.</td>' +
                '</tr>'
                )
        }
        });
    });
}

//Closes the cities table.
function closeCitiesTable(){
    var citiesOfSelectedCounty = $('#citiesOfSelectedCounty');
    citiesOfSelectedCounty.removeClass("visible");
    citiesOfSelectedCounty.addClass("hiddenElement");
}

//Deletes a selected county from DB.
function deleteCounty(countyId)
{
    if(loggedIn)
    {
        counties.forEach(function(county){
            if(county.countyId == countyId)
            {
                $('#modalAction').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                var actionMessage = $('#action');
                var actionAccept = $('#actionAccept');
                actionAccept.removeClass("disabled");
                actionAccept.removeAttr("disabled", true);
                actionAccept.attr("onclick", 'confirmDeleteCounty("' + county.dbKey + '")');
                var actionDecline = $('#actionDecline');
                actionMessage.text("Jeste li sigurni da zelite izbrisati ovu zupaniju? Svi njeni gradovi ce biti izbrisani takoder!");
                actionDecline.click(function(e) {
                    e.stopImmediatePropagation();
                    $('#modalAction').modal('hide');
                });
            }
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

function secretFunction()
{
    window.location.reload();
}

//Brings up a modal to confirm the delete of county.
function confirmDeleteCounty(dbKey){
    var actionAccept = $('#actionAccept');
    actionAccept.addClass("disabled");
    actionAccept.attr("disabled", true);
    closeCitiesTable();
    oDbCounties.child(dbKey).remove();
    setTimeout(function (){
        $('#modalAction').modal('hide');
    }, 1000);
}

//Deletes the selected city from DB.
function deleteCity(cityId, countyId){
    if(loggedIn)
    {
        counties.forEach(function(county){
            if(county.countyId == countyId)
            {
                county.cities.forEach(function(city){
                    if(city.cityId == cityId)
                    {
                        $('#modalAction').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        var actionMessage = $('#action');
                        var actionAccept = $('#actionAccept');
                        actionAccept.removeClass("disabled");
                        actionAccept.removeAttr("disabled", true);
                        actionAccept.attr("onclick", 'confirmDeleteCity("' + county.dbKey + '","' + city.dbKey + '","' + county.numOfCities + '")');
                        var actionDecline = $('#actionDecline');
                        if(county.numOfCities == 1)
                        {
                            actionMessage.text("Jeste li sigurni da zelite izbrisati ovaj grad? Posto je ovo jedini grad u ovoj zupaniji biti ce i zupanija izbrisana!");
                        }
                        else
                        {
                            actionMessage.text("Jeste li sigurni da zelite izbrisati ovaj grad?");
                        }
                        actionDecline.click(function(e) {
                            e.stopImmediatePropagation();
                            $('#modalAction').modal('hide');
                        });
                    }
                });
            }
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

//Brings up a modal to confirm the delete of the city.
function confirmDeleteCity(countyDBKey, cityDBKey, citiesNum)
{
    var actionAccept = $('#actionAccept');
    actionAccept.addClass("disabled");
    actionAccept.attr("disabled", true);
    if(citiesNum == 1)
    {
        confirmDeleteCounty(countyDBKey);
        closeCitiesTable();
        setTimeout(function (){
            $('#modalAction').modal('hide');
        }, 1000);
    }
    else
    {
        var citiesRef = oDb.ref("Counties/counties/" + countyDBKey + "/cities");
        citiesRef.child(cityDBKey).remove();
        setTimeout(function (){
            $('#modalAction').modal('hide');
        }, 1000);
    }
}

//Deletes the selected ticket from DB.
function deleteTicket(ticketId)
{
    if(loggedIn)
    {
        tickets.forEach(function(ticket){
            if(ticket.idOfTicket == ticketId)
            {
                $('#modalAction').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                var actionMessage = $('#action');
                var actionAccept = $('#actionAccept');
                actionAccept.removeClass("disabled");
                actionAccept.removeAttr("disabled", true);
                actionAccept.attr("onclick", 'confirmDeleteTicket("' + ticket.dbKey + '")');
                var actionDecline = $('#actionDecline');
                actionMessage.text("Jeste li sigurni da zelite izbrisati ovu kartu? Svi njeni putnici ce biti izbrisani takoder!");
                actionDecline.click(function(e) {
                    e.stopImmediatePropagation();
                    $('#modalAction').modal('hide');
                });
            }
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

//Brings up a modal to confirm the delete of selected ticket.
function confirmDeleteTicket(dbKey)
{
    var actionAccept = $('#actionAccept');
    actionAccept.addClass("disabled");
    actionAccept.attr("disabled", true);
    closePassangerTable();
    oDbTickets.child(dbKey).remove();
    setTimeout(function (){
        $('#modalAction').modal('hide');
    }, 1000);
}

//Sets the modal backdrop for the sign in modal see the site content is not visible before login.
function setModalBackdrop()
{
    $('.modal-backdrop').attr("style", "opacity: 1 !important ")
}

//Deletes a selected passanger of the selected ticket.
function deletePassanger(passangerId, ticketId)
{
    if(loggedIn)
    {
        tickets.forEach(function(ticket){
            if(ticket.idOfTicket == ticketId)
            {
                ticket.passangers.forEach(function(passanger){
                    if(passanger.passangerId == passangerId)
                    {
                        $('#modalAction').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        var actionMessage = $('#action');
                        var actionAccept = $('#actionAccept');
                        actionAccept.removeClass("disabled");
                        actionAccept.removeAttr("disabled", true);
                        actionAccept.attr("onclick", 'confirmDeletePassanger("' + ticket.dbKey + '","' + passanger.dbKey + '","' + ticket.passangerNum + '")');
                        var actionDecline = $('#actionDecline');
                        if(ticket.passangerNum == 1)
                        {
                            actionMessage.text("Jeste li sigurni da zelite izbrisati ovoga putnika? Posto je ovo jedini putnik ove karte biti ce i karta izbrisana!");
                        }
                        else
                        {
                            actionMessage.text("Jeste li sigurni da zelite izbrisati ovoga putnika?");
                        }
                        actionDecline.click(function(e) {
                            e.stopImmediatePropagation();
                            $('#modalAction').modal('hide');
                        });
                    }
                });
            }
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

//Brings up a modal to confirm the deletetion of the selected passanger.
function confirmDeletePassanger(ticketDBKey, passangerDBKey, passangerNum)
{
    var actionAccept = $('#actionAccept');
    actionAccept.addClass("disabled");
    actionAccept.attr("disabled", true);
    if(passangerNum == 1)
    {
        confirmDeleteTicket(ticketDBKey);
        closePassangerTable();
        setTimeout(function (){
            $('#modalAction').modal('hide');
        }, 1000);
    }
    else
    {
        var passangerRef = oDb.ref("Tickets/tickets/" + ticketDBKey + "/passangers");
        passangerRef.child(passangerDBKey).remove();
        setTimeout(function (){
            $('#modalAction').modal('hide');
        }, 1000);
    }
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

//Live search on the counties table.
function countiesSearch()
{
  $('#noResultsCounty').addClass("hiddenElement");
  $('#noResultsCounty').removeClass("visible");
  $("#searchCounties").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#showCountiesTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      if($(this).text().toLowerCase().indexOf(value) > -1)
      {
        $(this).attr("data-id","visibleRow");
        $('#noResultsCounty').removeAttr("style");
      }else
      {
        $(this).removeAttr("data-id");
      }
      if($('#showCountiesTable tbody tr[data-id="visibleRow"]').length == 0)
      {
        $('#noResultsCounty').attr("style", "display:block");
        $('#noResultsCounty td').attr("style", "border-top:0");
      }
    });
  });
}

//Live search on the cities table.
function citiesSearch()
{
  $('#noResultsCity').addClass("hiddenElement");
  $('#noResultsCity').removeClass("visible");
  $("#searchCities").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#countiesCitiesTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      if($(this).text().toLowerCase().indexOf(value) > -1)
      {
        $(this).attr("data-id","visibleRow");
        $('#noResultsCity').removeAttr("style");
      }else
      {
        $(this).removeAttr("data-id");
      }
      if($('#countiesCitiesTable tbody tr[data-id="visibleRow"]').length == 0)
      {
        $('#noResultsCity').attr("style", "display:block");
        $('#noResultsCity td').attr("style", "border-top:0");
      }
    });
  });
}

//Update county name in the DB.
function updateCounty(countyId){
    if(loggedIn)
    {
        $('#succesMessageUpdate').removeClass('visible');
        $('#succesMessageUpdate').addClass('hiddenElement');
        removeErrorMessage("#newCountyNameError");
        removeSuccesOrError('#newCountyName', "both");
        var newCountyName = $('#newCountyName');
        newCountyName.val("");
        var updateCountyYes = $('#updateCountyYes');
        updateCountyYes.removeAttr("disabled");
        updateCountyYes.removeClass("disabled");
        var updateCountyNo = $('#updateCountyNo');
        updateCountyYes.attr("onclick", "confirmUpdateCountry(" + countyId + ")");
        counties.forEach(function(county){
            if(county.countyId == countyId)
            {
                $('#newCountyName').val(county.countyName);
                var updateCountyTitle = $('#updateCountyTitle');
                updateCountyTitle.text("Azuriraj zupaniju: " + county.countyName);
            }
        });
        $('#modalUpdateCounty').modal('show');
        updateCountyNo.click(function(e) {
            e.stopImmediatePropagation();
            $('#modalUpdateCounty').modal('hide');
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

//Brings up a modal to confirm the update of county name.
function confirmUpdateCountry(countyId){
    var newCountyName = $('#newCountyName');
    var updateCountyYes = $('#updateCountyYes');
    counties.forEach(county => {
        if(county.countyId == countyId){
            if(newCountyName.val() == "")
            {
                setError("#newCountyName");
                setErrorMessage("#newCountyNameError", "Morate unjeti novi naziv drzave!");
            }
            else if(newCountyName.val().length < 2)
            {
              setErrorMessage("#newCountyNameError", "Naziv zupanije ne moze biti manji od 2 slova!");
              setError("#newCountyName");
            }
            else if(/\d/.test(newCountyName.val()))
            {
                setErrorMessage("#newCountyNameError", "Naziv zupanije ne moze sadrzavati broj!");
                setError("#newCountyName");
            }
            else if(newCountyName.val()[0] != newCountyName.val()[0].toUpperCase())
            {
                setError("#newCountyName");
                setErrorMessage("#newCountyNameError", "Naziv drzave ne moze poceti sa malim slovom!");
            }
            else{
                updateCountyYes.attr("disabled", true);
                updateCountyYes.addClass("disabled");
                setSuccess("#newCountyName");
                removeErrorMessage("#newCountyNameError");
                oDbCounties.child(county.dbKey).update({
                    countyName : newCountyName.val()
                });
                $('#succesMessageUpdate').removeClass('hiddenElement');
                $('#succesMessageUpdate').addClass('visible');
                setTimeout(function(){
                    $('#modalUpdateCounty').modal('hide');
                }, 2000)
            }
        }
    });
}

//Update city name, lat and long in the DB.
function updateCity(cityId, countyId){
    if(loggedIn)
    {
        $('#succesMessageUpdateCity').removeClass('visible');
        $('#succesMessageUpdateCity').addClass('hiddenElement');
        removeErrorMessage("#newCityNameError");
        removeErrorMessage("#newCityLatNameError");
        removeErrorMessage("#newCityLongNameError");
        removeSuccesOrError('#newCityName', "both");
        removeSuccesOrError('#newCityLatName', "both");
        removeSuccesOrError('#newCityLongName', "both");
        var newCityName = $('#newCityName');
        var newCityLatName = $('#newCityLatName');
        var newCityLongName = $('#newCityLongName');
        newCityName.val("");
        newCityLatName.val("");
        newCityLongName.val("");
        var updateCityYes = $('#updateCityYes');
        updateCityYes.removeAttr("disabled");
        updateCityYes.removeClass("disabled");
        var updateCityNo = $('#updateCityNo');
        updateCityYes.attr("onclick", "confirmUpdateCity(" + cityId + "," + countyId + ")");
        counties.forEach(function(county){
            if(county.countyId == countyId)
            {
                county.cities.forEach(function(city){
                    if(city.cityId == cityId)
                    {
                        $('#newCityName').val(city.cityName);
                        $('#newCityLatName').val(city.cityLatitude);
                        $('#newCityLongName').val(city.cityLongitude);
                        var updateCityTitle = $('#updateCityTitle');
                        updateCityTitle.text("Azuriraj grad: " + city.cityName);
                    }
                });
            }
        });
        $('#modalUpdateCity').modal('show');
        updateCityNo.click(function(e) {
            e.stopImmediatePropagation();
            $('#modalUpdateCity').modal('hide');
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

//Brings up a modal to confirm the update of city name and its long, lat.
function confirmUpdateCity(cityId, countyId){
    var newCityName = $('#newCityName');
    var newCityLatName = $('#newCityLatName');
    var newCityLongName = $('#newCityLongName');
    var updateCityYes = $('#updateCityYes');
    var validacija = "";
    counties.forEach(function(county){
        if(county.countyId == countyId)
        {
            county.cities.forEach(function(city){
                if(city.cityId == cityId)
                {
                    if(newCityName.val() == "")
                    {
                        setError("#newCityName");
                        setErrorMessage("#newCityNameError", "Morate unjeti novi naziv drzave!");
                    }
                    else if(newCityName.val().length < 2)
                    {
                    setErrorMessage("#newCityNameError", "Naziv zupanije ne moze biti manji od 2 slova!");
                    setError("#newCityName");
                    }
                    else if(/\d/.test(newCityName.val()))
                    {
                        setErrorMessage("#newCityNameError", "Naziv zupanije ne moze sadrzavati broj!");
                        setError("#newCityName");
                    }
                    else if(newCityName.val()[0] != newCityName.val()[0].toUpperCase())
                    {
                        setError("#newCityName");
                        setErrorMessage("#newCityNameError", "Naziv drzave ne moze poceti sa malim slovom!");
                    }
                    else{
                        setSuccess("#newCityName");
                        removeErrorMessage("#newCityNameError");
                        validacija += "1";
                    }
                    if(newCityLatName.val() == "")
                    {
                        setError("#newCityLatName");
                        setErrorMessage("#newCityLatNameError", "Morate unjeti novu latitudu grada!");
                    }
                    else
                    {
                        setSuccess("#newCityLatName");
                        removeErrorMessage("#newCityLatNameError");
                        validacija += "2";
                    }
                    if(newCityLongName.val() == "")
                    {
                        setError("#newCityLongName");
                        setErrorMessage("#newCityLongNameError", "Morate unjeti novu longitudu grada!");
                    }
                    else
                    {
                        setSuccess("#newCityLongName");
                        removeErrorMessage("#newCityLongNameError");
                        validacija += "3";
                    }
                    if(validacija == "123")
                    {
                        updateCityYes.attr("disabled", true);
                        updateCityYes.addClass("disabled");
                        var oDbCities = oDb.ref("Counties/counties/" + county.dbKey + "/cities")
                        oDbCities.child(city.dbKey).update({
                            cityName : newCityName.val(),
                            cityLatitude : newCityLatName.val(),
                            cityLongitude : newCityLongName.val()
                        });
                        $('#succesMessageUpdateCity').removeClass('hiddenElement');
                        $('#succesMessageUpdateCity').addClass('visible');
                        setTimeout(function(){
                            $('#modalUpdateCity').modal('hide');
                        }, 2000)
                    }
                }
            });
        }
    });
}

//Update passanger first and last name in DB.
function updatePassanger(passangerId, ticketId){
    if(loggedIn)
    {
        $('#succesMessageUpdatePassanger').removeClass('visible');
        $('#succesMessageUpdatePassanger').addClass('hiddenElement');
        removeErrorMessage("#newPassangerNameError");
        removeErrorMessage("#newPassangerLastnameError");
        removeSuccesOrError('#newPassangerName', "both");
        removeSuccesOrError('#newPassangerLastname', "both");
        var newPassangerName = $('#newPassangerName');
        var newPassangerLastname = $('#newPassangerLastname');
        newPassangerName.val("");
        newPassangerLastname.val("");
        var updatePassangerYes = $('#updatePassangerYes');
        updatePassangerYes.removeAttr("disabled");
        updatePassangerYes.removeClass("disabled");
        var updatePassangerNo = $('#updatePassangerNo');
        updatePassangerYes.attr("onclick", "confirmUpdatePassanger(" + passangerId + "," + ticketId +")");
        tickets.forEach(function(ticket){
            if(ticket.idOfTicket == ticketId)
            {
                ticket.passangers.forEach(function(passanger){
                    if(passanger.passangerId == passangerId)
                    {
                        $('#newPassangerName').val(passanger.passangerFirstName);   
                        $('#newPassangerLastname').val(passanger.passangerLastname);   
                        var updateTicketPassangerTitle = $('#updateTicketPassangerTitle');
                        updateTicketPassangerTitle.text("Azuriraj putnika: " + passanger.passangerId);
                    }
                });
            }
        });
        $('#modalUpdateTicketPassanger').modal('show');
        updatePassangerNo.click(function(e) {
            e.stopImmediatePropagation();
            $('#modalUpdateTicketPassanger').modal('hide');
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
}

//Brings up a modal to confirm the update of passanger first and last name.
function confirmUpdatePassanger(passangerId, ticketId){
    var newPassangerName = $('#newPassangerName');
    var newPassangerLastname = $('#newPassangerLastname');
    var updatePassangerYes = $('#updatePassangerYes');
    var validacija = "";
    tickets.forEach(function(ticket){
        if(ticket.idOfTicket == ticketId)
        {
            ticket.passangers.forEach(function(passanger){
                if(passanger.passangerId == passangerId)
                {
                    if(newPassangerName.val() == "")
                    {
                        setErrorMessage("#newPassangerNameError", "Ime putnika ne moze biti prazno!");
                        setError("#newPassangerName");
                    }
                    else if(newPassangerName.val().length < 2)
                    {
                        setErrorMessage("#newPassangerNameError", "Ime putnika ne moze biti manje od 2 slova!");
                        setError("#newPassangerName");
                    }
                    else if(newPassangerName.val().length > 32)
                    {
                        setErrorMessage("#newPassangerNameError", "Ime putnika ne moze biti dulje od 32 slova!");
                        setError("#newPassangerName");
                    }
                    else if(/\d/.test(newPassangerName.val()))
                    {
                        setErrorMessage("#newPassangerNameError", "Ime putnika ne moze sadrzavati broj!");
                        setError("#newPassangerName");
                    }
                    else if(newPassangerName.val()[0] != newPassangerName.val()[0].toUpperCase())
                    {
                        setErrorMessage("#newPassangerNameError", "Ime putnika ne moze poceti sa malim slovom!");
                        setError("#newPassangerName");
                    }
                    else
                    {
                        removeErrorMessage("#newPassangerNameError");
                        setSuccess("#newPassangerName");
                        validacija = validacija + "1";
                    }
                    //
                    //Validation of last name.
                    //
                    if(newPassangerLastname.val() == "")
                    {
                        setErrorMessage("#newPassangerLastnameError", "Prezime putnika ne moze biti prazno!");
                        setError("#newPassangerLastname");
                    }
                    else if(newPassangerLastname.val().length < 2)
                    {
                        setErrorMessage("#newPassangerLastnameError", "Prezime putnika ne moze biti manje od 2 slova!");
                        setError("#newPassangerLastname");
                    }
                    else if(newPassangerLastname.val().length > 25)
                    {
                        setErrorMessage("#newPassangerLastnameError", "Prezime putnika ne moze biti dulje od 25 slova!");
                        setError("#newPassangerLastname");
                    }
                    else if(/\d/.test(newPassangerLastname.val()))
                    {
                        setErrorMessage("#newPassangerLastnameError", "Prezime putnika ne moze sadrzavati broj!");
                        setError("#newPassangerLastname");
                    }
                    else if(newPassangerLastname.val()[0] != newPassangerLastname.val()[0].toUpperCase())
                    {
                        setErrorMessage("#newPassangerLastnameError", "Prezime putnika ne moze poceti sa malim slovom!");
                        setError("#newPassangerLastname");
                    }
                    else
                    {
                        removeErrorMessage("#newPassangerLastnameError");
                        setSuccess("#newPassangerLastname");
                        validacija = validacija + "2";
                    }
                    if(validacija == "12")
                    {
                        updatePassangerYes.attr("disabled", true);
                        updatePassangerYes.addClass("disabled");
                        var oDbPassangers = oDb.ref("Tickets/tickets/" + ticket.dbKey + "/passangers")
                        oDbPassangers.child(passanger.dbKey).update({
                            passangerFirstName : newPassangerName.val(),
                            passangerLastname : newPassangerLastname.val()
                        });
                        $('#succesMessageUpdatePassanger').removeClass('hiddenElement');
                        $('#succesMessageUpdatePassanger').addClass('visible');
                        setTimeout(function(){
                            $('#modalUpdateTicketPassanger').modal('hide');
                        }, 2000)
                    }
                }
            });
        }
    });
}

//Changes the active state of the selected city.
function changeActiveState(cityId){
    if(loggedIn)
    {
        var button = $('button#' + cityId);
        counties.forEach(function(county){
            county.cities.forEach(function(city){
                if(city.cityId == cityId)
                {
                    var oDbCities = oDb.ref("Counties/counties/" + county.dbKey + "/cities")
                    if(city.cityActiveOrInactive)
                    {
                        button.text("Neaktivan");
                        oDbCities.child(city.dbKey).update({
                            cityActiveOrInactive: false
                        });
                    }
                    else
                    {
                        button.text("Aktivan");
                        oDbCities.child(city.dbKey).update({
                            cityActiveOrInactive: true
                        });
                    }
                }
            });
        });
    }
    else
    {
        $('.secret-title').text("Stvarno??")
        $('#SecretAction').text("Mislili ste da ce vam ovo uspijeti?!")
        $('#secret').modal({
            backdrop: 'static',
            keyboard: false
        });
        console.log("==============Huligan jedan!!==============")
    }
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

//Incements the counter and shows the login when finished.
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
            //Sign in
            signIn();
        }
        num++;
        },i*30);
    };
}