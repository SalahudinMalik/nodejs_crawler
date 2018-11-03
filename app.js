const express = require("express");
const app = express();
const global = require("./global");
var Crawler = require("crawler");
// const { google } = require("go

const readline = require("readline");
const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = "token.json";
var sheets = google.sheets("v4");

const fs = require("fs");
var credentials = "";
credentials = JSON.parse(fs.readFileSync("credentials.json", "utf8"));
var token = "";
const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

// token = JSON.parse(fs.readFileSync("token.json", "utf8"));
fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) return await getNewToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
    token = JSON.parse(token);
    // callback(oAuth2Client);
  });
// console.log('fs' , credentials);
// app.get('/', (req, res) =>{
let i = 0;
let arrObj = [];
var c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      if (res.statusCode == 200) {
        console.log(i++);
        var $ = res.$;
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        let disc = $(".teacher-description")
          .text()
          .toLowerCase();
        if (
          disc.includes("data mining") ||
          disc.includes("natural language") ||
          disc.includes("machine learning")
        ) {
          console.log($("title").text());
          console.log($(".teacher-show-name").text());
          console.log($(".teacher-description").text());
          console.log($(".teacher-show-email").text());
          let data =
            "----------- \n Name : " +
            $(".teacher-show-name").text() +
            "\n" +
            "Description : ";
          data =
            data +
            $(".teacher-description").text() +
            "\n" +
            "Email :" +
            $(".teacher-show-email").text();

          let obj1 = {
            name: $(".teacher-show-name").text(),
            field: $(".teacher-description").text(),
            email: $(".teacher-show-email").text()
          };
          // fs.appendFileSync('file.txt' , data);
          //   updateSpreadsheet(obj1);
          arrObj.push([obj1.name.trim(), obj1.email.trim(), obj1.field.trim()]);
        }
      }
    }
    done(console.log("done"));
  },
});
for (let a = 490; a < 500; a++) {
  c.queue("http://en.sjtu.edu.cn/academics/faculty/teachers/" + a);
}
c.on('drain',function(){
    // For example, release a connection to database.
    updateSpreadsheet(arrObj);
});
// Queue just one URL, with default callback

// // Queue a list of URLs
// c.queue(['http://www.google.com/','http://www.yahoo.com']);

// Queue URLs with custom callbacks & parameters
// c.queue([
//   {
//     uri: "http://en.sjtu.edu.cn/academics/faculty/s/271",
//     jQuery: false,

//     // The global callback won't be called
//     callback: function(error, res, done) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Grabbed", res.statusCode, "bytes");
//       }
//       done(updateSpreadsheet(arrObj));
//     }
//   }
// ]);

// Queue some HTML code directly without grabbing (mostly for tests)
// c.queue([
//   {
//     html: "<p>This is a <strong>test</strong></p>"
//   }
// ]);

const updateSpreadsheet = data => {
  console.log("updateSpreadsheet been called" , credentials,token);
  
  //   oAuth2Client.setCredentials({
  //     refresh_token: global.GOOGLE_REFRESH_TOKEN
  //   });

  //   oAuth2Client.refreshAccessToken((err, tokens) => {
  //     if (err) return console.error(err);

//   oAuth2Client.setCredentials({
//     access_token: token.access_token
//   });
  console.log("fun2");
  // The following call will create a spreadsheet and return an ID that can
  // be used with the API. Note that oAuth API can only be used to access
  // files it creates, not files already on a drive (unless you apply to
  // Google for additional privilages.)
  /*
      sheets.spreadsheets.create({ auth: oAuth2Client }, (err, response) => {
       if (err) return console.error(err)
       console.log(`New Spreadsheet ID: ${response.spreadsheetId}`)
      })
      */

  sheets.spreadsheets.values.append(
    {
      spreadsheetId: "1niQpP7RtPpJRRK6y5Eeux_xr3kXglg2IaE04RWV_crM",
      range: "Sheet2!A2",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        // values: [[data.name, data.email, data.field]]
        values: data
      },
      auth: oAuth2Client
    },
    (err, response) => {
      if (err) return console.error(err);
      else console.log("response", response.data);
    }
  );
  //   });
};
function getNewToken(oAuth2Client) {
    return new Promise((reject , resolve) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
          });
          console.log('Authorize this app by visiting this url:', authUrl);
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
              if (err) return console.error('Error while trying to retrieve access token', err);
              oAuth2Client.setCredentials(token);
              token = JSON.parse(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
                
              });
              return resolve(token)
              // callback(oAuth2Client);
            });
          });
    });
    
  }
//   updateSpreadsheet(arrObj);

// Run at startup

// res.send('scrapping')
// });

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
