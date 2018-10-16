<template>
	<div class="headerContainer">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<userlinks></userlinks>
			</div>
		</div>
	</div>
</template>

<script>
//import "@/components/common";
import component from "@/components/component.js";
export default {
	mixins: [component],
	components: {
	},

	data: function() {
		return {
		}
	},

	methods: {
	},

	mounted() {
	}
}
</script>

<style scoped>
.headerContainer {
	border-bottom: 1px solid rgb(221,221,221);
	height:60px;
}
.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.flex-row {
	display: flex;
	justify-content: space-between;
	padding-right: 10px;
}
.icon-home {
	font-size:30px;
}
</style>
