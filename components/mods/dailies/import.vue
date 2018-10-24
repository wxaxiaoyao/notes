
<template>
	<div class="dailies-import-container container">
		<el-input 
			v-model="text" 
			type="textarea" 
			rows=40 
			placeholder="数据格式:2018-01-01 日报内容 每行一条记录"
			resize="none">
		</el-input>
		<div class="submit-btn-container">
			<el-button type="primary" @click="clickSubmitBtn">提交</el-button>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			text:"",
		}
	},

	methods: {
		async clickSubmitBtn() {
			const lines = this.text.split("\n");
			const dailies = [];
			_.each(lines, line => {
				line = line.trim();
				if (!/\d{4}-\d{2}-\d{2} .*/.test(line)) return;
				const splitIndex = line.indexOf(" ");
				const date = line.substring(0, splitIndex);
				const content = line.substring(splitIndex+1);
				dailies.push({date, content});
			});

			const result = await this.api.dailies.import({dailies});
			if (result.isErr()) return this.$message({message:"数据导入失败, 请检查数据格式是否正确...", type:"error"});
			
			this.$router.push({path:"/note/dailies"});
		}
	},
}

</script>

<style scoped>
.dailies-import-container {
	padding-top: 20px;
}
.submit-btn-container {
	display: flex;
	justify-content:center;
	padding-top: 20px;
}
</style>
