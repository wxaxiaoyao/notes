import vue from "vue";
import _ from "lodash";

import modBaseMixin from "./modBase.js";
import modBase from "./modBase.vue";
import modText from "./modText.vue";
import modLink from "./modLink.vue";
import modMedia from "./modMedia.vue";
import modTest from "./modTest.vue";

const components = {
	modText,
	modLink,
	modMedia,
	modTest,
}

_.each(components, (val, key) => {
	//const baseCompName = _.camelCase("base-" + key);
	vue.component(key, {
		mixins:[modBaseMixin, modBase],

		components: {
			baseComp: {
				mixins: [modBaseMixin, val],
			} 
		},
	});
});

export default components;
