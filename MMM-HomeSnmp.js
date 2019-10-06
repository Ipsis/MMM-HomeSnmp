Module.register("MMM-HomeSnmp", {

    defaults: {
        currData: {}
    },

    start: function() {
        Log.info("Starting module: " + this);

        var self = this;
        setInterval(() => {
            this.sendSocketNotification("SNMP_REFRESH", { })
        }, 5000);
    },

    getDom: function() {

        var self = this;
        var wrapper = document.createElement('div');
        var header = document.createElement('div');
        header.innerHTML = "Gauges";
        var usgRxGage = document.createElement('div');
        usgRxGage.id = 'usgRxGage';

        var usgTxGage = document.createElement('div');
        usgTxGage.id = 'usgTxGage';


        wrapper.appendChild(header);
        wrapper.appendChild(usgRxGage);
        wrapper.appendChild(usgTxGage);

        return wrapper;
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SNMP_DATA") {
            this.config.currData = payload;

            payload.forEach(element => {
                if (element.name === "WAN") {
                    usgRx.refresh(element.rx, element.speed);
                    usgTx.refresh(element.tx, element.speed);
                }

            });
        }
    }, 
    getScripts: function() {
        return [
            this.file('js/justgage-1.2.2/justgage.js'), 
            this.file('js/justgage-1.2.2/raphael-2.1.4.min.js')
        ]
    },
    getStyles: function() {
        return [this.files("css/style.css")];
    },
    getHeader: function() {
        return "Port Loads";

    },
    notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
            var script = document.createElement('script');

            script.innerHTML = 'var usgRx, usgTx;' +
                'usgRx = new JustGage({id: "usgRxGage", value:0, min:0, max:75, title:"USG Download", label: "bps", gaugeWidthScale: "0.8", hideValue: false, humanFriendly: true, decimals: 2, hideMinMax: false, hideInnerShadow: true, valueFontColor: "#fff", valueFontFamily: "Roboto Condensed" });' + 
                'usgTx = new JustGage({id: "usgTxGage", value:0, min:0, max:75, title:"USG Upload", label: "bps", gaugeWidthScale: "0.8", hideValue: false, humanFriendly: true, decimals: 2, hideMinMax: false, hideInnerShadow: true, valueFontColor: "#fff", valueFontFamily: "Roboto Condensed" });'

            document.body.appendChild(script);
        }
    },
});


