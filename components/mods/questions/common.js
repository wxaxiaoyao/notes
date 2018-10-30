
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

const resourceName = "questions";

export default {
	mixins:[mod],

	data: function() {
		return {
			searchValue:"",
			searchField:"title",
			fields: [
			{label:"标题", value:"title"},
			],
			list:[],
			filterTags:[],
			tagsData:{tags:[]},
		}
	},

	filters: {
		dataFilters(data) {
			return _.cloneDeep(data);
		}
	},

	watch: {
		searchValue: function(str) {
			this.handleSearchChange(str);
		},
	},

	methods: {
		handleSelectField() {
			this.searchValue = "";
		},

		handleSearchChange(str = "") {
			this.list = [];
			_.each(this.lists, x => {
				const value = x[this.searchField];
				if (g_app.util.lcs(value, str) == str.length) {
					this.list.push(x);
				}
			});
		},

		clickListBtn() {
			this.push(`/note/${resourceName}`);
		},

		async clickDeleteBtn(x, index) {
			const result = await this.api[resourceName].delete({id:x.id});
			if (result.isErr()) return this.$message({message:"删除失败"});
			this.list.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:`/note/${resourceName}/upsert?id=` + x.id});
		},

		clickNewBtn() {
			this.$router.push({path:`/note/${resourceName}/upsert`});
		},

		filterTagMethod(value, row) {
			return row.tags.indexOf(`|${value}|`) >= 0;
		},

		async saveData() {
			this.__data__.tags = this.tagsData.tags.length == 0 ? "|" : "|" + this.tagsData.tags.join("|") + "|";
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api[resourceName][oper](this.__data__);
			if (result.isErr()) return this.$message({message:"提交失败"});

			this.push(`/note/${resourceName}`);
		},

		async loadData() {
			if (this.__data__.id && !this.__data__.loaded) {
				const data = (await this.api[resourceName].getById({id:this.__data__.id})).data || {};
				_.merge(this.__data__, data);
			}
		},

		async loadDatas() {
			//const {classify} = this.__data__ || {};
			const list = (await this.api[resourceName].get({})).data || [];
			let tags = [];
			_.each(list, o => {
				const ts = o.tags.split("|").filter(t => t);
				tags = tags.concat(ts);
			});
			this.filterTags = [];
			_.each(_.uniq(tags), val => this.filterTags.push({text:val, value:val}));

			this.list = list;
			this.lists = list;
			return list;
		},
	},
}
