import vue from "vue";
import {app} from "./init.js";
import storage from "@/lib/storage.js";
import indexedDB from "@/lib/indexedDB.js";
import upload from "@/api/qiniu.js";

vue.set(app, "isSmallScreen",window.innerWidth < 768);
app.storage = storage;
app.indexedDB = indexedDB;
app.upload = upload;

indexedDB.open().then(function(){
	app.pageDB = indexedDB.getStore("sitepage");
});

app.getRouteName = (name) => app.config.urlPrefix + "-" + name;

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

window.onresize = () => {
	vue.set(app, "isSmallScreen", window.innerWidth < 768);
}
