import * as fs from "fs";
import fetch from "node-fetch";

export const downloadImage = async (url: string, path: string) => {
	const response = await fetch(url);
	const blob = await response.blob();
	// @ts-ignore
	const arrayBuffer = await blob.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	await fs.writeFile(path, buffer, () => {});
};
