import React, { useState, useEffect } from 'react';
import { fetchData, getRandomElements, hasDuplicates } from './lib/helpers';
import './App.css';
import Header from './components/Header';
import Scoreboard from './components/Scoreboard';
import Cards from './components/Cards';

function App(props) {
	const [pickedPokemons, setPickedPokemons] = useState([]);
	const [selectedCards, setSelectedCards] = useState([]);
	const [score, setScore] = useState({ current: 0, best: 0 });
	const [isWinner, setIsWinner] = useState(undefined);

	function resetState() {
		setPickedPokemons([]);
		setSelectedCards([]);
		setScore((prevScore) => ({ ...prevScore, current: 0 }));
		setIsWinner(undefined);
	}

	async function getCompletePokemonData(pokemonName) {
		try {
			const pokemonData = await fetchData(
				`https://pokeapi.co/api/v2/pokemon/${pokemonName}`
			);
			return pokemonData;
		} catch (err) {
			console.log(err);
		}
	}

	async function getPokemonsCompleteData(pokemonNames) {
		try {
			const completePokemonsData = await Promise.all(
				pokemonNames.map(async (pokemonName) => {
					return getCompletePokemonData(pokemonName);
				})
			);
			return completePokemonsData;
		} catch (err) {
			console.log(err);
		}
	}

	function processPokemons(pokemons) {
		return pokemons.map((pokemon) => {
			return {
				name: pokemon.name,
				image:
					pokemon.sprites.other['official-artwork'].front_default ||
					pokemon.sprites.front_default ||
					'https://media.giphy.com/media/12Bpme5pTzGmg8/giphy.gif',
			};
		});
	}

	async function pickPokemons() {
		const incPokemonsData = await fetchData(
			'https://pokeapi.co/api/v2/pokemon?limit=1118'
		);
		const incRandomPokemonsData = getRandomElements(
			incPokemonsData.results,
			20
		);
		const randomPokemonNames = incRandomPokemonsData.map((incPokemonData) => {
			return incPokemonData.name;
		});
		const randomPokemons = await getPokemonsCompleteData(randomPokemonNames);
		const processedPokemons = processPokemons(randomPokemons);
		setPickedPokemons(processedPokemons);
	}

	async function newGame() {
		resetState();
		pickPokemons();
	}

	function bestScoreText(score) {
		return `${score.current === score.best ? ' NEW BEST SCORE!!!' : ''}`;
	}

	function handleCardClick(e) {
		const target = e.target;
		const cardName = target.dataset.name;
		setSelectedCards((prevSelectedCards) => [...prevSelectedCards, cardName]);
	}

	// Use effects

	useEffect(() => {
		newGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		function determineScoreOrIfLoser(selectedCards) {
			if (selectedCards.length === 0) {
				return;
			}
			const selectedCardsHasDulicates = hasDuplicates(selectedCards);
			if (!selectedCardsHasDulicates) {
				setScore((prevScore) => {
					const newScore = prevScore.current + 1;
					return {
						current: newScore,
						best: newScore > prevScore.best ? newScore : prevScore.best,
					};
				});
			} else {
				setIsWinner(false);
			}
		}
		determineScoreOrIfLoser(selectedCards);
	}, [selectedCards]);

	useEffect(() => {
		function determineIfWinner(score) {
			if (score.current >= 20) {
				setIsWinner(true);
			}
		}
		determineIfWinner(score);
	}, [score]);

	useEffect(() => {
		function messageAndDetermineIfNewGame(selectedCards, isWinner) {
			if (selectedCards.length === 0) {
				return;
			}
			if (typeof isWinner === 'boolean') {
				alert(
					`You ${isWinner ? 'win' : 'lose'}, your score is ${
						score.current
					} ${bestScoreText(score)}.`
				);
				newGame();
			}
		}
		messageAndDetermineIfNewGame(selectedCards, isWinner);
	}, [selectedCards, isWinner]);

	return (
		<main>
			<div
				className="container 
					top-part
					align-items-center 
					py-2
					my-4"
			>
				<Header classes={'mb-3 mb-md-0'} />
				<Scoreboard score={score} />
			</div>
			<Cards items={pickedPokemons} onCardClick={handleCardClick} />
		</main>
	);
}

export default App;
