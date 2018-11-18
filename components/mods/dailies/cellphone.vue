
<template>
	<div class="dailies-cellphone-container">
		<div v-for="(x, i) in list" :key="i" class="item-container">
			<div class="item-header-container">
				<div class="date-container">
					{{x.date}}
				</div>
				<div class="tag-container">
					<tags __style__="show" :__default_data__="x.tagsData"></tags>
				</div>
			</div>
			<div class="item-body-container">
				{{x.content}}
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data:function() {
		return {
			entrys: [
			{
				label:"日报",
				value: "/note/dailies/cellphone",
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

	mounted() {
		this.loadDatas();
	}
}
</script>

<style>
</style>

<style scoped>
.dailies-cellphone-container {
	
}
.item-container {
	padding:15px 10px;
}
.item-header-container {
	display: flex;
    justify-content: space-between;
}
</style>
