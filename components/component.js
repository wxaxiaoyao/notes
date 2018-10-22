import vue from "vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import _ from "lodash";
import jwt from "jwt-simple";

import EVENTS from "@/lib/events.js";
import config from "@/config.js";

// 定义事件对象
const events = new vue();

const portraits = [
	"http://pf0t54gda.bkt.clouddn.com/portraits/1.jpg",
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
			user: "user",
			isAuthenticated: "isAuthenticated",
			getData: "getData",
		}),
		userId() {
			if (this.user && this.user.id) return this.user.id;
			return 0;
		},
		username() {
			if (this.user && this.user.username) return this.user.username;
			return "";
		},
		systemPortrait() {
			const index = _.random(0, portraits.length - 1);
			return portraits[index];
		},
		isSmallScreen() {
			return g_app.isSmallScreen;
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
	},

	methods: {
		...mapMutations({
			setUser: "setUser",
			setMsg: "setMsg",
		}),
		authenticated() {
			if (this.isAuthenticated) return {...this.user, userId:this.user.id};

			this.$router.push({path:"/note/login"});
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
		pushName(name) {
			this.$router.push({name:config.urlPrefix + '-' + name});
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

