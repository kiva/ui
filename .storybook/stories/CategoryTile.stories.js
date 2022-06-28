import MainCategoryTile from '@/components/Categories/MainCategoryTile';

export default {
	title: 'Main Category Tile',
	component: MainCategoryTile,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MainCategoryTile },
		template: '<main-category-tile :tileSize="tileSize" :categoryName="categoryName" :categoryDescription="categoryDescription" :numberLoans="numberLoans" :image="image" :retinaImage="retinaImage" />',
	})
	template.args = args;
	return template;
};

export const Default = story({
	tileSize: 'small',
	categoryName: 'Food',
	categoryDescription: "These borrowers are fueling their communities with food (and love) at markets, small grocery stores and restaurants.",
	numberLoans: 1913,
	image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/ad03fb699615d7ea3061dd80220100c2.jpg",
	retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/2b5c9493edddac4fe3210cddb930ec47.jpg"
});

export const Large = story({
	tileSize: 'large',
	categoryName: 'Women',
	categoryDescription: "Worldwide, women have much less economic opportunity, security, and freedom. Support women starting their own businesses, going to school, and investing in the health of their communities and families.",
	numberLoans: 6216,
	image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/bd25843149e68a42a681f4bc00a660b8.jpg",
	retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/59b6320c2bb65324522c35619bc57932.jpg"
});

export const Medium = story({
	tileSize: 'medium',
	categoryName: 'Livestock',
	categoryDescription:  "Cows, pigs and other animals have the potential to dramatically increase farming incomes, but the initial cost can be a barrier. Help farmers invest in their futures.",
	numberLoans: 118,
	image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4c354e77bb8686416b8e0938884fe3d5.jpg",
	retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/4b28a0879c81077484e0ed28a18eba23.jpg"
});

export const Small = story({
	tileSize: 'small',
	categoryName: 'Health',
	categoryDescription: "Help families and communities access the medicine, surgeries and healthcare services they need.",
	numberLoans: 79,
	image: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w313h176/4682bd972ac323a6ba8cdc55ea75bd99.jpg",
	retinaImage: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w626h352/3b1616d297b2fd575934568882068ace.jpg"
 });

