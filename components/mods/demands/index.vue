
<template>
	<div class="demands-index-container container">
		<div class="header-container">
			<div class="title">需求列表</div>
			<el-button @click="clickNewBtn" type="text" round>新增<i class="el-icon-plus"></i></el-button>
		</div>
		<el-table :data="demands">
			<el-table-column type="expand">
				<template slot-scope="{row}">
					<el-collapse v-model="activeName">
						<el-collapse-item title="基本信息" name="baseinfo">
							<el-form label-position="left" inline class="demand-table-expand">
								<el-form-item label="标题">
									<span>{{row.title}}</span>
								</el-form-item>
								<el-form-item label="标签">
									<span>{{row.tags}}</span>
								</el-form-item>
								<el-form-item label="类型">
									<span>{{row.type | typeFilter}}</span>
								</el-form-item>
								<el-form-item label="简述">
									<span>{{row.description}}</span>
								</el-form-item>
							</el-form>
						</el-collapse-item>
						<el-collapse-item title="需求故事" name="story">
							<modules __style__="render" :__default_data__="{text:row.story}"></modules>
						</el-collapse-item>
						<el-collapse-item title="使用场景" name="sence">
							<modules  __style__="render" :__default_data__="{text:row.sence}"></modules>
						</el-collapse-item>
						<el-collapse-item title="目标用户" name="customer">
							<modules  __style__="render" :__default_data__="{text:row.sence}"></modules>
							<editors v-if="activeName == 'customer'" class="editor" __style__="codemirror" :__default_data__="customerData"></editors>
						</el-collapse-item>
						<el-collapse-item title="价值产出" name="worth">
							<modules  __style__="render" :__default_data__="{text:row.worth}"></modules>
						</el-collapse-item>
						<el-collapse-item title="功能特性" name="feature">
							<modules  __style__="render" :__default_data__="{text:row.feature}"></modules>
						</el-collapse-item>
						<el-collapse-item title="实现方案" name="implement">
							<modules  __style__="render" :__default_data__="{text:row.implement}"></modules>
						</el-collapse-item>
						<el-collapse-item title="资源链接" name="link">
							<modules  __style__="render" :__default_data__="{text:row.link}"></modules>
						</el-collapse-item>

					</el-collapse>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="编号" width="60px">
			</el-table-column>
			<el-table-column prop="title" label="标题">
			</el-table-column>
			<el-table-column prop="type" label="类型">
				<template slot-scope="{row}">
					{{row.type | typeFilter}}
				</template>
			</el-table-column>
			<el-table-column prop="tags" label="标签">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="80px">
				<template slot-scope="{row, $index}">
					<i @click="clickEditBtn(row)" class="oper-icon el-icon-edit" data-toggle="tooltip" title="编辑"></i>
					<i @click="clickDeleteBtn(row, $index)" class="oper-icon el-icon-delete" data-toggle="tooltip" title="移除"></i>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			activeName:"baseinfo",
			demands:[],
			head: {
				title:"需求列表",
			}
		}
	},

	props: {
	},

	computed: {
	},

	filters: {
		typeFilter(value) {
			const types = [
				{label:"基础型", value:0},
				{label:"期望型", value:1},
				{label:"兴奋型", value:2},
				{label:"无差异型", value:3},
				{label:"反向型", value:4},
			];

			const index = _.findIndex(types, o => o.value == value);
			console.log(index);
			return (types[index] || []).label;
		},
	},

	methods: {
		clickNewBtn() {
			this.$router.push({path:"/note/demands/upsert"});
		},

		async clickDeleteBtn(x, index) {
			const reuslt = await this.api.demands.delete({id:x.id});
			if (result.isErr()) return this.$message({message:"删除失败"});
			this.demands.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/demands/upsert?id=" + x.id});
		}
	},

	async mounted() {
		const result = await this.api.demands.get();
		const demands = result.data || [];

		_.each(demands, x => {
			x.tags = x.tags.split("|").filter(o => o).join(" ");
		});

		this.demands = demands;
	},
}
</script>

<style lang="less">
.demands-index-container {
  .demand-table-expand {
    font-size: 0;
  }
  .demand-table-expand label {
	margin-left:4px;
    width: 90px;
    color: #99a9bf;
  }
  .demand-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 45%;
  }	
}
</style>

<style lang="less" scoped>
.header-container {
	display: flex;
	justify-content: space-between;
	margin: 15px 10px 0px 10px;

	.title {
		font-weight: bold;
		font-size:20px;
	}
}

.oper-icon {
	margin:2px;
}
</style>
