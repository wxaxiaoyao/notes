
<template>
	<div class="resources-container">
		<tables :options="options"></tables>
	</div>
</template>

<script>
import {
	Table,
	TableColumn,
} from "element-ui";

import tables from "@/components/common/tables.vue";
import component from "@/components/component.js";
import resources from "./resources.js";

export default {
	mixins: [component],

	components: {
		[Table.name]:Table,
		[TableColumn.name]: TableColumn,
		tables,
	},

	layout: "admin",

	data: function() {
		return {
			options:{},
		}
	},

	async mounted() {
		const resource = this.$route.params.resources;
		this.options = resources[resource] || {};
		//console.log(this.options);
	}
}
</script>

<style scoped>
.resources-container {
	width: 100%;
}

</style>
