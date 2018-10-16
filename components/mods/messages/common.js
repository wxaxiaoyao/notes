
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	computed: {
		currentSessionId() {
			return this.getData("__current_session_id__") || 0;
		},
	},
}
