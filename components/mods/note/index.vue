
<template>
	<div>
		{{text}}
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text: "this is a example",
				}
			}
		}
	},

	computed: {
		text() {
			return this.__data__.text;
		}
	},
}
</script>

<style>
</style>

<style scoped>
</style>
