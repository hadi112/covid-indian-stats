const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get("/",async(req,res) => {
    try{
    let infourl = 'https://www.mygov.in/covid-19';
    let browser = await puppeteer.launch({headless: false,args:['--no-sandbox','--disable-setuid-sandbox']});
    let page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        request._interceptionHandled = false;
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
          request.respond({
            status: 200,
            body: "foo"
          })
        } else {
          request.continue();
        }
      });
    await page.goto(infourl, { waitUntil:'networkidle2' , timeout: 0 });
    let data = await page.evaluate( () =>{
        let stats = document.getElementById("#dashboard").childNodes;
        let active = stats[3].innerText;
        let cured = stats[5].innerText;
        let death = stats[7].innerText;
        let migrated = stats[9].innerText;
        return {
            active,
            cured,
            death,
            migrated
        };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    });
    var json = JSON.stringify(data);
    json = json.replace(/\\n/g, ' ');
    json =  JSON.parse(json);
    console.log(json);
    res.send(json)
    await browser.close();}
    catch(error){
        console.log(error);
    }
});
app.listen(PORT);