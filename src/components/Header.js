function Header(props) {
	const { classes } = props;
	return (
		<header className={`${classes} text-center`}>
			<h1>Memory Card</h1>
			<p className="h5">Click on any card once</p>
		</header>
	);
}

export default Header;
