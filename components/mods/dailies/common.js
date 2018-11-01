
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

const resourceName = "dailies";

export default {
	mixins:[mod],

	data: function() {
		return {
			// 搜索框数据
			inputsSearchData: {
				field:"content",
				fields: [
					{label:"内容", value:"content"},
					{label:"日期", value:"date"},
					{label:"标签", value:"tags"},
				],
				change: (str, field) => this.handleSearchChange(str, field),
			},
			// tags 过滤
			filterTags:[],
			// 列表数据
			list:[],
		}
	},

	methods: {
		filterTagMethod(value, row) {
			return row.tags.indexOf(`|${value}|`) >= 0;
		},

		filterHandler(value, row, column) {
        	const property = column['property'];
        	return row[property] === value;
      	},

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

		initData(data) {
			if (!data.tags) return;

			const ts = (data.tags || "").split("|").filter(t => t);
			data.tagsData = {tags:ts};
		},

		async loadData() {
			if (this.__data__.id && !this.__data__.loaded) {
				const data = (await this.api[resourceName].getById({id:this.__data__.id})).data || {};
				_.merge(this.__data__, data);
				this.initData && this.initData(this.__data__);
			} else {
				this.initData && this.initData(this.__data__);
			}

			_.each(this.__data__, (val, key) => this.data[key] = val);
		},

		async loadDatas() {
			//const {classify} = this.__data__ || {};
			const list = (await this.api[resourceName].get({"x-order":"date-desc"})).data || [];
			let tags = [];
			_.each(list, o => {
				this.initData && this.initData(o);
				const ts = (o.tags || "").split("|").filter(t => t);
				tags = tags.concat(ts);
				o.tagsData = {tags:ts};
			});

			this.filterTags = [];
			_.each(_.uniq(tags), val => this.filterTags.push({text:val, value:val}));

			this.list = list;
			this.lists = list;
			return list;
		},
	},
}
