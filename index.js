'use strict';

// Detect either spaces or tabs but not both to properly handle tabs for indentation and spaces for alignment
const INDENT_RE = /^(?:( )+|\t+)/;

function getMostUsed(indents) {
	let result = 0;
	let maxUsed = 0;
	let maxWeight = 0;

	for (const entry of indents) {
		// TODO: use destructuring when targeting Node.js 6
		const key = entry[0];
		const val = entry[1];

		const u = val[0];
		const w = val[1];

		if (u > maxUsed || (u === maxUsed && w > maxWeight)) {
			maxUsed = u;
			maxWeight = w;
			result = key;
		}
	}

	return result;
}

module.exports = str => {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Remember the size of previous line's indentation
	let prev = 0;
	let indentTypePrev;
	// Indents key (ident type + size of the indents/unindents)
	let key;

	// Remember how many indents/unindents as occurred for a given size and how much lines follow a given indentation
	// The key is a concatenation of the indentation type (s = space and t = tab) and the size of the indents/unindents
	//
	// indents = {
	//    t3: [1, 0],
	//    t4: [1, 5],
	//    s5: [1, 0],
	//   s12: [1, 0],
	// }
	const indents = new Map();

	for (const line of str.split(/\n/g)) {
		if (!line) {
			// Ignore empty lines
			continue;
		}

		let indent;
		let indentType;
		let weight;
		let entry;
		const matches = line.match(INDENT_RE);

		if (!matches) {
			prev = 0;
			indentTypePrev = '';
		} else {
			indent = matches[0].length;

			if (matches[1]) {
				indentType = 's';
			} else {
				indentType = 't';
			}

			if (indentType !== indentTypePrev) {
				prev = 0;
			}
			indentTypePrev = indentType;

			weight = 0;

			const diff = indent - prev;
			prev = indent;

			// Previous line have same indent?
			if (diff === 0) {				
				weight++;
				// We use the key from previous loop
			} else {
				key = indentType + String(diff > 0 ? diff : -diff);
			}

			// Update the stats
			entry = indents.get(key);

			if (entry === undefined) {
				entry = [1, 0]; // Init
			} else {
				entry = [++entry[0], entry[1] + weight];
			}
			indents.set(key, entry);
		} 
	}

	const result = getMostUsed(indents);

	let amount;
	let type;
	let indent;
	if (!result) {
		amount = 0;
		type = null;
		indent = '';
	} else {
		amount = Number(result.substring(1));

		if (result[0] === 's') {
			type = 'space';
			indent = ' '.repeat(amount);
		} else {
			type = 'tab';
			indent = '\t'.repeat(amount);
		}		
	}

	return {
		amount,
		type,
		indent
	};
};
