import vue from "vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import _ from "lodash";
import jwt from "jwt-simple";
import io from "socket.io-client";

import EVENTS from "@/lib/events.js";
import config from "@/config.js";

// 定义事件对象
const events = new vue();

const portraits = [
	"http://statics.qiniu.wxaxiaoyao.cn/portraits/1.jpg",
];

export default {
	data: function() {
		return {
			EVENTS:EVENTS,
			api: g_app.api,
		}
	},

	props: {
		namespace: {
			type: String,
		},
	},

	computed: {
		...mapGetters({
			msg: "msg",
			token: "token",
			user: "user",
			isAuthenticated: "isAuthenticated",
			getData: "getData",
		}),
		authUserId() {
			if (this.user && this.user.id) return this.user.id;
			return 0;
		},
		authUsername() {
			if (this.user && this.user.username) return this.user.username;
			return "";
		},
		systemPortrait() {
			const index = _.random(0, portraits.length - 1);
			return portraits[index];
		},
		isSmallScreen() {
			return this.$store.state.isSmallScreen;
		},
		editorMode() {
			return this.getData("__editor_mode__")  || "normal";
		},
		currentUrl() {
			return this.getData("__currentUrl__");
		},
		currentContent() {
			return this.getData("__currentContent__");
		},
		socket() {
			return this.getData("__socket__");
		},
	},

	methods: {
		...mapMutations({
			setUser: "setUser",
			setToken: "setToken",
			setMsg: "setMsg",
		}),
		initSocket() {
			const user = jwt.decode(this.token, null, true);
			if (!user || !user.userId) { 
				console.log("token 无效", this.token);
				return ;
			}

			if (g_app.socket) {
				console.log("socket already exist");
				return app.socket;
			}

			const socket = io(config.socketUrl, {
				query: {
					token: this.token,
					userId: user.id || user.userId,
				},
				transports: ['websocket'],
			});


			socket.on("connect", () => {
				console.log("socket connect successful", socket);
				this.setData("__socket__", socket);
			});

			socket.on("disconnect", msg => {
				console.log("socket disconnect", msg);
				app.socket = undefined;
				this.setData("__socket__", undefined);
			});

			socket.on("error", e => {
				console.log("socket error", e);
			});

			g_app.socket = socket;

			return socket;
		},
		authenticated() {
			if (this.isAuthenticated) return {...this.user, userId:this.user.id};

			this.$router.push({path:"/note/users/login"});
		},
		setShareData(key, data) {
			g_app.setData(key, data);
		},
		getShareData(key, defaultValue) {
			return g_app.getData(key, defaultValue);
		},
		setData(key, data, replace=false) {
			data = _.cloneDeep(data);
			if (!replace && typeof(data) == "object") data = _.merge({}, this.getData(key), data);
			this.$store.commit("setData", {[key]:data});
		},
		on(eventName, callback) {
			events.$on(eventName, callback);
		},
		emit(eventName, ...args) {
			events.$emit(eventName, ...args);
		},
		push(path, data = {}) {
			g_app.storage.sessionStorageSetItem(path, _.cloneDeep(data));
			this.$router.push({path});
		},
		go(number) {
			this.$router.go(number);
		},
		setEditorMode(mode) {
			this.setData("__editor_mode__", mode);
		},
		setCurrentUrl(url) {
			this.setData("__currentUrl__", url);
		},
		setCurrentContent(content) {
			this.setData("__currentContent__", content || "");
		},
	},

	beforeMount() {
	},

}

