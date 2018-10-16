
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],

	data: function() {
		return {
			editorUrl:"/note/editor",
		}
	},

	mounted() {
		const pathname = window.location.pathname;
		const paths = pathname.split("/");
		if (paths.length > 3 && this.user && paths[1] == this.user.username) {
			this.editorUrl = "/note/editor#" + pathname.substring(1);
		}
	}
}
