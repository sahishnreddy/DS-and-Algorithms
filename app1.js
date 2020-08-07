var nodemailer = require("nodemailer");
var request = require("request");
var events = require("events");
//var event = require("./event.js");
//console.log(event);
//var response = require("response");
const config = require("./config");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = process.env.PORT || 80;
var data;
var email = "sahishn.reddy@gmail.com";
var text;
var id;
var temp;
var eventEmitter = new events.EventEmitter();
var myEventHandler = function () {
  console.log("I hear a scream!");
};
eventEmitter.on("test", myEventHandler);
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.APISecret);

var options = {
  method: "POST",
  url: "https://api.zoom.us/v2/users/sahishn.g@ibridgetechsoft.com/meetings",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1NEJzVlU5TFMwMmhHMHF4MTZQMWFRIiwiZXhwIjoxNTk1ODMxNDUxODU3LCJpYXQiOjE1OTU4MzE0NDZ9.31Zml7uuxjwWsAXzzK6pgGfkhGQyvGMpWZmkqjOIMUM",
    Cookie:
      "_zm_csp_script_nonce=NW8UW7hVQMyQ217AXjl2MQ; _zm_currency=USD; _zm_mtk_guid=7af8e385808a48839b46a84dff48c258; cred=7100640C51E0A8C2E55BF08323A84270",
  },
  body: JSON.stringify({
    topic: "test",
    type: 2,
    start_time: "2020-08-01T22:00:00Z",
    duration: 60,
    schedule_for: "",
    timezone: "Asia/Calcutta",
    password: "",
    agenda: "testing",
    settings: {
      host_video: "false",
      participant_video: "false",
      cn_meeting: "false",
      in_meeting: "false",
      join_before_host: "true",
      mute_upon_entry: "false",
      watermark: "false",
      use_pmi: "false",
      approval_type: 2,
      registration_type: 1,
      audio: "both",
      auto_recording: "local",
      enforce_login: "false",
      enforce_login_domains: "",
      alternative_hosts: "",
      global_dial_in_countries: [""],
      registrants_email_notification: "true",
    },
  }),
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  data = JSON.parse(response.body);
  console.log(data);
  console.log(data.join_url);
  console.log(data.start_time);
  //console.log(data.uuid);
  temp = data.join_url;
  text = temp;
  id = data.uuid;
  sendEmail(email, text);
  //handling meeting end event
  app.post("/", function (req, res) {
    var body = req.body;
    var id = body.payload.object.uuid;
    console.log(id);
    presentees(id);
    function presentees(id) {
      var options1 = {
        method: "GET",
        url: "https://api.zoom.us/v2/past_meetings/" + id,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1NEJzVlU5TFMwMmhHMHF4MTZQMWFRIiwiZXhwIjoxNTk1ODMxNDUxODU3LCJpYXQiOjE1OTU4MzE0NDZ9.31Zml7uuxjwWsAXzzK6pgGfkhGQyvGMpWZmkqjOIMUM",
          Cookie:
            "_zm_csp_script_nonce=NW8UW7hVQMyQ217AXjl2MQ; _zm_mtk_guid=7af8e385808a48839b46a84dff48c258; cred=FC519A28A8D3EBE04793887A7A80A177",
        },
      };
      request(options1, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
    }
  });

  function sendEmail(email, text) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sahishn.g@ibridgetechsoft.com",
        pass: "Sahishn#2616",
      },
    });

    var mailOptions = {
      from: "sahishn.g@ibridgetechsoft.com",
      to: email,
      subject: "sending email using nodejs",
      text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent:" + info.response);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
