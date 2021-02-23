import { useEffect, useRef } from 'react';

async function fetchData(url) {
	try {
		const response = await fetch(url, { mode: 'cors' });
		const data = await response.json();
		return data;
	} catch (err) {
		console.log(err);
	}
}

// https://stackoverflow.com/a/2450976
// WARNING! this mutates the original array.
function shuffle(array) {
	let currentIndex = array.length;
	let temporaryValue;
	let randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function getRandomElements(array, num) {
	const arrayCopy = [...array];
	shuffle(arrayCopy);
	return arrayCopy.slice(0, num);
}

function titleCase(str) {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.substr(1));
}

function hasDuplicates(array) {
	return new Set(array).size !== array.length;
}

export { fetchData, shuffle, getRandomElements, titleCase, hasDuplicates };
