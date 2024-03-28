import Axios from "axios";

export const axios = Axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? process.env['HOST'] : undefined
})