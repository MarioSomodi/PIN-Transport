// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = 
{
	apiKey: "AIzaSyCLSN1-GPh3q66X2dM_PX2orzk90qZIts8",
	authDomain: "pin-transport.firebaseapp.com",
	databaseURL: "https://pin-transport-default-rtdb.firebaseio.com",
	projectId: "pin-transport",
	storageBucket: "pin-transport.appspot.com",
	messagingSenderId: "519704559634",
	appId: "1:519704559634:web:7436b58c2f5339ab27d8cb",
	measurementId: "G-6715PQ7029"
};
// Initialize Firebase.
firebase.initializeApp(firebaseConfig);

//Get all ticket references.
var oDb = firebase.database();
var oDbCounties = oDb.ref('Counties/counties');
var oDbTickets = oDb.ref('Tickets/tickets');

//Arrays filled with objects from firebase.
var counties = [];
var cities = [];
var tickets = [];
var ticketPassangers = [];

//Fill an array with all counties.
function GetAllCountiesAndCities(){
	oDbCounties.on('value', function(oOdgovorPosluzitelja){	
		counties = [];
		oOdgovorPosluzitelja.forEach(function(oCountySnapshot){
			var sCountyKey = oCountySnapshot.key;
			var oCounty = oCountySnapshot.val();
			var countyId = oCounty.countyId;
			var countyName = oCounty.countyName;
			var citiesFirebase = oCounty.cities;
			cities = [];
			citiesFirebase = Object.values(citiesFirebase);
			citiesFirebase.forEach(function(oCitySnapshot){
			var cityKey = oCitySnapshot.dbkey;
			var cityActiveOrInactive = oCitySnapshot.cityActiveOrInactive;
			var cityId = oCitySnapshot.cityId;
			var cityLatitude = oCitySnapshot.cityLatitude;
			var cityLongitude = oCitySnapshot.cityLongitude;
			var cityName = oCitySnapshot.cityName;
			var countySeat = oCitySnapshot.countySeat;
			const city = new City(cityActiveOrInactive, cityId, cityLatitude, cityLongitude, cityName, countySeat, cityKey);
			cityKey++;
			cities.push(city);
			});
			const county = new County(cities, countyId, countyName, sCountyKey);
			counties.push(county);
	  	});
	});
}

//Fill an array with all ticketss.
function GetAllTicketsAndPassangers()
{
	oDbTickets.on('value', function(sOdgovorPosluzitelja){
		tickets = [];
		sOdgovorPosluzitelja.forEach(function(oTicketSnapShot){
			var oTicketKey = oTicketSnapShot.key;
			var oTicket = oTicketSnapShot.val();
			var ticketId = oTicket.ticketId;
			var ticketType = oTicket.ticketType;
			var ticketPointOfDeparture = oTicket.ticketPointOfDeparture;
			var ticketDestination = oTicket.ticketDestination;
			var ticketStartDate = oTicket.ticketStartDate;
			var ticketEndDate = oTicket.ticketEndDate;
			var ticketExpiry = oTicket.ticketExpiry;
			var ticketClass = oTicket.ticketClass;
			var ticketPrice = oTicket.ticketPrice;
			var passangersFirebase = oTicket.passangers;
			ticketPassangers = [];
			passangersFirebase = Object.values(passangersFirebase);
			passangersFirebase.forEach(function(passangerSnapShot){
				var passangerKey = passangerSnapShot.dbKey;
				var passangerId = passangerSnapShot.passangerId;
				var passangerFirstName = passangerSnapShot.passangerFirstName;
				var passangerLastName = passangerSnapShot.passangerLastname;
				var passangerOIB = passangerSnapShot.passangersOIB;
				const passanger = new Passanger(passangerId, passangerFirstName, passangerLastName, passangerOIB, passangerKey);
				ticketPassangers.push(passanger);
			});
			const ticket = new Ticket(ticketId, ticketType, ticketPointOfDeparture, ticketDestination, ticketStartDate, ticketEndDate, ticketExpiry, ticketClass, ticketPrice, ticketPassangers, oTicketKey);
			tickets.push(ticket);
		});
	});
}