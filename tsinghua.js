const express = require('express')
const app = express()
var Crawler = require("crawler");
const fs = require('fs');
const port = 3000

app.get('/', (req, res) =>{ 
    
    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                
               
                var $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                // let disc = $(".teacher-description").text().toLowerCase();
                // if(disc.includes('power electronic') || disc.includes('smart grid') || disc.includes('convertor')) {
                    console.log($("title").text());
                    console.log($(".teacher-show-name").text());
                    console.log($(".teacher-description").text());
                    console.log($(".teacher-show-email").text());
                    let data = '----------- \n Name : ' +$(".teacher-show-name").text() +'\n' +'Description : ';
                    data = data +$(".teacher-description").text() + '\n' + 'Email :'+$(".teacher-show-email").text();
                    // fs.appendFileSync('file.txt' , data);
                // }
              
            
            }
            done();
        }
    });
    // for(let a = 0 ; a < 500; a++){
    //     c.queue('http://en.sjtu.edu.cn/academics/faculty/teachers/'+a);
    // }
    // Queue just one URL, with default callback
   
     c.queue('http://www.tsinghua.edu.cn/publish/eeaen/1220/index.html');
    // // Queue a list of URLs
    // c.queue(['http://www.google.com/','http://www.yahoo.com']);
     
    // Queue URLs with custom callbacks & parameters
    c.queue([{
        uri: 'http://www.tsinghua.edu.cn/publish/eeaen/1220/index.html',
        jQuery: false,
     
        // The global callback won't be called
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                console.log($("title").text());
                console.log('Grabbed', res.statusCode, 'bytes');
            }
            done();
        }
    }]);
     
    // Queue some HTML code directly without grabbing (mostly for tests)
    c.queue([{
        html: '<p>This is a <strong>test</strong></p>'
    }]);

    res.send('scrapping')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))