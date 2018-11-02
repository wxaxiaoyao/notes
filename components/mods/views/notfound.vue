
<template>
	<div>
		<h3>页面不存在 404</h3>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data:function() {
		return {
			head: {
				title:"404",
			}
		}
	},

	props: {
	},

	computed: {
	},
}
</script>

<style>
</style>

<style scoped>
</style>
