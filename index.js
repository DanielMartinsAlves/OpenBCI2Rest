var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
app.listen(port);
listData = [];
app.get('/api/data/:range/:start', (req, res) => {
    let range = req.params.range;
    let start = req.params.start;
    let dataShow = (listData.length > range+start)?listData.slice(start, parseInt(range)+parseInt(start)):listData;
      res.status(200).send({
        data: dataShow
      });
});
app.get('/api/data/:range', (req, res) => {
  let range = req.params.range;
  let dataShow = (listData.length > range)?listData.slice(range*-1):listData;
    res.status(200).send({
      data: dataShow
    });
});
console.log('todo list RESTful API server started on: ' + port);
const Cyton = require('openbci-cyton');
const k = require("@openbci/utilities").constants;// use to simulate connection
const ourBoard = new Cyton();
const portName = "COM3";
/*ourBoard.listPorts()
   .then((ports) => {
     console.log('ports', JSON.stringify(ports));
   });*/
ourBoard.connect(portName) // Port name is a serial port name, see `.listPorts()` -------- porta real
//ourBoard.connect(k.OBCISimulatorPortName) // Port name is a serial port name, see `.listPorts()` ---------- porta simulada

  .then(() => {
    ourBoard.streamStart();
    ourBoard.on('sample',(sample) => {
      /** Work with sample */
      let listRow = [];
      listRow.push(listData.length);
      for (let i = 0; i < ourBoard.numberOfChannels(); i++) {
        listRow.push(sample.channelData[i].toFixed(8));
        console.log("Channel " + (i + 1) + ": " + sample.channelData[i].toFixed(8) + " Volts.");
      }
      listRow.push(sample.boardTime);
      listData.push(listRow);
    });
});