import Card from './Card';

function Cards(props) {
	const { items } = props;

	const cards = items.map((item) => {
		return (
			<div key={item.name} className="col mb-4">
				<Card item={item} />
			</div>
		);
	});

	return (
		<div className="container">
			<div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">{cards}</div>
		</div>
	);
}

export default Cards;
