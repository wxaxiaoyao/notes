import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			header:{},
			inputsQueryData: {
				values:[],
				fields: {
					title:{
						label:"标题",
						type:"input",
					},
					projectId: {
						label:"项目",
						type:"select",
						options:[],
						number: true,
					},
				},
			},
			projects:[],
			onlytest: false,
			types:[
			{label:"字符串", value:'string'},
			{label:"数字", value:"number"},
			{label:"布尔", value:"boolean"},
			{label:"对象", value:"object"},
			{label:"数组", value:"array"},
			],
			method:"",
			baseURL:"",
			classify:"",
			request:{},
			response:{status:200, statusText:"OK", data:"", headers:""},
			config: {
				baseUrls:[],
				headers:[],
				fields:[],
				classify:[],
			},
			defaultData: {
				method:"get",
			},
			headers:[],
			params:[],
			datas:[],

			apis:[],

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
				},
				queryCB: data => this.search(data),
			}
		}
	},

	methods: {
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
			const projects = result.data || [];
			const options = [];
			_.each(projects, o => options.push({label:o.name, value:o.id}));

			this.projects = options;
			this.inputsQueryData.fields.projectId.options = options;
		},

		handleSelectChange(type) {
			if (type == "classify") {
				this.__data__.classify = this.classify;
			} else if (type == "baseurl") {
				this.__data__.baseURL = this.baseURL;
			} else if (type == "method") {
				this.__data__.method = this.method;
			} else if (type == "field") {
				const index = _.findIndex(this.config.fields, o => o.key == this.paramKey);
				if (index < 0) return;
				const field = this.config.fields[index];
				this.paramType = field.type;
				this.paramDescription = field.description;
			} else if (type == "header") {
				const index = _.findIndex(this.config.headers, o => o.key == this.headerKey);
				if (index < 0) return;
				const x = this.config.headers[index];
				this.headerValue = x.value;
				this.headerDecription = x.description;
			} else if (type == "data") {
				const index = _.findIndex(this.config.fields, o => o.key == this.dataKey);
				if (index < 0) return;
				const field = this.config.fields[index];
				this.dataType = field.type;
				this.dataDescription = field.description;
			} else {
				return;
			}
		},

		async clickSubmitBtn() {
			this.__data__.headers = this.headers;
			this.__data__.params = this.params;
			this.__data__.datas = this.datas;
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api.apis[oper](this.__data__);

			if (result.isErr())  return this.$message({message:"提交失败"});

			this.$message({message:"提交成功"});

			this.$router.push({path:"/note/apis"});
		},	

		clickListBtn() {
			this.$router.push({path:"/note/apis"});
		},

		async loadConfig() {
			this.config = (await this.api.apis.getConfig()).data || this.config;
		},

		async loadData() {
			if (this.__data__.id && !this.__data__.loaded) {
				const data = (await this.api.apis.getById({id:this.__data__.id})).data || {};
				_.merge(this.__data__, data);
			}

			if (this.__data__.oper == "create") delete this.__data__.id;
			if (this.__data__.oper == "test") this.onlytest = true;
			this.classify = this.__data__.classify;
			this.method = this.__data__.method;
			this.baseURL = this.__data__.baseURL;
			this.response = {...this.response, ...(this.__data__.response || {})};
			this.headers = this.__data__.headers || [];
			this.params = this.__data__.params || [];
			this.datas = this.__data__.datas || [];
			
		},

		async loadDatas(query = {}) {
			const projects = {};
			const apis = (await this.api.apis.get(query)).data || [];
			
			_.each(this.projects, o => projects[o.value] = o.label);
			_.each(apis, api => {
				api.loaded = true;
				api.projectLabel = projects[api.projectId || 0] || ""; 
			});

			this.apis = apis;

			return apis;
		},
	},

	async mounted() {
	},
}
