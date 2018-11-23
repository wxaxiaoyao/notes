import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

const resourceName = "bugs";

export default {
	mixins:[mod],

	data: function() {
		return {
			list:[],
			projects:[],
			states: [
			{label:"INIT 初始状态", value:0},
			{label:"OPEN 打开状态", value:1},
			{label:"TEST 测试状态", value:2},
			{label:"PASS 测试通过", value:3},
			{label:"NOPASS 测试不通过", value:4},
			{label:"CLOSE 关闭状态", value:5},
			],
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
			const projects = {};
			const states = {};
			_.each(this.states, o => states[o.value] = o.label);
			_.each(this.projects, o => projects[o.id] = o.name);

			//const {classify} = this.__data__ || {};
			const list = (await this.api[resourceName].get(query)).data || [];
			_.each(list, o => {
				o.statestr = states[o.state];
				o.projectstr = projects[o.projectId];
			});

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

		async loadProjects() {
			const {userId} = this.authenticated();
			const result = await this.api.projects.search({
				"$or": {
					userId,
					members: {
						"$like": `|${userId}|`,
					}
				}
			});
			this.projects = result.data || [];

			const options = [];
			_.each(this.projects, o => options.push({label:o.name, value:o.id}));
			this.inputsQueryData.fields.projectId.options = options;
		}
	},

	mounted() {
		this.inputsQueryData.fields.state.options = this.states;
	}
}
