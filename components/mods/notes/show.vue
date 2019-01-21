

<template>
	<div class="notes-show-container">
		<p class="note-text">{{__data__.text}}</p>
	</div>
</template>

<script>
		//<h4>{{__data__.aliasTitle || __data__.title || title}}</h4>
import common from "./common.js";

export default {
	mixins:[common],

	computed: {
		title() {
			return  this.__data__.text.split("\n")[0];
		},
		text() {
			return this.__data__.text;
		}
	},

	async mounted() {
		await this.loadData();
	}
}
</script>

<style scoped>
.note-text {
	white-space: pre-wrap;
}
</style>
