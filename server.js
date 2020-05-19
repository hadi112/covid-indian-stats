const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get("/",async(req,res) => {
    try{
    let infourl = 'https://www.mygov.in/covid-19';
    let browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
    let page = await browser.newPage();
    await page.goto(infourl, { waitUntil:'networkidle2' , timeout: 0 });
    let data = await page.evaluate( () =>{
        let stats = document.querySelector('div[class="information_row"]').innerText;
        return stats;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    });
    //console.log(data);
    res.send(data);
    //alert(data);
    await browser.close();}
    catch(error){
        console.log(error);
    }
});
app.listen(PORT);