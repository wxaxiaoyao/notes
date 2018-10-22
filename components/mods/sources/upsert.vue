
<template>
	<el-form ref="form" :model="dataSource" label-width="80px">
		<el-form-item label="名称">
			<el-input v-model="dataSource.name" placeholder="名称"></el-input>
		</el-form-item>
		<el-form-item label="类型">
			<el-select v-model="dataSource.type" placeholder="类型" style="width:100%;">
				<el-option label="gitlab" value="gitlab"></el-option>
				<el-option disabled label="github" value="github"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="TOKEN">
			<el-input v-model="dataSource.token" placeholder="TOKEN"></el-input>
		</el-form-item>
		<el-form-item label="baseUrl">
			<el-input v-model="dataSource.baseUrl" placeholder="baseUrl"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitDataSource">提交</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],
	components: {
	},

	data: function() {
		return {
			dataSource: {
				name: "gitlab",
				type: "gitlab",
				//token: "Ed9S7hSfiruewMR-jitR",
				baseUrl: "https://gitlab.com",
			},
		}
	},

	methods: {
		async submitDataSource() {
			const result = await api.dataSource.upsert(this.dataSource);
			if (result.code != 0) {
				return Message(result.message);
			}
			return;
		}
	},
}
</script>
