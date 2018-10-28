import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
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
			response:{},
			config: {
				baseUrls:[],
				headers:[],
				fields:[],
			},
			defaultData: {
				method:"get",
				baseUrls:[],
				headers:[],
				params:[],
			},
		}
	},

	methods: {
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
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api.apis[oper](this.__data__);

			if (result.isErr())  return this.$message({message:"提交失败"});

			this.$message({message:"提交成功"});
		},	

		clickListBtn() {
			this.$router.push({path:"/note/apis"});
		},
	},

	async mounted() {
		this.config = (await this.api.apis.getConfig()).data || this.config;

		if (this.__data__.id && !this.__data__.loaded) {
			const data = (await this.api.apis.getById({id:this.__data__.id})).data || {};
			_.merge(this.__data__, data);
		}

		if (this.__data__.oper == "create") delete this.__data__.id;
		this.classify = this.__data__.classify;
		this.method = this.__data__.method;
		this.baseURL = this.__data__.baseURL;
		this.request = this.__data__.request || {};
		this.response = this.__data__.response || {};
	},
}
