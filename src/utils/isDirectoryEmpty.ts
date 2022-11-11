import * as fs from "fs";

export const isDirectoryEmpty = (dirname: string): Promise<boolean> =>
	fs.promises.readdir(dirname).then((files) => !files.length);
