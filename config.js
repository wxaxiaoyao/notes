import _ from "lodash";

const ENV = process.env.NODE_ENV;
console.log(ENV);
const defaultConfig = {
	apiUrlPrefix: "http://api.wxaxiaoyao.com/api/v0/",
	log: {
		module: "note",
		level: "info",
	},

	tokenExpire: 3600 * 24 * 100,
	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "note", // 数据库名
		username: "wuxiangan",
		password: "", 
	},

	gitlab: {
		token: "",
	},

	qiniu: {
		accessKey:"",
		secretKey:"",
		bucketName: "note",
		bucketDomian: "http://qiniu.wxaxiaoyao.cn",
		// keepwork-dev
		//bucketName: "keepwork-dev",
		//bucketDomian: "http://oy41aju0m.bkt.clouddn.com",
	},

	email: {
		host: "smtp.exmail.qq.com",
		port: 587,
		user: "noreply@mail.keepwork.com",
		pass: "",
		from: "noreply@mail.keepwork.com",
	},

	sms: {
		serverIP: "app.cloopen.com",
		serverPort: "8883",
		softVersion: "2013-12-26",
		appId: "8a216da85d158d1b015d5a30365c1bfe",
		accountSid: "8a216da85cce7c54015ce86f168408f1",
		accountToken: "",
	},

	pingpp: {
		appId: "app_vTe5KO94GiL8nnfT",
	},

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
}

const developmentConfig = {
	apiUrlPrefix: "http://xiaoyao.com:3001/api/v0/",
	origin: "http://xiaoyao.com:3000",
	database: {
		//database: "note-dev",
		database: "note",
	}
}

const localConfig = {
	apiUrlPrefix: "http://xiaoyao.com:3001/api/v0/",
	origin: "http://xiaoyao.com:3000",
	port: 3000,
	database: {
		database: "note-dev",
	}
}

const testConfig = {
	host: "127.0.0.1",
	port: 4000,
	baseUrl: "/",
	database: {
		database: "note-dev",
	}
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
