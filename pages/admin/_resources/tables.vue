
<template>
	<div class="table-container">
		<el-form class="query-container" :inline="true" :model="query" label-suffix=" :">
			<el-form-item v-for="(x, index) in opts.columns" :key="index" v-if="x.query" :label="x.label">
				<el-autocomplete v-if="isForeginKey(x)" v-model="query['auto-' + x.query]" @select='handleSelect' @focus="autocompleteFocus(x, 'query')" :fetch-suggestions="itemQuerySearch"></el-autocomplete>
				<el-input v-else v-model="query[x.query]" :placeholder="x.placeholder"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button v-if="isShowQueryBtn" type="primary" @click="clickQueryBtn">查询</el-button>
				<el-button type="primary" @click="clickNewBtn">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="items" @sort-change="sortChange">
			<el-table-column v-for="(x, index) in opts.columns" :key="index" v-if="!x.isHide" 
				:prop="x.prop" :label="x.label" :sortable="x.sort && 'custom'">
				<template slot-scope="{row, column, $index}">
					<div class="cell-input-container" v-if="isCellEditable(x, $index, index)">
						<el-autocomplete v-if="isForeginKey(x)" v-model="cell.value" @select='handleSelect' @focus="autocompleteFocus(x, 'cell')" :fetch-suggestions="itemQuerySearch"></el-autocomplete>
						<el-input v-else v-model="cell.realValue" :ref="cellKey($index, index)"></el-input>
						<el-button @click='clickCellModifyBtn(x, $index, index)'>修改</el-button>
						<el-button @click='clickCellCancelBtn(x, $index, index)'>取消</el-button>
					</div>
					<div v-else>
						<i v-if="x.editable" @click="clickCellEditBtn(x, $index, index)" class="el-icon-edit"></i>
						{{x.aliasprop ? row[x.aliasprop] : row[x.prop]}}
					</div>
				</template>
			</el-table-column>
			<el-table-column v-if="opts.actions.isShowActions" label="操作">
				<template slot-scope="{row, column, $index}">
					<el-button @click="clickEditItemBtn($index)">编辑</el-button>
					<el-button @click="clickDeleteItemBtn($index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="opts.pagination.currentPage"
			:page-sizes="opts.pagination.pageSizes"
			:page-size="opts.pagination.pageSize"
			:layout="opts.pagination.layout"
			:total="opts.pagination.total">
		</el-pagination>

		<el-dialog :title="isNewItem ? '新增' : '编辑'" :visible.sync="isShowEditDialog">
			<el-form ref="form" :model="item" label-width="80px">
				<el-form-item v-for="(x, index) in opts.columns" :key="index" :label="x.label" v-if="isNewItem || !x.isHide">
					<el-autocomplete v-if="isForeginKey(x)" :disabled="isNewItem ? x.prop == 'id' : !x.editable" v-model="item[x.aliasprop]" @select='handleSelect' @focus="autocompleteFocus(x, 'item')" :fetch-suggestions="itemQuerySearch"></el-autocomplete>
					<el-input v-else :disabled="isNewItem ? x.prop == 'id' : !x.editable" v-model="item[x.prop]"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isShowEditDialog=false">取消</el-button>
				<el-button @click="clickSubmitItemBtn">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import vue from "vue";
import _ from "lodash";
import {
	Dialog,
	Form,
	FormItem,
	Table,
	TableColumn,
	Pagination,
	Autocomplete,
} from "element-ui";


export default {
	components: {
		[Dialog.name]: Dialog,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Table.name]:Table,
		[TableColumn.name]: TableColumn,
		[Pagination.name]: Pagination,
		[Autocomplete.name]: Autocomplete,
	},

	props: {
		options: {
			type: Object,
		},
	},

	data: function() {
		return {
			opts: {
				actions: {
					isShowActions: true,
					editAction: true,
					deleteAction: true,
				},
				pagination: {
					total: 100,
					layout:"total, sizes, prev, pager, next, jumper",
					currentPage:0,
					pageSizes:[20, 30, 50, 100],
					pageSize:20,
				},
				columns: [
				],
			},
			items:[],
			cell:{value:"", rowIndex:-1, colIndex:-1,},
			cells:{},
			isShowEditDialog: false,
			itemIndex:0,
			item:{},
			isNewItem: false,
			query:{},
			querys:{},
			isShowQueryBtn:false,
		}
	},

	watch: {
		options: function(newVal) {
			this.initOpts(newVal);
		}	
	},

	methods: {
		initOpts(opts) {
			_.merge(this.opts, opts);
			this.isShowQueryBtn = this.isCanQuery();
			this.loadDatas();
		},

		cellKey(row, col) {
			return row + "-" + col;
		},

		isCellEditable(x, rowIndex, colIndex) {
			return this.cell.rowIndex == rowIndex && this.cell.colIndex == colIndex;
		},

		clickCellCancelBtn(x, rowIndex, colIndex) {
			this.cell.rowIndex = -1;
			this.cell.colIndex = -1;
		},

		clickCellModifyBtn(x, rowIndex, colIndex) {
			this.items[rowIndex][x.prop] = this.cell.realValue;
			if (x.aliasprop) this.items[rowIndex][x.aliasprop] = this.cell.value;

			this.clickCellCancelBtn(x, rowIndex, colIndex);

			const item = this.items[rowIndex];
			console.log(item);

			const api = this.opts.api;
			if (!api) return;
			api.update(item);
		},

		clickCellEditBtn(x, rowIndex, colIndex) {
			const self = this;
			if (!x.editable) return;
			
			const key = this.cellKey(rowIndex, colIndex);

			this.cell.value = x.aliasprop && self.items[rowIndex][x.aliasprop];
			this.cell.realValue = self.items[rowIndex][x.prop];
			this.cell.rowIndex = rowIndex;
			this.cell.colIndex = colIndex;

			setTimeout(() => {
				const elem = self.$refs[key];
				elem[0].focus();
			},10);
		},

		async clickDeleteItemBtn(rowIndex) {
			const data = this.items[rowIndex];
			const api = this.opts.api;

			this.items.splice(rowIndex, 1);
			if (!api) return;
			await api.destroy({id:data.id});
		},

		clickEditItemBtn(rowIndex) {
			const data = this.items[rowIndex];
			this.item = _.cloneDeep(data);
			this.itemIndex = rowIndex;
			this.isShowEditDialog = true;
		},

		async clickSubmitItemBtn() {
			const api = this.opts.api;
			if (!api) {
				this.isShowEditDialog = false;
				return;
			}

			const res = await api.upsert(this.item);
			if (res.isErr()) {
				this.$message({message:"提交失败", type:"error"});
				return;
			}

			if (!this.isNewItem) _.merge(this.items[this.itemIndex], this.item);

			this.isShowEditDialog = false;
			this.isNewItem = false;
		},

		handleSizeChange(val) {
			this.opts.pagination.pageSize = val;
		},

		handleCurrentChange(val) {
			this.opts.pagination.currentPage = val;
		},

		//async loadFieldDatas(x) {

		//}

		async loadDatas() {
			const api = this.opts.api;
			if (!api) return;

			this.query['x-per-page'] = this.opts.pagination.pageSize;
			this.query['x-page'] = this.opts.pagination.currentPage;

			const query = _.pickBy(this.query, (val, key) => this.querys[key] && val);
			//console.log(this.query, query);
			let res = await api.search(query);
			
			if (res.isErr()) {
				this.$message({type:"error", message:"获取数据列表错误"});
				return;
			}

			this.items = res.data || [];
			this.opts.pagination.total = res.total || this.items.length;

			for (let i = 0; i < this.opts.columns.length; i++) {
				const column = this.opts.columns[i];
				const aliasprop = column.aliasprop;
				const key = column.foreignKey || "id";
				if ((!column.api && !column.datas) || !aliasprop) continue;

				let ids = [];
				for (let j = 0; j < this.items.length; j++) {
					ids.push(this.items[j][column.prop]);
				}
				ids = _.uniq(ids);
				
				let datas = column.datas || [];
				if (column.api) {
					res = await column.api.search({[key + "-in"]: ids})
					datas = res.data || [];
				}

				for (let j = 0; j < this.items.length; j++) {
					const item = this.items[j];
					const index = _.findIndex(datas, o => o[key] == item[column.prop]);
					if (index>-1 && datas[index][aliasprop]) {
						vue.set(item, aliasprop, datas[index][aliasprop]);
					}
				}
			}
		},

		isCanQuery() {
			this.querys = {"x-order": true, "x-per-page": true, "x-page": true};
			let ok = false;
			for (let i = 0; i < this.opts.columns.length; i++) {
				if (this.opts.columns[i].query) {
					this.querys[this.opts.columns[i].query] = true;
					ok = true;
				};
			}

			return ok;
		},

		isForeginKey(x) {
			if (x.aliasprop) return true;
			return false;
		},

		async clickQueryBtn() {
			await this.loadDatas();
		},

		async sortChange({column, prop, order}) {
			//console.log(column, prop, order);
			if (!prop) return;
			this.query["x-order"] = prop + "-" + (order == "ascending" ? "asc" : "desc");
			await this.loadDatas();
		},

		clickNewBtn() {
			this.isNewItem = true;
			this.isShowEditDialog = true;
		},

		autocompleteFocus(x, type) {
			this.currentColumn = x;
			this.autocompleteType = type;
		},

		async itemQuerySearch(str, cb) {
			const x = this.currentColumn;
			const foreignKey = x.foreignKey || "id";
			const transformDatas = (datas) => {
				const list = [];
				_.each(datas, o => {
					list.push({
						value: o[x.aliasprop],
						realValue: o[foreignKey],
					});
				})

				return list;
			}

			str = str || "";
			//console.log(str, x.datas, x.aliasprop);
			if (x.datas) return cb(transformDatas(_.filter(x.datas, o => o[x.aliasprop].indexOf(str) == 0)));

			if (!x.api) return cb([]);

			const aliasprop = x.aliasprop;
			const res = await x.api.search({[aliasprop + "-like"]: str + "%"});
			const datas = res.data || [];

			return cb(transformDatas(datas));

		},

		handleSelect(item) {
			const x = this.currentColumn;
			const foreignKey = x.foreignKey || "id";
			//this.item[x.aliasprop] = item["value"];
			if (this.autocompleteType == "item") {
				this.item[x.prop] = item["realValue"];
			} else if (this.autocompleteType == "cell") {
				this.cell.value = item["value"];
				this.cell.realValue = item["realValue"];
			} else if (this.autocompleteType == "query") {
				this.query["auto-" + x.query] = item["value"];
				this.query[x.query] = item["realValue"];
			}
		}
	},

	async mounted() {
		this.initOpts(this.options);
	},
}
</script>

<style scoped>
.table-container {
	padding: 0px;
}
.query-container {
	padding:10px;
}
.cell-input-container {
	display: flex;
}
</style>
