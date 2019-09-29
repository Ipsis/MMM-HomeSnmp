
const SNMP = require('net-snmp');

var options = {
    port: 161,
    retries: 1,
    timeout: 5000,
    transport: "udp4",
    trapPort: 162,
    version: SNMP.Version2c,
    idBitSize: 16
}

var oid2mib = {
    '1.3.6.1.2.1.31.1.1.1.18':      'ifAlias',   // name
    '1.3.6.1.2.1.31.1.1.1.15':      'ifHighSpeed', // speed
    '1.3.6.1.2.1.31.1.1.1.6':       'ifHCInOctets', // rxOctets
    '1.3.6.1.2.1.31.1.1.1.10':      'ifHCOutOctets' // txOctets
}

var config = {
    usgIp: "192.168.1.1",
    usgWanIndex: 2,
    wapIp: "192.168.1.11",
    wapIndex: 2,
    switchIp: "192.168.1.12",
    switchIndexes: [ 1, 2, 3, 4, 5, 6, 7, 8 ],
    interval: 30
}

var snmpData;

function GetSpeed(latest, previous, elapsedSecs) {
    var x = (latest - previous) / elapsedSecs;
    return (Math.round(x, 2) * 8);
}

function InitIndexData(element) {
    element["timestamp"] = new Date();
    element["name"] = "Unknown";
    element["speed"] = 1000;
    element["rxOctets"] = 0;
    element["txOctets"] = 0;
    element["last_timestamp"] = new Date();
    element["last_rxOctets"] = 0;
    element["last_txOctets"] = 0;

    element["last_bw_rxBits"] = 0;
    element["last_bw_txBits"] = 0;
    element["last_bw_speed"] = 1000 * 1024000;

}

function InitData() {
    if (typeof(snmpData) === 'undefined') {
        snmpData = {};
        snmpData[config.usgIp] = {};
        snmpData[config.usgIp][config.usgWanIndex] = {};
        InitIndexData(snmpData[config.usgIp][config.usgWanIndex]);

        snmpData[config.wapIp] = {};
        snmpData[config.wapIp][config.wapIndex] = {};
        InitIndexData(snmpData[config.wapIp][config.wapIndex]);

        snmpData[config.switchIp] = {};
        config.switchIndexes.forEach(element => {
            snmpData[config.switchIp][element] = {};
            InitIndexData(snmpData[config.switchIp][element]);
        });
    }
}

function RefreshHostData2(host, indexes) {

    var oids = [];
    indexes.forEach(element => {
        for (i = 0; i < Object.keys(oid2mib).length; i++) {
            var oid = Object.keys(oid2mib)[i] + "." + element.toString();
            oids.push(oid);
        }
    });

    var session = SNMP.createSession(host, "public", options);
    return new Promise((resolve, reject) => {
        session.get(oids, function(error, varbinds) {
            if (error) {
                session.close();
                reject(error);
            }
            
            indexes.forEach(element => {
                snmpData[host][element]["last_timestamp"] = snmpData[host][element]["timestamp"];
                snmpData[host][element]["last_rxOctets"] = snmpData[host][element]["rxOctets"];
                snmpData[host][element]["last_txOctets"] = snmpData[host][element]["txOctets"];
                snmpData[host][element]["timestamp"] = new Date();

            });

            for (var i = 0; i < varbinds.length; i++) {
                if (SNMP.isVarbindError(varbinds[i])) {
                    console.error(SNMP.varbindError(varbinds[i]));
                } else {
                    var v = varbinds[i].oid.split('.');
                    var currIdx = v.pop();
                    var currOid = v.join('.');

                    var val = ConvertBuffer(varbinds[i]);
                    if (oid2mib[currOid] === 'ifAlias')
                        snmpData[host][currIdx]["name"] = val;
                    else if (oid2mib[currOid] === 'ifHighSpeed')
                        snmpData[host][currIdx]["speed"] = val;
                    else if (oid2mib[currOid] === 'ifHCInOctets')
                        snmpData[host][currIdx]["rxOctets"] = val;
                    else if (oid2mib[currOid] === 'ifHCOutOctets')
                        snmpData[host][currIdx]["txOctets"] = val;

                    // WAN is only 75Mbit connection
                    if (host == config.usgIp && currIdx == config.usgWanIndex)
                        snmpData[host][currIdx]["speed"] = 75;
                }
            }
            session.close();
            resolve();
        });
    })
}

function RefreshHostData(host, indexes) {

    var oids = [];
    indexes.forEach(element => {
        for (i = 0; i < Object.keys(oid2mib).length; i++) {
            var oid = Object.keys(oid2mib)[i] + "." + element.toString();
            oids.push(oid);
        }
    });

    var session = SNMP.createSession(host, "public", options);
    session.get(oids, function(error, varbinds) {
        if (error) {
            console.error(error);
        } else {
            indexes.forEach(element => {
                snmpData[host][element]["last_timestamp"] = snmpData[host][element]["timestamp"];
                snmpData[host][element]["last_rxOctets"] = snmpData[host][element]["rxOctets"];
                snmpData[host][element]["last_txOctets"] = snmpData[host][element]["txOctets"];
                snmpData[host][element]["timestamp"] = new Date();

            });

            for (var i = 0; i < varbinds.length; i++) {
                if (SNMP.isVarbindError(varbinds[i])) {
                    console.error(SNMP.varbindError(varbinds[i]));
                } else {
                    var v = varbinds[i].oid.split('.');
                    var currIdx = v.pop();
                    var currOid = v.join('.');

                    var val = ConvertBuffer(varbinds[i]);
                    if (oid2mib[currOid] === 'ifAlias')
                        snmpData[host][currIdx]["name"] = val;
                    else if (oid2mib[currOid] === 'ifHighSpeed')
                        snmpData[host][currIdx]["speed"] = val;
                    else if (oid2mib[currOid] === 'ifHCInOctets')
                        snmpData[host][currIdx]["rxOctets"] = val;
                    else if (oid2mib[currOid] === 'ifHCOutOctets')
                        snmpData[host][currIdx]["txOctets"] = val;

                    // WAN is only 75Mbit connection
                    if (host == config.usgIp && currIdx == config.usgWanIndex)
                        snmpData[host][currIdx]["speed"] = 75;
                }
            }

        }
        session.close();
    });
}

function ConvertBuffer(snmpObj) {
    switch (snmpObj.type) {
        case 4:
            return snmpObj.value.toString();
        case 70:
            var buf = new Buffer.alloc(4);
            buf.write(snmpObj.value.toString(), 0);
            return parseInt(snmpObj.value.toString('hex'), 16);
        default:
            return snmpObj.value;
    }
}

function CalcLoad(host, index) {

    data = snmpData[host][index];

/*    if ((data["timestamp"] - data["last_timestamp"]) / 1000 <= config.interval)
        return { rx: data["last_bw_rxBits"], tx: data["last_bw_txBits"], speed: data["last_bw_speed"] }; */

    timeDelta = ((data["timestamp"] - data["last_timestamp"]) / 1000);
    rxBits = GetSpeed(data["rxOctets"], data["last_rxOctets"], timeDelta);
    txBits = GetSpeed(data["txOctets"], data["last_txOctets"], timeDelta);

    data["last_bw_rxBits"] = rxBits;
    data["last_bw_txBits"] = txBits;
    data["last_bw_speed"] = data["speed"] * 1024000;
    return { rx: data["last_bw_rxBits"], tx: data["last_bw_txBits"], speed: data["last_bw_speed"] };
}

/*
InitData();

const usgPromise = RefreshHostData2(config.usgIp, [ config.usgWanIndex ]);
const wapPromise = RefreshHostData2(config.wapIp, [ config.wapIndex ]);
const switchPromise = RefreshHostData2(config.switchIp, config.switchIndexes);

Promise.all([usgPromise, wapPromise, switchPromise]).then(() => {
    console.log(snmpData);
});
*/

// See MMM-SystemStats for an alterative where this module calls the refresh

var isRunning = false;
module.exports = NodeHelper.create({
    start: () => {
        console.log(this.name + " helper started ...")
    },
    socketNotificationReceived : function(notification , payload) {
        if (notification === "SNMP_REFRESH") {
            if (isRunning == false) {
                isRunning = true;
                InitData();
                const usgPromise = RefreshHostData2(config.usgIp, [ config.usgWanIndex ]);
                const wapPromise = RefreshHostData2(config.wapIp, [ config.wapIndex ]);
                const switchPromise = RefreshHostData2(config.switchIp, config.switchIndexes);
                Promise.all([usgPromise, wapPromise, switchPromise]).then(() => {
                    payload = [];

                    var load = CalcLoad(config.usgIp, config.usgWanIndex);
                    payload.push( { name: "WAN", rx: load.rx, tx: load.tx, speed:load.speed } );

                    load = CalcLoad(config.wapIp, config.wapIndex);
                    payload.push( { name: "WAP", rx: load.rx, tx: load.tx, speed:load.speed } );

                    config.switchIndexes.forEach(element => {
                        load = CalcLoad(config.switchIp, element);
                        payload.push( { name: snmpData[config.switchIp][element]["name"], rx: load.rx, tx: load.tx, speed:load.speed } );
                    });

                    console.log(payload);
                    this.sendSocketNotification("SNMP_DATA", payload);
                    isRunning = false;
            });
            }
        } 
    }
})


