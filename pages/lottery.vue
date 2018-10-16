<template>
	<div></div>
</template>

<script>
import _ from "lodash";

export default {
	data() {
		return {
			numbers:[],
		}
	},

	mounted() {
		const size = 36000;
		for (let i = 0; i < size; i++) {
			this.numbers.push(_.random(0,9));
		}
	}
}
</script>
