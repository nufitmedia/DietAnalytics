function init() {
    document.addEventListener("deviceready", initPushwoosh, true);
    //rest of the code
}

function initPushwoosh()
{
    var pushNotification = window.plugins.pushNotification;
 
    //set push notifications handler
    document.addEventListener('push-notification', function(event) {
	    //event.notification is a JSON push notifications payload
	    var title = event.notification.title;
	 
	    //example of obtaining custom data from push notification
	    var userData = event.notification.userdata;
	 
	    console.warn('user data: ' + JSON.stringify(userData));
	 
	    //we might want to display an alert with push notifications title
	    alert(title);
	});
 
    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({ projectid: "190594773739", appid : "F62AA-F552C" });
 
    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}