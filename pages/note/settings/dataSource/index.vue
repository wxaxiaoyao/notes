<template>
	<el-table :data="dataSources">
		<el-table-column fixed prop="name" label="名称"></el-table-column>
		<el-table-column fixed prop="type" label="类型"></el-table-column>
		<el-table-column fixed prop="token" label="TOKEN"></el-table-column>
		<el-table-column fixed="right" label="操作">
			<template slot-scope="{row, $index}">
				<el-button type="text" @click="clickDeleteBtn(row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>


<script>

import {mapActions, mapGetters} from "vuex";
import component from "@/components/component.js";

import api from "@/api/notes.js";

import {
	Button,
	Table,
	TableColumn,
	Message,
} from "element-ui";

export default {
	mixins: [component],
	components: {
		[Button.name]: Button,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			dataSources: [],
		}
	},

	computed: {
		...mapGetters({
			user: "user/user",
			isAuthenticated: "user/isAuthenticated",
		}),
	},

	methods: {
		async clickDeleteBtn(row, index) {
			const result = await api.dataSource.delete({id:row.id});
			if (result.code != 0){
				return Message(result.message);
			}

			this.dataSources.splice(index, 1);
		},
	},

	async mounted() {
		const ret = await api.dataSource.getByUsername(this.user.username);

		this.dataSources = ret.data || [];
	}
}
</script>
