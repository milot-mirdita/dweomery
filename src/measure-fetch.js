const { Builder, By, until } = require('selenium-webdriver');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('dist')) 
const server = app.listen(3000, () => {
    (async function waitForSpellsJson() {
        let driver = await new Builder().forBrowser('firefox').build();
        try {
            await driver.manage().setTimeouts({ 'pageLoad': 30000000, 'script': null });
            await driver.get('http://127.0.0.1:3000/measure.html');
            await driver.wait(until.elementLocated(By.id('json')), 1000);
            let inner = await driver.findElement(By.id('json')).getText();
            fs.writeFileSync('src/assets/spells.json', inner);
        } finally {
            await driver.quit();
            server.close();
        }
    })();
});