const express = require("express");
const app = express();
const port = 3000;
const Alert = require("./lib/Alert")
const Email = require("./lib/EmailService")

const client = Alert.init();
const transporter = Email.init();

app.get("/", async (req, res) => {
  
  const data = await Alert.getUnReadAlertsFromElastic(client , 'test_index');
  const hits = data.body.hits.hits
  
  if(hits.length){

    await Email.sendAlertViaEmailToClient(transporter, JSON.stringify(data));
  
  }

  res.send("Hello World!");

});

app.listen(port, () => console.log(`app listening on ${port} port!`));
