import React, { useState, useEffect } from 'react';
import { fetchData, getRandomElements } from './lib/helpers';
import './App.css';

function App(props) {
	const [pickedPokemons, setPickedPokemons] = useState([]);

	async function newGame() {
		const pokemonsData = await fetchData(
			'https://pokeapi.co/api/v2/pokemon?limit=1118'
		);
		const randomPokemons = getRandomElements(pokemonsData.results, 20);
		setPickedPokemons(randomPokemons);
	}

	useEffect(() => {
		newGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main>
			<div>{JSON.stringify(pickedPokemons)}</div>
		</main>
	);
}

export default App;
