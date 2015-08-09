Trucks = new Mongo.Collection("trucks");

if (Meteor.isClient) {
  // This code only runs on the client

  Template.map.rendered = function() {
    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      map = L.map('map', {doubleClickZoom: false}).setView([44.9778, -93.2650], 12);
      setMap();
    }

    function showPosition(position) {
      map = L.map('map', {doubleClickZoom: false}).setView([position.coords.latitude, position.coords.longitude], 16);
      setMap()
    }

    function setMap(){
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      map.on('dblclick', function(event) {
        document.getElementById("lat").value = event.latlng.lat;
        document.getElementById("long").value = event.latlng.lng;
      });
    }
  }

  Template.body.helpers({
    trucks: function () {
      return Trucks.find({createdAt: new Date().toDateString()}, {
        limit: 2,
        sort: {createdAt: -1}
      });
    },
    markers: function () {
      return Trucks.find({createdAt: new Date().toDateString()}, {
        limit: 2,
        sort: {createdAt: -1}
      });
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

      Trucks.insert({
        name: name,
        type: type,
        start: startTime,
        end: endTime,
        lat: lat,
        long: long,
        createdAt: new Date().toDateString() // current time

      });

      // Clear form
      event.target.name.value = "";
      event.target.type.value = "";
      event.target.startTime.value = "";
      event.target.endTime.value = "";

      // Prevent default form submit
      return false;
    }
  });
}
