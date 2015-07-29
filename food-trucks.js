Trucks = new Mongo.Collection("trucks");

if (Meteor.isClient) {
  // This code only runs on the client
  var myLat;
  var myLon;
  function getLocation(){
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else{
      alert("Geolocation is needed for this app to work");
    }
  }
  function showPosition(position)
  {
    myLat = position.coords.latitude;
    myLon = position.coords.longitude;
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
  Template.marker.onRendered(function(){
    addMarkers();
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
