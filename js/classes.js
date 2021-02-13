class County{
    constructor(cities, countyId, countyName, dbKey){
        this.cities = cities;
        this.countyId = countyId;
        this.countyName = countyName;
        this.numOfCities = cities.length;
        this.dbKey = dbKey;
    }
}

class City{
    constructor(cityActiveOrInactive, cityId, cityLatitude, cityLongitude, cityName, countySeat, dbKey){
        this.cityActiveOrInactive = cityActiveOrInactive;
        this.cityId = cityId;
        this.cityLatitude = cityLatitude;
        this.cityLongitude = cityLongitude;
        this.cityName = cityName;
        this.countySeat = countySeat;
        this.dbKey = dbKey;
    }
}
  
class Ticket{
    constructor(idOfTicket, ticketType, ticketPointOfDeparture, ticketDestination, ticketStartDate, ticketEndDate, ticketExpiry, ticketClass, ticketPrice, passangers, dbKey){
        this.idOfTicket = idOfTicket;
        this.ticketType = ticketType;
        this.ticketPointOfDeparture = ticketPointOfDeparture;
        this.ticketDestination = ticketDestination;
        this.ticketStartDate = ticketStartDate;
        this.ticketEndDate = ticketEndDate;
        this.ticketExpiry = ticketExpiry;
        this.ticketClass = ticketClass;
        this.ticketPrice = ticketPrice;
        this.passangers = passangers;
        this.passangerNum = passangers.length;
        this.dbKey = dbKey;
    }
}

class Passanger{
    constructor(passangerId, passangerFirstName, passangerLastname, passangerOIB, dbKey){
        this.passangerId = passangerId;
        this.passangerFirstName = passangerFirstName;
        this.passangerLastname = passangerLastname;
        this.passangerOIB = passangerOIB;
        this.dbKey = dbKey;
    }
}