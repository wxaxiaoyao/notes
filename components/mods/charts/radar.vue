
<template>
	<VeRadar :data="__data__" :radar="__data__.radar" :series="__data__.series" :tooltip-visible="true"></VeRadar>
</template>

<script>
import VeRadar from 'v-charts/lib/radar';

import mod from "@/components/mods/common/mod.js";
export default {
	mixins:[mod],
	components: {
		VeRadar,
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
					columns: ["type", "js", "go", "c", "py", "lua"],
					rows: [{}],
					//tooltip-visible:false,
					radar: {
						//splitNumber:2,
						shape: "polygon",
						indicator: [
						{name:"js", max:5},
						{name:"go", max:5},
						{name:"c", max:5},
						{name:"py", max:5},
						{name:"lua", max:5},
						]
					},
					series:[
					{
						type: 'radar',
						data: [
						{
							value:[4,2,3,1,5],
							name:"编程语言"
						}
						]

					},
					],
				}
			}
		}
	},

}
</script>

<style>
</style>
