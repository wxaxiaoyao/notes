
<template>
	<div class="tasks-list-container">
		<div v-for="(x,i) in tasks" :key="i" class="task-container">
			<div class="task-title-container">
				<span class="title">
					{{x.title}}
				</span>
				<span class="date">
					{{x.startDate | dateFilter}}
				</span>
			</div>
			<div class="task-content-container">
				<inputs __style__="markdown" :__default_data__="{text:x.content}" ></inputs>
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			tasks:[],
		}
	},

	filters: {
		dateFilter(date) {
			return date.substring(0, date.indexOf("T"));
		},
	},

	methods: {

	},

	async mounted() {
		const result = await this.api.tasks.get();
		this.tasks = result.data || [];
		console.log(this.tasks);
	}
}
</script>

<style scoped>

.tasks-list-container {
	
}
.task-container {
}
.task-title-container {
	display:flex;
	justify-content: space-between;
}
.title {
	font-size:20px;
}
.date {
	font-size:18px;
}
.task-content-container {
	max-height:200px;
}
</style>
