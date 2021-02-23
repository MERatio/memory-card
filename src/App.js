import React, { useState, useEffect } from 'react';
import {
	fetchData,
	shuffle,
	getRandomElements,
	hasDuplicates,
} from './lib/helpers';
import './App.css';
import Header from './components/Header';
import Scoreboard from './components/Scoreboard';
import Cards from './components/Cards';
import LoadingSpinner from './components/LoadingSpinner';
import ShuffleSpinner from './components/ShuffleSpinner';

function App(props) {
	const [pickedPokemons, setPickedPokemons] = useState([]);
	const [selectedCards, setSelectedCards] = useState([]);
	const [isPickedPokemonsShuffling, setIsPickedPokemonsShuffling] = useState(
		false
	);
	const [score, setScore] = useState({
		current: 0,
		best: parseInt(localStorage.getItem('bestScore'), 10) || 0,
	});
	const [isWinner, setIsWinner] = useState(undefined);

	function resetState() {
		setPickedPokemons([]);
		setSelectedCards([]);
		setIsPickedPokemonsShuffling(false);
		setScore((prevScore) => ({
			current: 0,
			best: parseInt(localStorage.getItem('bestScore'), 10) || prevScore.best,
		}));
		setIsWinner(undefined);
	}

	async function getCompletePokemonData(pokemonUrl) {
		try {
			const pokemonData = await fetchData(pokemonUrl);
			return pokemonData;
		} catch (err) {
			console.log(err);
		}
	}

	async function getPokemonsCompleteData(pokemonUrls) {
		try {
			const completePokemonsData = await Promise.all(
				pokemonUrls.map(async (pokemonUrl) => {
					return getCompletePokemonData(pokemonUrl);
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
		const incRandomPokemonsUrl = incRandomPokemonsData.map((incPokemonData) => {
			return incPokemonData.url;
		});
		const randomPokemons = await getPokemonsCompleteData(incRandomPokemonsUrl);
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
		setPickedPokemons(shuffle(pickedPokemons));
		setIsPickedPokemonsShuffling(true);
		setTimeout(() => setIsPickedPokemonsShuffling(false), 300);
	}

	// Use effects

	useEffect(() => {
		pickPokemons();
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
		function storeBestScoreToLocalStorage(bestScore) {
			localStorage.setItem('bestScore', bestScore);
		}
		storeBestScoreToLocalStorage(score.best);
	}, [score]);

	useEffect(() => {
		function determineIfWinner(score) {
			if (score.current >= 20) {
				setIsWinner(true);
			}
		}
		determineIfWinner(score);
	}, [score]);

	useEffect(() => {
		function messageAndDetermineIfNewGame(selectedCards, score, isWinner) {
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
		messageAndDetermineIfNewGame(selectedCards, score, isWinner);
	}, [selectedCards, score, isWinner]);

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
			{pickedPokemons.length === 0 ? (
				<LoadingSpinner />
			) : isPickedPokemonsShuffling ? (
				<ShuffleSpinner />
			) : (
				<Cards items={pickedPokemons} onCardClick={handleCardClick} />
			)}
		</main>
	);
}

export default App;
