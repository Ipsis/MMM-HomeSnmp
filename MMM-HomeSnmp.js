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

        var usgRxGage = document.createElement('div');
        usgRxGage.id = 'usgRxGage';
        var usgTxGage = document.createElement('div');
        usgTxGage.id = 'usgTxGage';

        var wapRxGage = document.createElement('div');
        wapRxGage.id = 'wapRxGage';
        var wapTxGage = document.createElement('div');
        wapTxGage.id = 'wapTxGage';

        var p1RxGage = document.createElement('div');
        p1RxGage.id = 'p1RxGage';
        var p1TxGage = document.createElement('div');
        p1TxGage.id = 'p1TxGage';
        
        var p2RxGage = document.createElement('div');
        p2RxGage.id = 'p2RxGage';
        var p2TxGage = document.createElement('div');
        p2TxGage.id = 'p2TxGage';

        var p3RxGage = document.createElement('div');
        p3RxGage.id = 'p3RxGage';
        var p3TxGage = document.createElement('div');
        p3TxGage.id = 'p3TxGage';

        var p4RxGage = document.createElement('div');
        p4RxGage.id = 'p4RxGage';
        var p4TxGage = document.createElement('div');
        p4TxGage.id = 'p4TxGage';

        var p5RxGage = document.createElement('div');
        p5RxGage.id = 'p5RxGage';
        var p5TxGage = document.createElement('div');
        p5TxGage.id = 'p5TxGage';

        var p6RxGage = document.createElement('div');
        p6RxGage.id = 'p6RxGage';
        var p6TxGage = document.createElement('div');
        p6TxGage.id = 'p6TxGage';

        var p7RxGage = document.createElement('div');
        p7RxGage.id = 'p7RxGage';
        var p7TxGage = document.createElement('div');
        p7TxGage.id = 'p7TxGage';
        
        var p8RxGage = document.createElement('div');
        p8RxGage.id = 'p8RxGage';
        var p8TxGage = document.createElement('div');
        p8TxGage.id = 'p8TxGage';

        wrapper.appendChild(usgRxGage);
        wrapper.appendChild(usgTxGage);
        wrapper.appendChild(wapRxGage);
        wrapper.appendChild(wapTxGage);
        wrapper.appendChild(p1RxGage);
        wrapper.appendChild(p1TxGage);
        wrapper.appendChild(p2RxGage);
        wrapper.appendChild(p2TxGage);
        wrapper.appendChild(p3RxGage);
        wrapper.appendChild(p3TxGage);
        wrapper.appendChild(p4RxGage);
        wrapper.appendChild(p4TxGage);
        wrapper.appendChild(p5RxGage);
        wrapper.appendChild(p5TxGage);
        wrapper.appendChild(p6RxGage);
        wrapper.appendChild(p6TxGage);
        wrapper.appendChild(p7RxGage);
        wrapper.appendChild(p7TxGage);
        wrapper.appendChild(p8RxGage);
        wrapper.appendChild(p8TxGage);

        return wrapper;
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SNMP_DATA") {
            this.config.currData = payload;

            payload.forEach(element => {
                if (element.name === "WAN") {
                    usgRx.refresh(element.rx, element.speed, 0, element.name);
                    usgTx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "UWAP") {
                    wapRx.refresh(element.rx, element.speed, 0, element.name);
                    wapTx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "Muppets") {
                    p1Rx.refresh(element.rx, element.speed, 0, element.name);
                    p1Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "Dev") {
                    p2Rx.refresh(element.rx, element.speed, 0, element.name);
                    p2Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "NAS") {
                    p3Rx.refresh(element.rx, element.speed, 0, element.name);
                    p3Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "WAP") {
                    p4Rx.refresh(element.rx, element.speed, 0, element.name);
                    p4Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "Game") {
                    p5Rx.refresh(element.rx, element.speed, 0, element.name);
                    p5Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "Blackness") {
                    p6Rx.refresh(element.rx, element.speed, 0, element.name);
                    p6Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "EyeOfEnder") {
                    p7Rx.refresh(element.rx, element.speed, 0, element.name);
                    p7Tx.refresh(element.tx, element.speed, 0, element.name);
                } else if (element.name === "Uplink") {
                    p8Rx.refresh(element.rx, element.speed, 0, element.name);
                    p8Tx.refresh(element.tx, element.speed, 0, element.name);
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
        return [this.file("css/style.css")];
    },
    getHeader: function() {
        return "Port Loads";

    },
    notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
        
            var fixed = 'value:0, min:0, max:100, label: "bps", gaugeWidthScale: "0.8", hideValue: false, humanFriendly: true, decimals: 2, hideMinMax: false, hideInnerShadow: true, valueFontColor: "#fff", valueFontFamily: "Roboto Condensed"';
            
            var script = document.createElement('script');
            script.innerHTML = 
                'usgRx = new JustGage({id: "usgRxGage", title:"USG RX", ' + fixed + '});' +
                'usgTx = new JustGage({id: "usgTxGage", title:"USG TX", ' + fixed + '});' +
                'wapRx = new JustGage({id: "wapRxGage", title:"WAP RX", ' + fixed + '});' +
                'wapTx = new JustGage({id: "wapTxGage", title:"WAP TX", ' + fixed + '});' +
                'p1Rx = new JustGage({id: "p1RxGage", title:"P1 RX", ' + fixed + '});' +
                'p1Tx = new JustGage({id: "p1TxGage", title:"P1 TX", ' + fixed + '});' +
                'p2Rx = new JustGage({id: "p2RxGage", title:"P2 RX", ' + fixed + '});' +
                'p2Tx = new JustGage({id: "p2TxGage", title:"P2 TX", ' + fixed + '});' +
                'p3Rx = new JustGage({id: "p3RxGage", title:"P3 RX", ' + fixed + '});' +
                'p3Tx = new JustGage({id: "p3TxGage", title:"P3 TX", ' + fixed + '});' +
                'p4Rx = new JustGage({id: "p4RxGage", title:"P4 RX", ' + fixed + '});' +
                'p4Tx = new JustGage({id: "p4TxGage", title:"P4 TX", ' + fixed + '});' +
                'p5Rx = new JustGage({id: "p5RxGage", title:"P5 RX", ' + fixed + '});' +
                'p5Tx = new JustGage({id: "p5TxGage", title:"P5 TX", ' + fixed + '});' +
                'p6Rx = new JustGage({id: "p6RxGage", title:"P6 RX", ' + fixed + '});' +
                'p6Tx = new JustGage({id: "p6TxGage", title:"P6 TX", ' + fixed + '});' +
                'p7Rx = new JustGage({id: "p7RxGage", title:"P7 RX", ' + fixed + '});' +
                'p7Tx = new JustGage({id: "p7TxGage", title:"P7 TX", ' + fixed + '});' +
                'p8Rx = new JustGage({id: "p8RxGage", title:"P8 RX", ' + fixed + '});' +
                'p8Tx = new JustGage({id: "p8TxGage", title:"P8 TX", ' + fixed + '});'

            document.body.appendChild(script);
        }
    },
});


