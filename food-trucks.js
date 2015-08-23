Trucks = new Mongo.Collection("trucks");

if (Meteor.isClient) {
  // This code only runs on the client
  var trucks = Trucks.find({}, {
    limit: 4,
    sort: {createdAt: -1}
  });

  //createdAt: new Date().toDateString()

  Template.map.rendered = function() {
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
      map = L.map('map', {doubleClickZoom: false}).setView([44.9778, -93.2650], 12);
      setMap();
    }

    function showPosition(position) {
      mapLat = position.coords.latitude;
      mapLong = position.coords.longitude;
      map = L.map('map', {doubleClickZoom: false}).setView([mapLat, mapLong], 16);
      setMap();
    }

    function setMap(){
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      map.on('dblclick', function(event) {
        document.getElementById("lat").value = event.latlng.lat;
        document.getElementById("long").value = event.latlng.lng;
      });

      var truckIcon = L.icon({
          iconUrl: '/marker-icon.png',
          //shadowUrl: 'marker-icon.png',

          iconSize:     [30, 43], // size of the icon
          iconAnchor:   [15, 42], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
      });

      trucks.forEach(function (truck) {
        marker = new L.marker([truck.lat,truck.long], {icon:truckIcon})
        .bindPopup("<b>"+truck.name+" - "+truck.type+"</b><br>"+truck.start.toString()+" - "+truck.end.toString())
        .addTo(map);
      });
    }
  }

  Template.body.helpers({
    trucks: function () {
      return trucks;
    }
  });

  Template.body.events({
    "submit #addNew": function (event) {
      var name = event.target.name.value;
      var type = event.target.type.value;
      var startTime = event.target.startTime.value;
      var endTime = event.target.endTime.value;
      var lat = parseFloat(event.target.lat.value);
      var long = parseFloat(event.target.long.value);

      Meteor.call("addTruck", name, type, startTime, endTime, lat, long);

      // Clear form
      event.target.name.value = "";
      event.target.type.value = "";
      event.target.startTime.value = "";
      event.target.endTime.value = "";

      // Prevent default form submit
      return false;
    },
    "click .distance": function (event) {
      console.log(distance(this.lat, this.long, mapLat, mapLong));
    }
  });
}

Meteor.methods({
  addTruck: function (name, type, startTime, endTime, lat, long) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Trucks.insert({
      name: name,
      type: type,
      start: startTime,
      end: endTime,
      lat: lat,
      long: long,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  }
});

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a =
     0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 +
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;

  return R * 2 * Math.asin(Math.sqrt(a));
}
