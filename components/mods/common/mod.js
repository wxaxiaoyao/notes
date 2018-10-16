
import _ from "lodash";

import {mapGetters, mapActions, mapMutations} from "vuex";

import common from "./common.js";

export default {
	mixins: [common],

	props: {
		__style__: {
			type: String,
		}
	},
	
	computed: {
		...mapGetters({
		}),
	},

	watch: {
		//__data__() {
			//const data = this.getModData(this.__key__);
			//const blockData = this.getShareData("blockData") || {};
			//const block = blockData[this.__key__];
			//console.log(this.__key__);
			//if (!this.__key__ || !block || block.name == "markdowns") return;
			//if (JSON.stringify(data) == JSON.stringify(block.data)) return;
			////console.log(JSON.stringify(block.data));
			////console.log(JSON.stringify(data));
			////return;
			//this.emit(this.EVENTS.__EVENT__CODEMIRROR__IN__TEXT_REPLACE__, {
				//from: block.start,
				//to: block.end,
				//data: data,
			//});
		//}
	},
	methods: {
	},

	mounted() {
	},

	destroyed() {

	}
}
