import Axios from "axios";

export const axios = Axios.create({
	baseURL: location.origin + process.env.NODE_ENV === 'production' ? '/dasung' : ''
})