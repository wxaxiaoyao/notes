
<template>
	<div>
		hello world
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components: {
	},

	data() {
		return {
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
				}
			}
		}
	},
}
</script>
