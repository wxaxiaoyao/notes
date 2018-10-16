import _ from "lodash";

const ENV = "local";

const defaultConfig = {
	apiUrlPrefix: "http://api.wxaxiaoyao.com/api/v0/",
	origin: "http://wxaxiaoyao.cn",
	urlPrefix: "note",
	port: 3000,
}

const productionConfig = {
}

const developmentConfig = {
}

const localConfig = {
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
