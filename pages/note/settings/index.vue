<template>
	<div></div>
</template>

<script>

import component from "@/components/component.js";
export default {
	mixins: [component],
	data: function() {
		return {
		}
	},

	computed: {
	},

	mounted() {
		this.$router.replace(({name: g_app.getRouteName("settings-user-profile")}))
	}

}
</script>
