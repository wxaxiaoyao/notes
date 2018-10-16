import _ from "lodash";

const defaultConfig = {
	urlPrefix: "note",
	pageSuffix:".md",

	host: "0.0.0.0",
	port: 3000,
	domain: "wxaxiaoyao.cn",
	origin: "http://wxaxiaoyao.cn",
	baseUrl: "/api/v0/",

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
		facebook: {
			clientId: "1942795522419535",
			clientSecret: "1f7bc8761f32b2c8a0923ecc5ebc8b5e",
			redirectUri: 'https://wxa.keepwork.com/api/wiki/auth/facebook',
			authorizationEndpoint: 'https://www.facebook.com/v3.0/dialog/oauth',
		},
	}
}

const productionConfig = {
	host: "0.0.0.0",
	port: 3000,
	domain: "wxaxiaoyao.cn",
	origin: "http://wxaxiaoyao.cn",
	baseUrl: "/api/v0/",
}

const developmentConfig = {
	host: "0.0.0.0",
	port: 3000,
	domain: "xiaoyao.com",
	origin: "http://xiaoyao.com:3000",
	baseUrl: "/api/v0/",
}

const localConfig = {
	host: "0.0.0.0",
	port: 3000,
	domain: "xiaoyao.com",
	origin: "http://xiaoyao.com:3000",
	baseUrl: "/api/v0/",
}

const configs = {
	"production": _.merge({}, defaultConfig, productionConfig),
	"development": _.merge({}, defaultConfig, developmentConfig),
	"local": _.merge({}, defaultConfig, localConfig),
}

export default configs;
