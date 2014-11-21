/*jshint node: true */
"use strict";

module.exports = function(city) {
    console.log("STARTING to NOTIFY city: " + city.cityName);

    var apn = require("apn");
    var certPath = __dirname + "/notifCerts/PlantAlertCert.pem";
    var keyPath = __dirname + "/notifCerts/PlantAlertKey.pem";

    var options = {
      "cert": certPath,
      "key": keyPath,
      "passphrase": "plantalert",
      "batchFeedback": true,
      "interval": 300
    };

    // SAVE FOR NOW PLEASE, feedback ~= to user unsub'd from notif's
    // var feedback = new apn.Feedback(options);
    // feedback.on("feedback", function(devices) {
    //     devices.forEach(function(item) {
    //         // Do something with item.device and item.time;
    //         // TODO: ? Remove the user from the city. ? or done in deleteUser?
    //     });
    // });

    var apnConnection = new apn.Connection(options);

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 0;
    note.sound = "ping.aiff";
    note.alert = "Your garden may be in danger!" + \n + "On the night of " + city.date + " the temperature in " + city.cityName + " may be as low as " + city.temp + " degrees fahrenheit. Do what you need to so your plants don't die.";
    note.payload = {
      "alertTitle": "Plant Alert Notification"
    };

    // For each user in city, get deviceToken, and push them our notif !
    for (var i = 0, len = city.users.length; i < len; i++) {
      var deviceToken = city.users[i];
      console.log("Pushing notif for device token: " + deviceToken + city.temp + city.date);
      apnConnection.pushNotification(note, deviceToken);
    }
};
