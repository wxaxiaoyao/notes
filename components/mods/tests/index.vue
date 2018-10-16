<template>
	<div class="calendar-container"> 
		<svg width="800" height="150">
			<g>
			<text v-for="(x, index) in weeks" 
				:key="index"
				:x="x.x"
				:y="x.y"
				>{{x.text}}</text>
			</g>

			<g>
			<text v-for="(x, index) in months" 
				:key="index"
				:x="x.x"
				:y="x.y"
				>{{x.text}}</text>
			</g>
			<g> 
				<rect v-for="(day, index) in days" :key="index"
					:x="day.x"
					:y="day.y"
					:fill="day.fill"
					width="10"
					height="10">
					<title>{{day.date + ":" + (day.count||0)}}</title>
				</rect>
			</g>
			<g>
			<text :x="xOffset + 43 * 13" :y="yOffset + 8 * 13 + 10" style="font-size:10px">Less</text>
			<rect v-for="(x, i) in colors" :key="i" width="10" height="10" :fill="x"
				:x="xOffset + 45 * 13 + 6 + i * 13" :y="yOffset + 8 * 13"></rect>
			<text :x="xOffset + 50 * 13" :y="yOffset + 8 * 13 + 10" style="font-size:10px">More</text>
			</g>
		</svg>
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
			months:[],
			colors: ["#E8D8F8","#B5CdE6","#77A4D0","#3977AD"],
			lang: "en",
			xOffset: 60,
			yOffset: 30,
		}
	},

	computed: {
		weeks() {
			const texts = this.lang == "ch" ? ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"] :
									     ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			const weeks = [];
			for (let i = 1; i <= 7; i++) {
				weeks.push({
					x: 20,
					y: this.yOffset + 13 * i - 3,
					text: texts[i-1],
				});
			}

			return weeks;
		},

		days() {
			const days = [];
			const data = this.__data__.data;
			const monthTexts = this.lang == "ch" ? ["1月", "2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]: 
				["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
			let currentTime = (new Date()).getTime();
			let dayTime = 3600 * 24 * 1000;
			let index = 0, curMonth = {xIndex: -100};
			this.months = [];
			for (let index = 0; index < 365; index++) {
				let time = currentTime - (366 - index) * dayTime;
				let date = new Date(time);
				let year = date.getFullYear();
				let month = date.getMonth();
				let day = date.getDate();
				let key = year + '-' + _.padStart(month + 1, 2, "0") + '-' + _.padStart(day, 2, "0");
				let xIndex = Math.floor(index / 7);
				let yIndex = (date.getDay() == 0 ? 7 : date.getDay()) - 1;
				let count = _.random(0,10);
				days.push({
					x: this.xOffset + xIndex * 13,
					y: this.yOffset + yIndex * 13,
					xIndex: xIndex,
					yIndex: yIndex,
					date: key,
					count: count,
					fill: this.fill(count),
					//count: data[key],
					//fill: this.fill(data[key]),
				});

				if (curMonth.month != month) {
					if (xIndex - curMonth.xIndex > 1) {
						xIndex += Math.floor(yIndex / 4);
						this.months.push({
							x: this.xOffset + xIndex * 13, 
							y: 15,
							xIndex: xIndex,
							month: month,
							text: monthTexts[month],
						});
					} else {
						const lastMonth = this.months[this.months.length-1];
						lastMonth.text = monthTexts[month];
						lastMonth.month = month;
					}
					curMonth = {month, xIndex};
				}
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
					year: (new Date()).getFullYear(),
					data: {},
				}
			}
		}
	},

	methods: {
		fill(count) {
			const step = 3;
			const colors = this.colors;
			const index = Math.floor(count/step);
			return colors[index >= colors.length ? colors.length - 1 : index];
		}
		
	},

	mounted() {
	}
}
</script>

<style scoped>
.calendar-container {
	font-size:10px;
}

</style>
