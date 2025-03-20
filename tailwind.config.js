/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],

	theme: {
		extend: {
			fontFamily: {
				albulaLight: ['AlbulaLight', 'sans-serif'],
				albulaRegular: ['AlbulaRegular', 'sans-serif'],
				albulaMedium: ['AlbulaMedium', 'sans-serif'],
				albulaSemiBold: ['AlbulaSemiBold', 'sans-serif'],
				albulaBold: ['AlbulaBold', 'sans-serif'],
				albulaExtraBold: ['AlbulaExtraBold', 'sans-serif'],
				albulaHeavy: ['AlbulaHeavy', 'sans-serif'],

				googleSansThin: ['GoogleSans-Thin', 'sans-serif'],
				googleSansLight: ['GoogleSans-Light', 'sans-serif'],
				googleSansRegular: ['GoogleSans-Regular', 'sans-serif'],
				googleSansMedium: ['GoogleSans-Medium', 'sans-serif'],
				googleSansBold: ['GoogleSans-Bold', 'sans-serif'],
				googleSansBlack: ['GoogleSans-Black', 'sans-serif'],

				googleSansThinItalic: ['GoogleSans-ThinItalic', 'sans-serif'],
				googleSansLightItalic: ['GoogleSans-LightItalic', 'sans-serif'],
				googleSansRegularItalic: ['GoogleSans-RegularItalic', 'sans-serif'],
				googleSansMediumItalic: ['GoogleSans-MediumItalic', 'sans-serif'],
				googleSansBoldItalic: ['GoogleSans-BoldItalic', 'sans-serif'],
				googleSansBlackItalic: ['GoogleSans-BlackItalic', 'sans-serif'],
			},
		},
	},

	plugins: [],
};