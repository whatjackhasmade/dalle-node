import { list, getCredits, generate } from "./api";
import { lyrics } from "./const/lyrics/riders-on-the-storm";
import { downloadImagesFromAPI } from "./utils";

const creditsLeft = async () => (await getCredits()).aggregate_credits;

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
	const credits = await creditsLeft();

	// If we have more than 30 credits, generate a new image from an unused lyric
	if (credits > 30) {
		await generate(lyricsNotYetGenerated[0]);
	}

	// We wait 10 seconds to make sure the image is generated
	await new Promise((resolve) => setTimeout(resolve, 10000));

	// We then download all of the images we have generated in the API
	await downloadImagesFromAPI(runs);
})();
