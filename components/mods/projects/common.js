
import mod from "@/components/mods/common/mod.js";

const resourceName = "projects";

export default {
	mixins:[mod],

	data: function() {
		return {
			list:[],
			dialogsConfirmData: {},
		}
	},

	methods: {
		clickListBtn() {
			this.push(`/note/${resourceName}`);
		},

		async clickEditBtn(x) {
			this.$router.push({path:`/note/${resourceName}/upsert?id=` + x.id});
		},

		clickNewBtn() {
			this.$router.push({path:`/note/${resourceName}/upsert`});
		},

		async clickDeleteBtn(x, index) {
			this.dialogsConfirmData = {
				visible: true,
				title:"删除确认",
				content:"确定要删除此条记录?",
				success: async () => {
					const result = await this.api[resourceName].delete({id:x.id});
					if (result.isErr()) return this.$message({message:"删除失败"});
					this.list.splice(index, 1);
				}
			};
		},

		async loadDatas(query = {}) {
			const list = (await this.api[resourceName].get(query)).data || [];
			this.list = list;

			return list;
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
