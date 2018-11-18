
<template>
	<div>
		<mt-header title="我"></mt-header>
		<users __style__="me"></users>

		<div class="logout-container">
			<mt-button type="danger" @click="clickLogout">退出</mt-button>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data:function() {
		return {
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		async clickLogout() {
			await this.api.users.logout();

			this.setUser();
			this.setToken();
			this.$router.push({path:"/note/cellphones/login"});
		}
	}
}
</script>

<style lang="less" scoped>
.logout-container {
	margin-top: 20px;
	.mint-button {
		width: 100%;
	}
}
</style>
