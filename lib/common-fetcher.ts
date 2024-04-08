import axios from "axios";

export async function postFetcher(url: string, obj: any) {
	try {
		return await axios.post(url, obj);
	} catch (e) {
		console.error(e);
	}
}

export async function putFetcher(url: string, obj: any) {
	try {
		return await axios.put(url, obj);
	} catch (e) {
		console.error(e);
	}
}

export async function delFetcher(url: string, obj: any) {
	try {
		return await axios.delete(url, { data: obj });
	} catch (e) {
		console.error(e);
	}
}