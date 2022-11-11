import * as fs from "fs";
import slugify from "slugify";
import { downloadImage, isDirectoryEmpty } from ".";

import { GenerateResponse } from "../api/types";

export const downloadImagesFromAPI = async (runs: GenerateResponse[]) => {
	runs?.forEach(async (run) => {
		const { generations, prompt } = run;
		const promptSlug = slugify(prompt.prompt.caption.toLowerCase());

		const dir = `${process.cwd()}/images/${promptSlug}`;

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		const isEmpty = await isDirectoryEmpty(dir);

		if (isEmpty) {
			generations?.data?.forEach(async (generation) => {
				const image = generation.generation.image_path;
				await downloadImage(image, `${dir}/${generation.id}.jpg`);
			});
		}
	});
};
