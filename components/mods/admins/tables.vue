
<template>
	<div class="table-container" v-if="opts.api">
		<el-form class="query-container" :inline="true" :model="query" label-suffix=" :" size="mini">
			<el-form-item v-for="(column, index) in opts.columns" :key="index" v-if="column.query" :label="column.label">
				<el-select v-if="column.type == 'select'" 
					clearable remote :remote-method="column.search"
					@change="handleSelectChange(column, 'query')"
					v-model="query[column.query]" 
					filterable placeholder="请选择">
					<el-option v-for="item in column.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-input clearable v-else v-model="query[column.query]" :placeholder="column.placeholder"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="clickQueryBtn">查询</el-button>
				<el-button type="primary" @click="clickNewBtn">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="items" @sort-change="sortChange" size="mini">
			<el-table-column 
				v-for="(x, index) in opts.columns" :key="index" v-if="!x.isHide"
				:width="x.width" :min-width="x.minWidth"	
				:prop="x.prop" :label="x.label" :sortable="x.sort && 'custom'">
				<template slot-scope="{row, column, $index}">
					<div class="cell-container" data-toggle="tooltip" :title="x.propLabel ? row[x.propLabel] : row[x.prop]">
						<i v-if="x.editable" @click="clickCellEditBtn(x, $index, index)" class="el-icon-edit"></i>
						{{row[x.aliasprop || x.prop] || row[x.prop]}}
					</div>
				</template>
			</el-table-column>
			<el-table-column v-if="opts.actions.isShowActions" label="操作" width="160px">
				<template slot-scope="{row, column, $index}">
					<el-button size="mini" @click="clickEditItemBtn($index)">编辑</el-button>
					<el-button size="mini" @click="clickDeleteItemBtn($index)">删除</el-button>
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

		<el-dialog :title="column.label" :visible.sync="isShowEditCellDialog" width="500px">
			<div>
				<el-select v-if="column.type == 'select'" v-model="item[column.relateProp || column.prop]" filterable placeholder="请选择" clearable remote :remote-method="column.search" @change="handleSelectChange(column, 'item')">
					<el-option v-for="item in column.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-input clearable v-else-if="column.type == 'text'" type="textarea" :rows=2 v-model="item[column.prop]"></el-input>
				<el-input clearable v-else v-model="item[column.prop]"></el-input>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isShowEditCellDialog=false">取消</el-button>
				<el-button @click="clickSubmitItemBtn">确定</el-button>
			</span>
		</el-dialog>

		<el-dialog :title="isNewItem ? '新增' : '编辑'" :visible.sync="isShowEditDialog">
			<el-form ref="form" :model="item" label-width="100px" size="mini">
				<el-form-item v-for="(column, index) in opts.columns" :key="index" :label="column.label">
					<el-select v-if="column.type == 'select'" v-model="item[column.relateProp || column.prop]" filterable placeholder="请选择" clearable remote :remote-method="column.search" @change="handleSelectChange(column, 'item')">
						<el-option v-for="item in column.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-input clearable v-else-if= "column.type == 'text'" type="textarea" rows=2 :disabled="isNewItem ? column.prop == 'id' : !column.editable" v-model="item[column.prop]"></el-input>
					<el-input clearable v-else :disabled="isNewItem ? column.prop == 'id' : !column.editable" v-model="item[column.prop]"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isShowEditDialog=false">取消</el-button>
				<el-button @click="clickSubmitItemBtn">确定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="确认对话框" :visible.sync="isShowConfirmDialog" width="300px">
			<div>确认删除此条记录?</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isShowConfirmDialog=false">取消</el-button>
				<el-button @click="confrimDeleteItem">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import vue from "vue";
import _ from "lodash";


export default {
	components: {
	},

	props: {
		options: {
			type: Object,
		},
	},

	data: function() {
		return {
			opts: {
				api:null,
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
			itemIndex:0,
			item:{},
			column:{},
			isShowEditDialog: false,
			isNewItem: false,
			query:{},
			querys:{"x-order": true, "x-per-page": true, "x-page": true},
			isShowEditCellDialog: false,
			isShowConfirmDialog: false,
		}
	},

	watch: {
		options: function(newVal) {
			this.initOpts(newVal);
		}	
	},

	methods: {
		initOpts(opts = {}) {
			this.query = opts.query || {};
			this.opts.api = opts.api;
			this.opts.columns = opts.columns || [];
			this.opts.actions = opts.actions || this.opts.actions;
			this.opts.pagination.total = 0;
			this.opts.pagination.currentPage = 1;
			this.items = [];
			_.each(this.opts.columns, o => {
				if (!o.query) return;
				this.querys[o.query] = true;
			});

			this.loadDatas();
		},

		handleSelectChange(x, type) {
			if (type == "query") return;
			if (!x.relateProp || x.relateProp == x.prop) return;

			const value = this.item[x.relateProp];
			const index = _.findIndex(x.options, o => o.value == value);

			if (index < 0) return;
			this.item[x.prop] = x.options[index].label;
		},

		// 确认删除 
		async confrimDeleteItem() {
			const data = this.items[this.deleteIndex];
			const api = this.opts.api;

			this.items.splice(this.deleteIndex, 1);

			if (!api || this.deleteIndex < 0) return;

			await api.delete({id:data.id});

			this.isShowConfirmDialog = false;
			this.deleteIndex = -1;
		},

		// 删除项
		async clickDeleteItemBtn(rowIndex) {
			this.deleteIndex = rowIndex;
			this.isShowConfirmDialog = true;
		},

		// 编辑列
		clickCellEditBtn(x, rowIndex, colIndex) {
			this.isShowEditCellDialog = true;
			this.item = _.cloneDeep(this.items[rowIndex]);
			this.column = x;
			this.itemIndex = rowIndex;
		},

		// 新增项
		clickNewBtn() {
			this.isNewItem = true;
			this.isShowEditDialog = true;
		},

		// 编辑项
		clickEditItemBtn(rowIndex) {
			const data = this.items[rowIndex];
			this.item = _.cloneDeep(data);
			this.itemIndex = rowIndex;
			this.isShowEditDialog = true;
			this.isNewItem = false;
		},

		// 保存项
		async clickSubmitItemBtn() {
			const api = this.opts.api;
			const res = await api.upsert(this.item);
			if (res.isErr()) return this.$message({message:"提交失败", type:"error"});

			if (!this.isNewItem) _.merge(this.items[this.itemIndex], this.item);

			this.isShowEditDialog = false;
			this.isShowEditCellDialog = false;
			this.isNewItem = false;
		},

		// 加载数据
		async loadDatas() {
			if (!this.opts.api) return;
			this.query['x-per-page'] = this.opts.pagination.pageSize;
			this.query['x-page'] = this.opts.pagination.currentPage;
			const query = _.pickBy(this.query, (val, key) => this.querys[key] && val !== "" && val !== undefined);
			//console.log(this.query, query);
			const res = await this.opts.api.search(query);
			if (res.isErr()) return this.$message({type:"error", message:"获取数据列表错误"});
			this.items = res.data || [];
			this.opts.pagination.total = res.total || this.items.length;
		},

		// 设置分页大小
		handleSizeChange(val) {
			this.opts.pagination.pageSize = val;
			this.loadDatas();
		},

		// 设置当前页
		handleCurrentChange(val) {
			this.opts.pagination.currentPage = val;
			this.loadDatas();
		},

		// 查询数据
		async clickQueryBtn() {
			await this.loadDatas();
		},

		// 排序
		async sortChange({column, prop, order}) {
			//console.log(column, prop, order);
			if (!prop) return;
			this.query["x-order"] = prop + "-" + (order == "ascending" ? "asc" : "desc");
			await this.loadDatas();
		},
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
.cell-container {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.cell-input-container {
	position: relative;
}
.cell-edit-container {
	display:flex;
	z-index:10;
	position:absolute;
	top: 0px;
	bottom: 0px;
	left: 0px;
	width:300px;
}
</style>
