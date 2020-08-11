import puppeteer, { Page } from 'puppeteer';

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

		await incognitoPage.setRequestInterception(true);
		incognitoPage.on('request', (request) => {
			if (request.resourceType() === 'image') {
				request.abort();
			}
			else request.continue();
		});

		await incognitoPage.goto('https://www.zillow.com/homedetails/2189-Gayle-Ave-Memphis-TN-38127/42228852_zpid/');

		// We need to get the url because that should for sure have the zpid
		const splitUrl = (await incognitoPage.url()).split('/');
		let zpid = '';

		for (let i = 0; i < splitUrl.length; i++) {
			if (splitUrl[i].includes('zpid')) {
				zpid = splitUrl[i].replace('_zpid', '');
			}
		}

		try {
			await incognitoPage.waitForSelector('.error-content-block', { timeout: 750 });

			console.log('Looks like we hit reCaptcha in zillow search', i);

			continue;
		}
		catch (e) {
			console.log('No captcha on ', i);
		}


		// let property: any;
		// try {
		// 	property = await fetchZillowPropertyData(parseInt(zpid), incognitoPage);
		// }
		// catch (e) {
		// 	console.log('error fetching zillow from zillow.', e);
		// 	continue;
		// }

		// console.log('property', property.streetAddress);

		await incognitoPage.close();
	}

	await browser.close();

})();


export async function fetchZillowPropertyData(zpid: number, page: Page, proxy = false) {
	const payload = {
		"operationName": "OffMarketFullRenderQuery",
		"variables": {
			"zpid": zpid,
			"contactFormRenderParameter": {
				"zpid": zpid,
				"platform": "desktop",
				"isDoubleScroll": false
			}
		},
		"clientVersion": "home-details/6.0.11.400.master.a1941d1",
		"queryId": "38fa1638c8a2fc3dc21a8ee73518f240"
	};
	let fetchUrl = `https://www.zillow.com/graphql/?zpid=${zpid}&contactFormRenderParameter=&queryId=38fa1638c8a2fc3dc21a8ee73518f240&operationName=OffMarketFullRenderQuery`;

	const propertyData = await page.evaluate(async (payload: any, fetchUrl: string) => {
		console.log('fetch url', fetchUrl);

		const response = await fetch(fetchUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		return await response.json();

	}, payload, fetchUrl);

	return propertyData.data.property;
}