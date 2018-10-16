
<template>
	<VeHeatmap :visual-map="__data__.visualMap" :series="__data__.series" :calendar="__data__.calendar" :tooltip-visible="true"></VeHeatmap>
</template>

<script>
import _ from "lodash";
import VeHeatmap from 'v-charts/lib/heatmap';

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],
	components: {
		VeHeatmap,
	},

	data() {
		return {
			isClient: false,
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					visualMap: {
						show:false,
						type:"piecewise",
						min:0,
						max:100,
					},
					calendar: {
						range: '2018',
					},
					series:[
					{
						type: 'heatmap',
						coordinateSystem: 'calendar',
						data: getVirtulData(),
					},
					],
				}
			}
		}
	},

	mounted() {
	}
}

function getVirtulData(year) {
	year = year || '2018';
	let start = (new Date(year, 0, 1)).getTime();
	let end =  (new Date(year, 11, 31)).getTime();
	let dayTime = 3600 * 24 * 1000;
	let data = [];
	for (let time = start; time <= end; time += dayTime) {
		let date = new Date(time);
		let datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		data.push([
			datestr,
			_.random(0, 100),
		]);
	}
	return data;
}


</script>

<style>
</style>
