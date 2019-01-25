
<template>
	<div class="cubes-container">
		<div class='state'>
			<div id='startBtn'>Start</div>

			<div id='cubeWrap' :class="cube.className" :style="cube.style">
				<div id="floorWrap" class="floor-wrap">
					<div :class="floorFrontMask.className" :style="floorFrontMask.style"></div>
					<div :class="floorBackMask.className" :style="floorBackMask.style"></div>
					<div :class="floorBox.className" :style="floorBox.style">
						<div :style="floorFront.style" :classs="floorFront.className">
							<div v-for="(block, j) in floorFront.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorBack.style" :classs="floorBack.className">
							<div v-for="(block, j) in floorBack.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorUp.style" :classs="floorUp.className">
							<div v-for="(block, j) in floorUp.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorLeft.style" :classs="floorLeft.className">
							<div v-for="(block, j) in floorLeft.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorBottom.style" :classs="floorBottom.className">
							<div v-for="(block, j) in floorBottom.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorRight.style" :classs="floorRight.className">
							<div v-for="(block, j) in floorRight.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
					</div>
				</div>
				<div v-for="(x, i) in cube.faces" :key="i" :class="x.className" :style="x.style">
					<div v-for="(block, j) in x.blocklist" :key="j" :class="block.className" :style="block.style"></div>
				</div>
			</div>
		</div>

		<!-- 游戏开始之前允许的操作 -->
		<div class='options' id='cubeOptWrap'>
			<div class='option-block size-opt-wrap'>
				<ul>
					<li class='size-opt' id='optSizeSmall'>small</li>
					<li class='size-opt' id='optSizeMedium'>medium</li>
					<li class='size-opt' id='optSizeLarge'>large</li>
				</ul>			
			</div>

			<div class='option-block col-opt-wrap'>
				<ul>
					<li class='col-opt' id='optCol2'>2 col</li>
					<li class='col-opt' id='optCol3'>3 col</li>
					<li class='col-opt' id='optCol4'>4 col</li>
					<li class='col-opt' id='optCol5'>5 col</li>
					<li class='col-opt' id='optCol6'>6 col</li>
				</ul>			
			</div>

			<div class='option-block style-opt-wrap'>
				<ul>
					<li class='style-opt' id='optStyleCool'>popular</li>
					<li class='style-opt' id='optStylePopular'>cool</li>
					<li class='style-opt' id='optStylePretty'>luxury</li>
				</ul>
			</div>
		</div>
		<!-- 游戏开始之前允许的操作 over -->

		<!-- 游戏开始之后允许的操作 -->
		<div class='option-playing' id='optPlayingWrap'>
			<div id='undo'>undo</div>
			<div id='redo'>redo</div>
			<div id='reset'>reset</div>
		</div>
		<!-- 游戏开始之后允许的操作over -->

		<!-- 计时 -->
		<div class='time-area' id='time'>
			00:00
		</div>

		<!-- 成功 -->
		<div class='success' id='successTxt'>
			<span>YOU WIN</span>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

import Cube from "./cube.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			cube: new Cube(),
		}
	},

	props: {
	},

	computed: {
		floorFrontMask() { return this.cube.floor.floorEles.frontMask;},
		floorBackMask() { return this.cube.floor.floorEles.backMask;},
		floorBox() { return this.cube.floor.floorEles.floorBox;},
		floorFront() { return this.cube.floor.floorEles.front;},
		floorBack() { return this.cube.floor.floorEles.back;},
		floorUp() { return this.cube.floor.floorEles.up;},
		floorLeft() { return this.cube.floor.floorEles.left;},
		floorBottom() { return this.cube.floor.floorEles.bottom;},
		floorRight() { return this.cube.floor.floorEles.right;},
	},

	methods: {

	},

	mounted() {
		this.cube.startCube();
	},
}
</script>

<style>
@import "./cube.css";
</style>

<style lang="less" scoped>
.cubes-container {
	width: 100%;
	height: 100%;
}
</style>
