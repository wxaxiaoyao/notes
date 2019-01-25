
<template>
	<div :class="block.className" :style="block.style">
		<div v-for="(x, i) in block.arrows" :key="x">
		</div>
	</div>
</template>

<script>
import _ from "lodash";

export default {

	props: {
		block: {
			type:Object,
			default: function() {
				return {
					style:{},
					className:"",
					arrows:[],
				}
			}
		}
	}
}
</script>

<style>
</style>
