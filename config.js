import _ from "lodash";
import serverConfig from "./server/.config.js";

const ENV = process.env.ENV || process.env.NODE_ENV;

console.log(process.env.ENV, "-------client-----");

const defaultConfig = {
	socketUrl:"http://39.106.11.114:3001/api/v0/socket",
	apiUrlPrefix: "http://api.wxaxiaoyao.cn/api/v0/",
	origin: "http://wxaxiaoyao.cn",
	domain: "wxaxiaoyao.cn",
	urlPrefix: "note",
	port: 3000,

	oauths: {
		note: {
			clientId: "100000",
		},
		github: {
			clientId: "5cc0cf681e677a56771b",
		},
		qq: {
			clientId:"101403344",
		},
		weixin: {
			clientId: "wxc97e44ce7c18725e",
		},
		xinlang: {
			clientId: "2411934420",
		},
	}
}

const productionConfig = {
}

const developmentConfig = {
	socketUrl:"http://xiaoyao.com:3001/",
	apiUrlPrefix: "http://xiaoyao.com:3001/api/v0/",
	origin: "http://xiaoyao.com:3000",
}

const localConfig = {
	socketUrl:"http://xiaoyao.com:3001/",
	apiUrlPrefix: "http://xiaoyao.com:3001/api/v0/",
	origin: "http://xiaoyao.com:3000",
}

const testConfig = {
	host: "127.0.0.1",
	port: 4000,
}

const configs = {
	"production": _.merge({}, defaultConfig, productionConfig),
	"development": _.merge({}, defaultConfig, developmentConfig),
	"local": _.merge({}, defaultConfig, localConfig),
	"test": _.merge({}, defaultConfig, testConfig),
}

const config =  configs[ENV];

export default config;
