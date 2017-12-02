import pokemonJSON from './pokemon.json';
import typesJSON from './types.json';
import trainersJSON from './trainers.json';
import homeDir from 'home-dir';

const path = homeDir('/.hyper_plugins/node_modules/hyper-pokemon/backgrounds/');
const pokecursorDir = homeDir('/.hyper_plugins/node_modules/hyper-pokemon/pokecursors/');

const extension = '.png';
const pokecursorExtension = '.gif';

function randomIndex( arrayLength ) {
	return Math.floor( Math.random() * arrayLength );
}

export const decorateConfig = config => {
	let keys;

	const {
		pokemon = 'pikachu',
		pokemonSyntax = 'light',
		unibody = 'true',
		pokecursor = 'false',
		poketab = 'false'
	} = config;

	// Get a random theme in case of an array
	let pokemonTheme = Array.isArray( pokemon ) ? config.pokemon[randomIndex( config.pokemon.length ) ] : pokemon;

	if ( pokemonTheme === 'random' ) {
		keys = Object.keys( pokemonJSON.pokemon );
	} else if ( pokemonTheme in typesJSON ) {
		keys = Object.keys( typesJSON[ pokemonTheme ] );
	} else if ( pokemonTheme in trainersJSON  ) {
		keys = Object.keys( trainersJSON[ pokemonTheme ] );
	}

	pokemonTheme = keys ? keys[ randomIndex( keys.length ) ] :  pokemonTheme.toLowerCase();

	const theme = ( pokemonTheme in pokemonJSON.pokemon )
		? pokemonJSON.pokemon[pokemonTheme]
		: pokemonJSON.default[pokemonSyntax];

	// Set theme colors
	const primary = unibody ? theme.unibody : theme.primary;
	const secondary = theme.secondary;
	const tertiary = theme.tertiary;
	const selectedColor = theme.primary;

	const syntax = {
			borderColor: primary,
			cursorColor: secondary,
			foregroundColor: secondary,
			backgroundColor: pokemonSyntax === 'light' ? '#FAFAFA': '#383A42',
			colors: {
				black: tertiary,
				red: secondary,
				green: tertiary,
				yellow: secondary,
				blue: secondary,
				magenta: secondary,
				cyan: secondary,
				white: secondary,
				lightBlack: tertiary,
				lightRed: secondary,
				lightGreen: secondary,
				lightYellow: secondary,
				lightBlue: secondary,
				lightMagenta: secondary,
				lightCyan: secondary,
				lightWhite: secondary
			}
	};

	let pathToTheme;
	let pathToPokecursor;
	const assemblePath = path + pokemonTheme + extension;
	const assemblePokecursorPath = pokecursorDir + pokemonTheme + pokecursorExtension;

	if ( process.platform === 'win32' ) {
		pathToTheme = assemblePath.replace( /\\/g, '/' );
		pathToPokecursor = assemblePokecursorPath.replace( /\\/g, '/' );
	} else {
		pathToTheme = assemblePath;
		pathToPokecursor = assemblePokecursorPath;
	}

	// Pokecursor settings
	const cursorVisibility = pokecursor ? 'transparent' : secondary;
	const cursorContent = pokecursor ? pathToPokecursor : '';
	// Poketab settings
	const tabContent = poketab ? pathToPokecursor : '';

	const cursorSelector = '.terminal-cursor';

	return Object.assign( {}, config,
		syntax,
		{
			cursorColor: cursorVisibility,
			termCSS: `
				${config.termCSS || ''}
				${cursorSelector} {
					position: relative;
				}
				${cursorSelector}::after {
					content: url("file://${cursorContent}");
					position: absolute;
					left: 0;
					right: 0;
					bottom: 0;
					top: 0;
					transform: translateY(-50%) translateX(-50%);
				}
				::selection {
					background: ${selectedColor} !important;
				}
				::-webkit-scrollbar-thumb {
					background-color: ${secondary};
					-webkit-box-shadow: none;
				}
				x-screen {
					background: transparent !important;
				}
			`,
			css: `
				${config.css || ''}
				.terms_terms {
				  background: url("file://${pathToTheme}") center;
				  background-size: cover;
				}
				.header_header, .header_windowHeader {
				  background-color: ${primary} !important;
				}
				.tab_textActive .tab_textInner::before {
				  content: url("file://${tabContent}");
				  position: absolute;
				  right: 0;
				  top: -4px;
				}
				.tabs_nav .tabs_list {
				  border-bottom: 0;
				}
				.tabs_nav .tabs_title,
				.tabs_nav .tabs_list .tab_tab {
				  color: ${secondary};
				  border: 0;
				}
				.tab_icon {
				  color: ${secondary};
				}
				.tab_icon:hover {
				  background-color: ${secondary};
				}
				.tabs_nav .tabs_list .tab_tab:not(.tab_active) {
				  background-color: rgba(0,0,0,0.1);
				}
				.tabs_nav .tabs_list {
				  color: ${primary};
				}
				.tab_tab::before {
				  content: '';
				  position: absolute;
				  bottom: 0;
				  left: 0;
				  right: 0;
				  height: 4px;
				  background-color: ${secondary};
				  transform: scaleX(0);
				  transition: none;
				}
				.tab_tab.tab_active::before {
				  transform: scaleX(1);
				  transition: all 400ms cubic-bezier(0.0, 0.0, 0.2, 1)
				}
				.terms_terms .terms_termGroup .splitpane_panes .splitpane_divider {
				  background-color: ${secondary} !important;
				}
			`
		}
	);
};


