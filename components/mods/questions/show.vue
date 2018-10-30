
<template>
	<div class="questions-show-container">
		<h4>{{__data__.title}}</h4>
		<p v-if="__data__.description">{{__data__.description}}</p>
		<blockquote>{{__data__.text}}</blockquote>
	</div>
</template>

<script>
import common from "./common.js";

export default {
	mixins:[common],

	async mounted() {
		await this.loadData();
	}
}
</script>

<style scoped>
</style>
