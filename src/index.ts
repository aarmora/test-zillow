import puppeteer from 'puppeteer';

(async () => {

	for (let i = 0; i < 10; i++) {
		const browser = await puppeteer.launch({
			headless: false,
			ignoreHTTPSErrors: true,
			args: [
				'--no-sandbox'
			]
		});
		const context = await browser.createIncognitoBrowserContext();
		const incognitoPage = await context.newPage();

		await incognitoPage.goto('https://duckduckgo.com/?q=2189+gayle+ave+memphis&ia=maps');

		await incognitoPage.goto('https://www.zillow.com/homedetails/2189-Gayle-Ave-Memphis-TN-38127/42228852_zpid/');

		await incognitoPage.waitFor(2500);


		await browser.close();
	}


})();