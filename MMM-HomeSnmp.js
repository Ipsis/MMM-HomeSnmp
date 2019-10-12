Module.register("MMM-HomeSnmp", {

    defaults: {
        currData: {}
    },

    start: function() {
        Log.info("Starting module: " + this);

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

        wrapper.appendChild(usgRxGage);
        wrapper.appendChild(usgTxGage);

        var tableDiv = document.createElement('div');
        var table = document.createElement('table');
        tableDiv.appendChild(table);
        if (this.config.currData.length > 0) {
            this.config.currData.forEach(element => {

                var row = document.createElement('tr');

                var c1 = document.createElement('td');
                c1.setAttribute('class', 'title');
                c1.style.textAlign = 'left';
                c1.innerText = element.name;
                row.appendChild(c1);

                var c2 = document.createElement('td');
                c2.setAttribute('class', 'value');
                c2.style.textAlign = 'right';
                if (element.rx == 0) {
                    c2.innerText = "-";
                } else {
                    c2.innerText = this.readableBytes(element.rx);
                }
                row.appendChild(c2);

                var c3 = document.createElement('td');
                c3.setAttribute('class', 'value');
                c3.style.textAlign = 'right';
                if (element.tx == 0) {
                    c3.innerText = "-";
                } else {
                    c3.innerText = this.readableBytes(element.tx);
                }
                row.appendChild(c3);

                table.appendChild(row);
            })
        }
        wrapper.appendChild(tableDiv); 

        return wrapper;
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SNMP_DATA") {
            this.config.currData = payload;

            this.config.currData.forEach(element => {
                if (element.name === "WAN") {
                    usgRx.refresh(element.rx, element.speed, 0, element.name);
                    usgTx.refresh(element.tx, element.speed, 0, element.name);
                }
            });
            this.updateDom(0);
        }
    }, 
    getScripts: function() {
        return [
            this.file('js/justgage-1.2.2/justgage.js'), 
            this.file('js/justgage-1.2.2/raphael-2.1.4.min.js')
        ]
    },
    getStyles: function() {
        return [this.file("css/style.css"), "font-awesome.css"];
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
                'usgTx = new JustGage({id: "usgTxGage", title:"USG TX", ' + fixed + '});'

            document.body.appendChild(script);
        }
    },
    readableBytes(bytes) {
        var i = Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
    }
});


