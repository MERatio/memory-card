import React, { useState, useEffect } from 'react';
import { fetchPokemons, getRandomElements } from './lib/helpers';
import './App.css';

function App(props) {
	const [pickedPokemons, setPickedPokemons] = useState([]);

	async function newGame() {
		const pokemons = await fetchPokemons();
		const randomPokemons = getRandomElements(pokemons, 20);
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
