// ==UserScript==
// @name Pendoria Donation Tracker
// @namespace https://github.com/trigunshin/pendoria
// @description Output donation stats to JS console as CSV. Manually navigate to guild donations page to trigger it.
// @homepage https://trigunshin.github.com/pendoria
// @version 1
// @downloadURL https://trigunshin.github.io/pendoria/userScripts/donationTracking.user.js
// @updateURL https://trigunshin.github.io/pendoria/userScripts/donationTracking.user.js
// @include https://pendoria.net/game
// ==/UserScript==

function printDonationData(data, headers) {
	const output = [headers.join(',')];

	const dataKeys = Object.keys(data);
	for(let dataKey of dataKeys) {
		const value = data[dataKey];
		const rowOutput = [];

		for(let header of headers) {
			rowOutput.push(value[header].split(',').join(''));
		}
		output.push(rowOutput.join(','));
	}
	console.info(output.join('\n'));
}

function getHeaders(headerRow) {
	const childrenArray = Array.from(headerRow.children);
	return childrenArray.map((item, key) => {
		return item.innerText.toLowerCase().replace(' ', '');
	});
}

function handleGuildDonations(dataText) {
	let el = $('<div></div>');
	el.html(dataText);

	const memberDataHTML = $('table#guild-donation-list tr', el);
	const memberData = Array.from(memberDataHTML); // HTMLCollection is terrible
	if(!memberData || memberData.length === 0) return;

	const headers = getHeaders(memberData.shift());
	const donationData = memberData.reduce((accum, val, i)=>{
		const values = Array.from(val.children); // HTMLCollection is terrible
		const rowData = values.reduce((accum, val, i) => {
			const header = headers[i];
			if(header && header.length > 0) accum[headers[i]] = val.innerText;
			return accum;
		}, {});

		accum[rowData.name] = rowData;
		return accum;
	}, {});
	printDonationData(donationData, headers);
}

function monitorResults( event, xhr, settings ) {
	const url = settings.url;

	if (url.indexOf('donations-list') >= 0) {
		console.info('matched', xhr);
		handleGuildDonations(xhr.responseText);
	}
}

$(document).ajaxComplete(monitorResults);
