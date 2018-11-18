

<template>
	<div class="views-entry-container">
		<div v-for="(x, i) in entrys" :key="i">
			<div @click="clickEntry(x)">
				{{x.label}}
			</div>
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
			entrys: [
			{
				label:"日报",
				value: "/note/dailies/smIndex",
			}
			]
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		clickEntry(x) {
			this.push(x.value);
		}
	},

}
</script>

<style>
</style>

<style scoped>
</style>
