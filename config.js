import _ from "lodash";

const ENV = process.env.NODE_ENV;
console.log(ENV);
const defaultConfig = {
	apiUrlPrefix: "http://api.wxaxiaoyao.com/api/v0/",
	urlPrefix: "note",
	port: 3000,
}

const productionConfig = {
}

const developmentConfig = {
	apiUrlPrefix: "http://xiaoyao.com:3001/api/v0/",
	origin: "http://xiaoyao.com:3000",
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


config.print = function() {
	console.log("ENV:" + ENV);
	console.log("address:" + config.host + ":" + config.port);
	console.log("baseUrl:" + config.baseUrl);
	console.log("database:", config.database);
	console.log("qiniu:", config.qiniu);
}

export default config;
