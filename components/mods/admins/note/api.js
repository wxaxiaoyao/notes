
import config from "@/config.js";
import Api from "../commom/api.js";

const api = new Api({
	baseURL:config.apiUrlPrefix,
});

export default api;


