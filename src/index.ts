import puppeteer from 'puppeteer';

const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

(async () => {
	puppeteerExtra.use(pluginStealth());
	const browser = await puppeteerExtra.launch({
		headless: true,
		ignoreHTTPSErrors: true,
		args: [
			'--no-sandbox'
		]
	});

	for (let i = 0; i < 10; i++) {
		const context = await browser.createIncognitoBrowserContext();
		const incognitoPage = await context.newPage();

		await incognitoPage.goto('https://duckduckgo.com/?q=2189+gayle+ave+memphis&ia=maps');

		await incognitoPage.goto('https://www.zillow.com/homedetails/2189-Gayle-Ave-Memphis-TN-38127/42228852_zpid/');

		try {
			await incognitoPage.waitForSelector('title', { timeout: 2500 });
		}
		catch (e) {
			console.log('No title found');
			await incognitoPage.close();
			continue;
		}

		const title = await incognitoPage.$eval('title', element => element.textContent);

		console.log('title', title);

		await incognitoPage.close();
	}

	await browser.close();

})();