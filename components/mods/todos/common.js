
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

const resourceName = "todos";

export default {
	mixins: [mod],

	data: function() {
		return {
			dialogsConfirmData: {},
			inputsSearchData: {
				field:"title",
				fields: [
					{label:"标题", value:"title"},
				],
				change: (str, field) => this.handleSearchChange(str, field),
			},
			list:[],
			filterTags:[],

			data: {
				tagsData:{tags:[]},
				state:0,
				rate:0,
			},
		}
	},

	filters: {
		dataFilters(data) {
			return _.cloneDeep(data);
		}
	},

	methods: {
		handleSearchChange(str, field) {
			this.list = [];
			_.each(this.lists, x => {
				const value = x[field];
				if (g_app.util.lcs(value, str) == str.length) {
					this.list.push(x);
				}
			});
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

		clickListBtn() {
			this.push(`/note/${resourceName}`);
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
			const tagsData = this.data.tagsData;
			this.data.tags = tagsData.tags.length == 0 ? "|" : "|" + tagsData.tags.join("|") + "|";
			const oper = this.data.id ? "update" : "create";
			const result = await this.api[resourceName][oper](this.data);
			if (result.isErr()) return this.$message({message:"提交失败"});

			this.push(`/note/${resourceName}`);
		},

		async loadData() {
			if (this.__data__.id && !this.__data__.loaded) {
				const data = (await this.api[resourceName].getById({id:this.__data__.id})).data || {};
				this.alias && this.alias(data);
				_.merge(this.__data__, data);
			} else {
				this.alias && this.alias(this.__data__);
			}

			_.each(this.__data__, (val, key) => this.data[key] = val);
		},

		async loadDatas() {
			//const {classify} = this.__data__ || {};
			const list = (await this.api[resourceName].get({})).data || [];
			let tags = [];
			_.each(list, o => {
				this.alias && this.alias(o);
				tags = tags.concat(o.tags);
			});
			this.filterTags = [];
			_.each(_.uniq(tags), val => this.filterTags.push({text:val, value:val}));

			this.list = list;
			this.lists = list;
			return list;
		},

		alias(data = {}) {
			const statestr = {0:"未开始", 1:"行动中", 2:"已完成", 3:"已废弃"};
			const ratestr = {0:"不重要", 1: "不紧急", 2:"一般", 3:"重要", 4:"紧急"};
			data.statestr = statestr[data.state];
			data.ratestr = ratestr[data.rate];
			data.tags = _.isString(data.tags) ? data.tags.split("|").filter(o => o) : data.tags;
			data.tagsData = {tags: data.tags};
		}
	},
}
