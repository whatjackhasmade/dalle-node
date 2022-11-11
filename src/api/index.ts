import fetch, { RequestInit } from "node-fetch";
import { GenerateResponse } from "./types";

const bearerToken = process.env.BEARER_TOKEN;
const baseURL = "https://labs.openai.com/api/labs";

const requestOptions: RequestInit = {
	headers: {
		Authorization: "Bearer " + bearerToken,
		"Content-Type": "application/json",
	},
};

export const getTask = async (id: string): Promise<GenerateResponse> => {
	const res = await fetch(`${baseURL}/tasks/${id}`, requestOptions);
	return (await res.json()) as GenerateResponse;
};

export const generate = async (prompt: string) => {
	fetch(`${baseURL}/tasks`, {
		body: JSON.stringify({
			task_type: "text2im",
			prompt: {
				caption: prompt,
				batch_size: 4,
			},
		}),
		method: "POST",
		...requestOptions,
	})
		.then((res) => res.json())
		.then(async (task) => {
			if (task?.error?.message) throw new Error(task.error.message);

			const refreshIntervalId = setInterval(async () => {
				task = await getTask(task.id);

				switch (task.status) {
					case "succeeded":
						clearInterval(refreshIntervalId);
						return task.generations;
					case "rejected":
						clearInterval(refreshIntervalId);
						return new Error(task.status_information);
					case "pending":
				}
			}, 2000);
		})
		.catch((error) => {
			console.error(error);
		});
};

type ListResponse = {
	object: string;
	data: GenerateResponse[];
	offset: number;
	limit: number;
	page: number;
	total_models: number;
	total_pages: number;
	start: number;
	end: number;
};

export const list = async (
	options: { limit?: number; fromTs?: number } = { limit: 50, fromTs: 0 }
): Promise<ListResponse> => {
	const res = await fetch(
		`${baseURL}/tasks?limit=${options.limit}${
			options.fromTs ? `&from_ts=${options.fromTs}` : ""
		}`,
		requestOptions
	);

	return (await res.json()) as ListResponse;
};

export interface CreditsResponse {
	aggregate_credits: number;
	next_grant_ts: number;
	breakdown: {
		free: number;
	};
	object: string;
}

export const getCredits = async (): Promise<CreditsResponse> => {
	const res = await fetch(`${baseURL}/billing/credit_summary`, requestOptions);
	return (await res.json()) as CreditsResponse;
};
