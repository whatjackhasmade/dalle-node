import { list, getCredits, generate } from "./api";
import allLyrics from "./const/lyrics/riders-on-the-storm";
import { downloadImagesFromAPI, getUniqueLyrics } from "./utils";

const creditsLeft = async () => (await getCredits()).aggregate_credits;

const lyrics = getUniqueLyrics(allLyrics);

(async () => {
	// Get the last 50 runs
	const completedRuns = await list({
		limit: 50,
	});

	// These are the list of runs that have already been completed
	// A run is a single prompt and the generations that were generated for it
	const runs = completedRuns.data;

	// We generate a list a of the prompts we have already used/completed
	const promptsWeHaveAlreadyUsed = runs.map((run) =>
		run.prompt.prompt.caption.toLowerCase()
	);

	// We filter out the prompts we have already used
	// from the list of prompts we want to use (our song lyrics)
	const lyricsNotYetGenerated = lyrics.filter(
		(lyric) => !promptsWeHaveAlreadyUsed.includes(lyric)
	);

	// Check how many credits are left
	let credits = await creditsLeft();

	// If we have more than 30 credits, generate a new image from an unused lyric
	for (const lyric of lyricsNotYetGenerated) {
		if (credits > 30) {
			await generate(lyric);
			console.log(`Generated images for ${lyric}`);
		} else {
			console.log(`We have ${credits} credits left`);
		}
	}

	// We wait 10 seconds to make sure the image is generated
	console.log(`Waiting for images to be generated...`);
	await new Promise((resolve) => setTimeout(resolve, 10000));
	console.log(`Done waiting`);

	// We then download all of the images we have generated in the API
	console.log(`Downloading images...`);
	await downloadImagesFromAPI(runs);
	console.log(`Downloaded images`);
})();
