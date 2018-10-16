
export default {
	computed: {
		__currentUrl__() {
			return this.getData("__currentUrl__");
		},
	},

	watch: {
		__currentUrl__(url) {
			const path = url || "临时页";

			if (path == this.__data__.path) return;

			this.parsePath(path);
		}
	},
}
