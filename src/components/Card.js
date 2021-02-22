import { titleCase } from '../lib/helpers';
import '../css/Card.css';

function Card(props) {
	const { item, onCardClick } = props;
	const itemNameTitleCased = titleCase(item.name);

	return (
		<div
			className="Card card h-100 cursor-pointer"
			data-name={item.name}
			onClick={onCardClick}
		>
			<img src={item.image} className="card-img-top" alt={itemNameTitleCased} />
			<div className="card-body d-flex justify-content-center align-items-end">
				<p className="card-text">{itemNameTitleCased}</p>
			</div>
		</div>
	);
}

export default Card;
