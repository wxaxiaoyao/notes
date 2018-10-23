
<template>
	<div class="tasks-new-container container">
		<div class="title-container">{{__data__.title}}</div>
		<div class="form-container">
			<el-form ref="form" :model="task" label-width="80px">
				<el-form-item label="日期">
					<el-date-picker 
						style="width:100%"
						v-model="task.date" 
						type="daterange" 
						range-separator="至" 
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="标题">
					<el-input v-model="task.title" placeholder="任务标题"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model="task.content"type="textarea" :autosize="{minRows:4, maxRows:10}"></el-input>
				</el-form-item>
				<el-form-item label="后续内容">
					<el-input v-model="task.todo"type="textarea" :autosize="{minRows:2, maxRows:10}"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button @click="clickTaskCreateBtn">创建</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		const date = new Date();
		return {
			task: {
				date:[date, date],
			},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					title:"日报",
					success: null,
					fail: null,
				}
			}
		}
	},

	computed: {

	},

	methods: {
		async clickTaskCreateBtn() {
			this.task.startDate = this.task.date[0];
			this.task.endDate = this.task.date[1];

			const result = await this.api.tasks.create(this.task);
			if (result.isErr()) {
				this.$message({message:"创建失败", type:'error'});
				this.__data__.fail && this.__data__.fail();
				return;
			}

			const data = result.data;
			this.__data__.success && this.__data__.success(data);
		},
	},

	mounted() {
	},
}

</script>

<style>
</style>

<style scoped>
.tasks-create-container {
	display:flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.title-container {
	margin:20px;
	font-size:25px;
}
.form-container {
	/*width:100%;*/
}
</style>
