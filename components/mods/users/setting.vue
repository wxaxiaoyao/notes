
<template>
	<div class="container">
		<el-tabs tab-position="left">
			<el-tab-pane label="基本信息">
				<users __style__="profile"></users>
			</el-tab-pane>
			<el-tab-pane label="账号安全">
				<users __style__="account"></users>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";


export default {
	mixins: [mod],

	data: function() {
		return {
			head: {
				title: "用户-设置",
			},
		}
	}
}
</script>
