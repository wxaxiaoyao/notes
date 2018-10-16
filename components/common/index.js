import vue from "vue";

import tag from "./tag.js";
import objectEditor from "./objectEditor/index.vue";
import mods from "./mods.vue";

var components = {
	tag,
	objectEditor,
	mods,
}


for (var key in components) {
	vue.component(key, components[key]);
}
