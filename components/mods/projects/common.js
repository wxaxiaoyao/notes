
import mod from "@/components/mods/common/mod.js";

const resourceName = "projects";

export default {
	mixins:[mod],

	methods: {
		clickListBtn() {
			this.push(`/note/${resourceName}`);
		},

		async loadData() {
			if (this.__data__.id && !this.__data__.loaded) {
				const data = (await this.api[resourceName].getById({id:this.__data__.id})).data || {};
				_.merge(this.__data__, data);
				this.initData && this.initData(this.__data__);
			} else {
				this.initData && this.initData(this.__data__);
			}
		},

		async saveData() {
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api[resourceName][oper](this.__data__);
			if (result.isErr()) return this.$message({message:"提交失败"});

			this.push(`/note/${resourceName}`);
		},
	}
}
