import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

const resourceName = "experiences";

export default {
	mixins:[mod],

	data: function() {
		return {
			list:[],
			dialogsConfirmData: {},
			inputsQueryData: {
				values:[],
				fields: {
					title:{
						label:"标题",
						type:"input",
					},
					projectId:{
						label:"项目",
						type:"select",
						options:[],
						number: true,
					},
					state: {
						label:"状态",
						type:'select',
						number: true,
						options:[],
					}
				},
				queryCB: data => this.search(data),
			}
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

		async search(data) {
			const query = {};
			_.each(data.values, value => {
				const field = data.fields[value.key];
				const val = value.value || "";
				if (field.type == "input") {
					query[value.key + "-like"] = "%" + val + "%";
				} else {
					query[value.key] = field.number ? _.toNumber(val) : val;
				}
			});

			await this.loadDatas(query);
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

		async saveData() {
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api[resourceName][oper](this.__data__);
			if (result.isErr()) return this.$message({message:"提交失败"});

			this.push(`/note/${resourceName}`);
		},
		
		async loadDatas(query = {}) {
			const list = (await this.api[resourceName].get(query)).data || [];
			this.list = list;
			this.lists = list;
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

			return this.__data__;
		},

		async saveData() {
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api[resourceName][oper](this.__data__);
			if (result.isErr()) return this.$message({message:"提交失败"});

			this.push(`/note/${resourceName}`);
		},
	},

	mounted() {
		this.inputsQueryData.fields.state.options = this.states;
	}
}
