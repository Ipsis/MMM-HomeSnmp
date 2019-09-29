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
        var wrapper = document.createElement('table');

        var row = document.createElement('tr');
        var c1 = document.createElement('td');
        c1.setAttribute('class', 'title');
        c1.style.textAlign = self.config.align;
        c1.innerText = "Name";
        row.appendChild(c1);

        var c2 = document.createElement('td');
        c2.setAttribute('class', 'title');
        c2.style.textAlign = self.config.align;
        c2.innerText = "RX";
        row.appendChild(c2);

        var c3 = document.createElement('td');
        c3.setAttribute('class', 'title');
        c3.style.textAlign = self.config.align;
        c3.innerText = "TX";
        row.appendChild(c3);

        wrapper.appendChild(row);

        self.config.currData.forEach(element => {

            var row = document.createElement('tr');
            var c1 = document.createElement('td');
            c1.style.textAlign = self.config.align;
            c1.innerText = element.name;
            row.appendChild(c1);

            var c2 = document.createElement('td');
            c2.style.textAlign = self.config.align;
            c2.innerText = element.rx;
            row.appendChild(c2);

            var c3 = document.createElement('td');
            c3.style.textAlign = self.config.align;
            c3.innerText = element.tx;
            row.appendChild(c3);

            wrapper.appendChild(row);
        });


        return wrapper;
    },
    socketNotificationReceived: function(notification, payload) {
        Log.error(notification);
        if (notification === "SNMP_DATA") {
            this.config.currData = payload;
            this.updateDom(0);
        }
    }, 
});

