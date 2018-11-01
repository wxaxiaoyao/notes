
import _ from "lodash";

import mod from "@/components/mods/common/mod.vue";

const resourceName = "tags";

export default {
	mixins: [mod],

	data: function() {
		return {
			tags:[],
		}
	},

	methods: {
		async loadDatas() {
			const list = (await this.api[resourceName].get()).data || [];
			const tags = [];
			_.each(list, x => tags.push(x.name));

			this.tags = tags;
			return tags;
		},
	}
}
