
<template>
	<div> 
		<svg width="700" height="100">
			<g v-for="(day, index) in days"> 
				<rect
					:x="day.weekIndex * 13"
					:y="day.dayIndex  * 13"
					:fill="day.fill"
					width="10"
					height="10">
					<title>{{day.date + ":" + (day.count||0)}}</title>
				</rect>
			</g>
		</svg>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

function getWeek(year, month, day) {
    month += 1; 
    var a = Math.floor((14 - (month)) / 12);
    var y = year + 4800 - a;
    var m = (month) + (12 * a) - 3;
    var jd = day + Math.floor(((153 * m) + 2) / 5) + (365 * y) + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    var d4 = (jd + 31741 - (jd % 7)) % 146097 % 36524 % 1461;
    var L = Math.floor(d4 / 1460);
    var d1 = ((d4 - L) % 365) + L;
    return Math.floor(d1 / 7) + 1;
}

export default {
	mixins:[mod],
	components: {
	},

	data() {
		return {
		}
	},

	computed: {
		days() {
			const days = [];
			const data = this.__data__.data;
			for (let key in data) {
				let date = new Date(key);
				let year = date.getFullYear();
				let month = date.getMonth();
				let day = date.getDate();
				let week = getWeek(year, month, day);
				
				days.push({
					dayIndex: date.getDay(),
					weekIndex: week >= 53 ? 0 : week,
					date: key,
					count: data[key],
					fill: this.fill(data[key]),
				});
			}
			return days;
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					max:10,
					data:getVirtulData(),
				}
			}
		}
	},

	methods: {
		fill(count) {
			const step = 3;
			const colors = ["#E8D8F8","#B5CdE6","#77A4D0","#3977AD"];
			const index = Math.floor(count/step);
			return colors[index >= colors.length ? colors.length - 1 : index];
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
	let data = {};
	for (let time = start; time <= end; time += dayTime) {
		let date = new Date(time);
		let datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		data[datestr] = _.random(0,10);
	}
	return data;
}
</script>

<style>
</style>
