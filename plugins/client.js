import vue from "vue";
import axios from "axios";
import vueAxios from "vue-axios";
import vueAuthenticate from "vue-authenticate";
import createPersistedState from "vuex-persistedstate";
import mintUI from 'mint-ui';

import {app} from "./init.js";
import storage from "@/lib/storage.js";
import indexedDB from "@/lib/indexedDB.js";
import upload from "@/api/qiniu.js";
import config from "@/config.js";

vue.use(mintUI);

// global varible init
app.storage = storage;
app.indexedDB = indexedDB;
app.upload = upload;
indexedDB.open().then(function(){
	app.pageDB = indexedDB.getStore("sitepage");
});
app.getRouteName = (name) => app.config.urlPrefix + "-" + name;


// window iframe init
window.addEventListener("message", function(e) {
	const FAIL = {cmd: "fail"};
	const SUCCESS = {cmd: "success"};

	function postMessage(data, origin) {
		origin = origin || "*";
		data = data || SUCCESS;
		e.source.postMessage(data, origin);
	}

	const data = e.data || {}

	if (data.cmd == "element_style") {
		const selector = data.selector;
		const style = data.style || {};
		const el = document.getElementById(selector);

		if (!el) {
			return postMessage(FAIL);
		}

		console.log(el, style);
		el.style.height = style.height;
		el.style.width = style.width;
	} else {
		//console.log("cmd not found", e);
		return;
	}

	postMessage(SUCCESS)
});

// authorization init
const baseUrl = config.apiUrlPrefix + "oauth_users/";
vue.use(vueAxios, axios);
vue.use(vueAuthenticate, {
	providers: {
		//note: {
			//name: "note",
			//authorizationEndpoint: config.origin + config.baseUrl + "oauthApps/authorize",
			//clientId: config.oauths.note.clientId,
			//redirectUri: window.location.origin + "/note/login",
			//url: baseUrl + "note",
			//oauthType: "2.0",
			//popupOptions: { width: 1020, height: 618  },
		//},

		xinlang: {
			name:"xinlang",
			authorizationEndpoint: "https://api.weibo.com/oauth2/authorize",
			clientId: config.oauths.xinlang.clientId,
			redirectUri: window.location.origin + "/note/login",
			url: baseUrl + "xinlang",
			oauthType: '2.0',
			popupOptions: { width: 1020, height: 618  },
		},

		weixin: {
			name:"weixin",
			oauthType: '2.0',
			authorizationEndpoint: "https://open.weixin.qq.com/connect/qrconnect",
			clientId: config.oauths.weixin.clientId,
			appid: config.oauths.weixin.appid || config.oauths.weixin.clientId,
			redirectUri: window.location.origin + "/note/login",
			url: baseUrl + "weixin",
			popupOptions: { width: 1020, height: 618  },
			scope:'snsapi_login',
			requiredUrlParams: ['scope', "appid", "state"],
			state: "weixin",
		},

		qq: {
			name:"qq",
			oauthType: '2.0',
			authorizationEndpoint: "https://graph.qq.com/oauth2.0/authorize",
			scope: "get_user_info",
			clientId: config.oauths.qq.clientId,
			redirectUri: window.location.origin + "/note/login",
			url: baseUrl + "qq",
			popupOptions: { width: 1020, height: 618  },
		},

		github: {
			name:"github",
			authorizationEndpoint: "https://github.com/login/oauth/authorize",
			scope: ['user:email'],
			scopeDelimiter: ' ',
			clientId: config.oauths.github.clientId,
			redirectUri: window.location.origin + "/note/login",
			url: baseUrl + "github",
		},
	}
});

// store init
export default ({store}) => {
	// window size init
	store.commit("setState", {isSmallScreen:window.innerWidth < 768});
	window.onresize = () => store.commit("setState", {isSmallScreen:window.innerWidth < 768});

	// store persisted
	createPersistedState({
		paths: ["user"],
	})(store);
	//createPersistedState({
		//storage: window.sessionStorage,
	//})(store);
}
