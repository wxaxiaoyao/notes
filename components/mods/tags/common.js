
import vue from "vue";
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

const resourceName = "tags";

export default {
	mixins: [mod],

	data: function() {
		return {
			tags:[],

			default_data: {
				tags:[],
				color:"white",
				size:"small",
			},
		}
	},

	methods: {
		async loadDatas() {
			const list = (await this.api[resourceName].get({classify:0})).data || [];
			const tags = [];
			_.each(list, x => tags.push(x.tagname));

			this.tags = tags;
			return tags;
		},
	}
}
