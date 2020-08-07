import puppeteer from 'puppeteer';

(async () => {

	for (let i = 0; i < 10; i++) {
		const browser = await puppeteer.launch({
			headless: false,
			args: [
				'--no-sandbox'
			]
		});
		const page = await browser.newPage();

		await page.goto('https://www.zillow.com/homedetails/2189-Gayle-Ave-Memphis-TN-38127/42228852_zpid/');

		await page.waitFor(2500);


		await browser.close();
	}


})();