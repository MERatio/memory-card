import '../css/Scoreboard.css';

function Scoreboard(props) {
	const { score } = props;
	return (
		<div className="Scoreboard d-flex flex-column h5 px-4 mb-0 mx-auto">
			<div>
				<p className="font-weight-bold">Score:</p>
				<span>{score.current}</span>
			</div>
			<div>
				<p className="font-weight-bold">Best Score:</p>
				<span>{score.best}</span>
			</div>
		</div>
	);
}

export default Scoreboard;
