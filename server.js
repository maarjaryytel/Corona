const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/style", express.static(__dirname + "public/style"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let url = "https://api.thevirustracker.com/free-api?countryTimeline=EE";

  axios
    .get(url)
    .then(function (response) {
      //andmed = kõik jsonist saadaolevad andmed
      let andmed = response.data.timelineitems[0];

      //esimeseJuhtumiAndmed = esimese juhtumi kõik read koos nende väärtustega (new daily cases => 1, new daily deaths => 0 jne)
      let esimeseJuhtumiAndmed = andmed[Object.keys(andmed)[0]];

      //esimeseJuhtumiRead = esimese juhtumi kõik read üksnes, ilma väärtusteta (new daily cases, new daily deaths jne)
      let esimeseJuhtumiRead = Object.keys(esimeseJuhtumiAndmed).sort();

      //esimeseJuhtumiUuedJuhtumid = esimese juhtumi new daily cases väärtus 
      let esimeseJuhtumiUuedJuhtumid =
        esimeseJuhtumiAndmed[esimeseJuhtumiRead[0]];

      //esimeseJuhtumiTotalCases = esimese juhtumi päeva seisuga total cases väärtus 
      let esimeseJuhtumiTotalCases =
        esimeseJuhtumiAndmed[esimeseJuhtumiRead[2]];

      //esimeseJuhtumiTotalrecoveries = esimese juhtumi päeva seisuga total recoveries väärtus 
      let esimeseJuhtumiTotalRecoveries =
        esimeseJuhtumiAndmed[esimeseJuhtumiRead[3]];

      //viimaseJuhtumiAndmed = viimase juhtumi kõik read koos nende väärtustega 
      let viimaseJuhtumiAndmed =
        andmed[Object.keys(andmed)[Object.keys(andmed).length - 2]];

      //viimaseJuhtumiRead = viimase juhtumi kõik read üksnes, ilma väärtusteta (new daily cases, new daily deaths jne)
      let viimaseJuhtumiRead = Object.keys(viimaseJuhtumiAndmed).sort();

      //viimaseJuhtumiUuedJuhtumid = viimase juhtumi new daily cases väärtus 
      let viimaseJuhtumiUuedJuhtumid =
        viimaseJuhtumiAndmed[viimaseJuhtumiRead[0]];

      //viimaseJuhtumiTotalCases = viimase juhtumi paeva seisuga total cases väärtus 
      let viimaseJuhtumiTotalCases =
        viimaseJuhtumiAndmed[viimaseJuhtumiRead[2]];

      //viimaseJuhtumiTotalrecoveries = viimase juhtumi päeva seisuga total recoveries väärtus 
      let viimaseJuhtumiTotalRecoveries =
        viimaseJuhtumiAndmed[viimaseJuhtumiRead[4]];

      //esimene kuupäev
      let esimeneKuupaev = Object.keys(andmed)[0];

      // viimane kuupäev
      let viimaneKuupaev = Object.keys(andmed)[Object.keys(andmed).length - 2];

      res.render("index.ejs", {
        firstDate: esimeneKuupaev,
        lastDate: viimaneKuupaev,
        newCases1: esimeseJuhtumiUuedJuhtumid,
        newCases2: viimaseJuhtumiUuedJuhtumid,
        totalCases1: esimeseJuhtumiTotalCases,
        totalCases2: viimaseJuhtumiTotalCases,
        totalRecoveries1: esimeseJuhtumiTotalRecoveries,
        totalRecoveries2: viimaseJuhtumiTotalRecoveries,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server has started.");
});
