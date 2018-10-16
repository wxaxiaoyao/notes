
<template>
	<div class="notifications-container">
		<el-table :data="notifications">
			<el-table-column prop="createdAt" width='180px' label="创建时间">
				<template slot-scope="{row}">
					{{row.createdAt | datetime}}
				</template>
			</el-table-column>
			<el-table-column prop="description" label="通知内容">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="60px">
				<template slot-scope="{row}">
					<el-button 
						@click="clickReadBtn(row)"
						:disabled="row.state == 1 ? true : false" 
						type="text" 
						icon="iconfont icon-ok"
						data-toggle="tooltip"
						:title="row.state == 1 ? '已读' : '标记已读'">
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import {
	Table,
	TableColumn,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components: {
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			notifications:[],
		}
	},

	filters: {
		datetime(datestr) {
			const date = g_app.util.getDate(datestr);
			const {year, month, day, hour, minute, second} = date;
			
			return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {

				}
			}
		}
	},

	methods: {
		async clickReadBtn(data) {
			if (data.state == 1) return;

			const result = await this.api.notifications.update({id:data.id, state:1});
			if (result.isErr()) return;
			data.state = 1;
		}
	},

	async mounted() {
		const result = await this.api.notifications.get({"x-order":"state-asc-createdAt-desc"});
		const notifications = result.data || [];
		this.notifications = notifications;
	}
}
</script>

<style lang="scss">
.notifications-container {
	.el-table th {
		padding: 12px 0px;
	}
	.el-table td {
		padding: 0px;
	}
}
</style>
<style scoped>
</style>
