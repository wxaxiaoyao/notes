
<template>
	<div class="questions-doc-container container">
		<el-collapse>
			<el-collapse-item v-for="(x, i) in list" :key="i" :title="x.title">
				<template slot="title">
					<div class="title-container">
						{{x.title}}
					</div>
				</template>
				<p v-if="x.description"><span class="description-label">问题描述:</span> {{x.description}}</p>
				<p><span class="answer-label">解答:</span>{{x.text}}</p>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
import common from "./common.js";

export default {
	mixins:[common],

	async mounted() {
		await this.loadDatas();
	}
}
</script>

<style scoped>
.title-container {
	font-weight:bold;
}
.description-label, .answer-label {
	font-weight: bold;
}
</style>
