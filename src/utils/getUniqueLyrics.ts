export const getUniqueLyrics = (lyrics: string[]) => {
	return [...new Set(lyrics)].map((lyric) => lyric.toLowerCase());
};
