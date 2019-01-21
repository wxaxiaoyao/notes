
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

const resourceName = "notes";

export default {
	mixins:[mod],

	data: function() {
		return {
			dialogsConfirmData: {},
			searchValue:"",
			searchField:"aliasTitle",
			fields: [
			{label:"标题", value:"aliasTitle"},
			{label:"内容", value:"text"},
			],
			list:[],
			filterTags:[],
			tagsData:{tags:[], classify: 3},
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

		async clickEditBtn(x) {
			this.$router.push({path:`/note/${resourceName}/upsert?id=` + x.id});
		},

		clickNewBtn() {
			this.$router.push({path:`/note/${resourceName}/upsert`});
		},

		filterTagMethod(value, row) {
			return row.tags.indexOf(`|${value}|`) >= 0;
		},

		async saveData(back=true) {
			this.__data__.tags = this.tagsData.tags;
			this.__data__.text = this.editorData.text;
			const oper = this.__data__.id ? "update" : "create";
			const result = await this.api[resourceName][oper](this.__data__);
			if (result.isErr()) return this.$message({message:"提交失败"});

			if (back) {
				this.push(`/note/${resourceName}`);
			}
		},

		async loadData() {
			if (this.__data__.id) {
				const data = (await this.api[resourceName].getById({id:this.__data__.id})).data || {};
				_.merge(this.__data__, data);
			}
		},

		async loadDatas() {
			const list = (await this.api[resourceName].get({})).data || [];
			const tags = [];
			_.each(list, o => {
				o.aliasTitle = o.title || o.text.split("\n")[0];
				o.tagsData = {tags:o.classifyTags.map(o => o.tagname)};
				_.each(o.classifyTags, o => {
					tags.push(o.tagname);
				});
			});

			this.filterTags = [];
			_.each(_.uniq(tags), val => this.filterTags.push({text:val, value:val}));

			this.list = list;
			this.lists = list;
			return list;
		},
	},
}
