
<template>
	<div class="cubes-container" 
		@touchstart="touchstart($event)"
		@touchmove="touchmove($event)"
		@touchend="touchend($event)"
		@mousedown="mousedown($event)" 
		@mousemove="mousemove($event)" 
		@mouseup="mouseup($event)">
		<div class='state'>
			<div id='startBtn' v-if="!start" @click="clickStartBtn">Start</div>

			<div id='cubeWrap' :class="cube.className" :style="cube.style">
				<div id="floorWrap" class="floor-wrap" :style="cube.floor.style">
					<div :class="floorFrontMask.className" :style="floorFrontMask.style"></div>
					<div :class="floorBackMask.className" :style="floorBackMask.style"></div>
					<div :class="floorBox.className" :style="floorBox.style">
						<div :style="floorFront.style" :class="floorFront.className">
							<div v-for="(block, j) in floorFront.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorBack.style" :class="floorBack.className">
							<div v-for="(block, j) in floorBack.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorUp.style" :class="floorUp.className">
							<div v-for="(block, j) in floorUp.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorLeft.style" :class="floorLeft.className">
							<div v-for="(block, j) in floorLeft.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorBottom.style" :class="floorBottom.className">
							<div v-for="(block, j) in floorBottom.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
						<div :style="floorRight.style" :class="floorRight.className">
							<div v-for="(block, j) in floorRight.blocklist" :key="j" :class="block.className" :style="block.style"></div>
						</div>
					</div>
				</div>
				<div v-for="(face, i) in cube.faces" :key="i" :class="face.className" :style="face.style">
					<div v-for="(block, j) in face.blocklist" :key="j"  :id="'block-' + i + '-' + j"
						@touchstart="floorTouchStart(face, block, $event)" 
						@touchmove="floorTouchMove(face, block, $event)" 
						@touchend="floorTouchEnd(face, block, $event)"
						@mousedown="floorMouseDown(face, block, $event)" 
						@mousemove="floorMouseMove(face, block, $event)" 
						@mouseup="floorMouseUp(face, block, $event)" 
						:class="block.className" :style="block.style">
					</div>
				</div>
			</div>
		</div>

		<!-- 游戏开始之前允许的操作 -->
		<div class='options' id='cubeOptWrap' v-if="!start">
			<div class='option-block size-opt-wrap'>
				<ul>
					<li @click="clickSetSize(150)" class='size-opt' id='optSizeSmall'>small</li>
					<li @click="clickSetSize(200)" class='size-opt' id='optSizeMedium'>medium</li>
					<li @click="clickSetSize(250)" class='size-opt' id='optSizeLarge'>large</li>
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
		<div class='option-playing' id='optPlayingWrap' :style="optStyle">
			<div id='undo' @click="clickUndo">undo</div>
			<div id='redo' @click="clickRedo">redo</div>
			<div id='reset' @click="clickReset">reset</div>
		</div>
		<!-- 游戏开始之后允许的操作over -->

		<!-- 计时 -->
		<div class='time-area' id='time' v-if="start">
			{{timestr}}
		</div>

		<!-- 成功 -->
		<div class='success' v-if="win" id='successTxt'>
			<span>YOU WIN</span>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

import Cube from "./cube.js";
import {getTimeStr} from "./common.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			start: false,
			win: false,
			cube: new Cube(),
			timestr: "00:00:00",

			isExistHeader: false,
			optStyle:{bottom:"0px", top:"-200px"},
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
		clickSetSize(size) {
			if (this.start) return;
			this.cube.setSize(size);
		},

		clickUndo() {
			this.cube.undo();
		},

		clickRedo() {
			this.cube.redo();
		},

		clickReset() {
			this.cube.resetCube();
			this.start = false;
			this.timerStyle.top = "-30px";
			this.optStyle.bottom = "0px";
			this.optStyle.top = "-200px";

			clearInterval(this.timer);
			this.totalSec = 0;
		},

		clickStartBtn() {
			this.start = true;
			this.optStyle.bottom = "-200px";
			this.optStyle.top = "0px";

			this.totalSec = 0;
			this.timer = setInterval(() => {
				this.totalSec += 1000;
				const timeObj = getTimeStr(this.totalSec);
				this.timestr = timeObj.hour + ':' + timeObj.minute + ':' + timeObj.second;
			}, 1000);

			this.cube.startCube();
		},
		
		rotateCube(startFace, startBlock, endFace, endBlock) {
			if (!startFace || !endFace || !startBlock || !endBlock) return;
			if (startBlock.col != endBlock.col && startBlock.row != endBlock.row) return;
			if (startFace.faceType == endFace.faceType && startBlock.row == endBlock.row && startBlock.col == endBlock.col) return;

			let arrowType = "up";
			if (startFace.faceType == endFace.faceType) {
				if (endBlock.row == startBlock.row) {
					arrowType = endBlock.col > startBlock.col ? "right" : "left";
				} else {
					arrowType = endBlock.row > startBlock.row ? "down" : "up";
				}
			} else {
				if (endBlock.row == startBlock.row) {
					arrowType = endBlock.col < startBlock.col ? "right" : "left";
				} else {
					arrowType = endBlock.row < startBlock.row ? "down" : "up";
				}
			}

			this.cube.handRotateCube(startFace.faceType, arrowType, startBlock.row, startBlock.col);
		},

		floorTouchStart(face, block, e) {
			//console.log(e);
			this.face = face;
			this.block = block;
			this.blockId = e.target.id;
		},

		floorTouchMove(face, block, e) {
			const touch = e.changedTouches[0];
			const element = document.elementFromPoint(touch.pageX, touch.pageY);
			const blockId = element.id;
			//console.log(element.id);
			if (!element || !element.id || element.id.indexOf("block-") != 0 || element.id == this.blockId) return ;

			const arrs = element.id.split("-");
			const endFace = this.cube.faces[arrs[1]];
			const endBlock = endFace.blocklist[parseInt(arrs[2])];
			//console.log(endFace, endBlock);
			this.rotateCube(this.face, this.block, endFace, endBlock);
			this.face = undefined;
			this.block = undefined;
		},

		floorTouchEnd(face, block, e) {
		},

		floorMouseDown(face, block, e) {
			this.face = face;
			this.block = block;
		},

		floorMouseMove(face, block, e) {
			if (!this.block) return;
			this.rotateCube(this.face, this.block, face, block);
			this.face = undefined;
			this.block = undefined;
		},

		floorMouseUp(face, block, e) {
			if (!this.block) return;
			this.rotateCube(this.face, this.block, face, block);
			this.face = undefined;
			this.block = undefined;
		},

		touchstart(e) {
			if (this.block) return;

			const touch = e.targetTouches[0];
			this.startX = touch.clientX;
			this.startY = touch.clientY;

			setTimeout(() => {
				this.isTouchStart = true;
			}, 10);
		},

		touchmove(e) {
			if (!this.isTouchStart) return;
			const touch = e.targetTouches[0];
			this.cube.rotateView({
				startX: this.startX,
				startY: this.startY,
				endX: touch.clientX,
				endY: touch.clientY,
			});
			this.startX = touch.clientX;
			this.startY = touch.clientY;
		},

		touchend(e) {
			this.isTouchStart = false;
		},

		mousedown(e) {
			if (this.block) return;

			this.startX = e.clientX;
			this.startY = e.clientY;
			this.isMouseDown = true;
		},

		mousemove(e) {
			//console.log("mousemove", e);
			if (!this.isMouseDown) return;
			this.cube.rotateView({
				startX: this.startX,
				startY: this.startY,
				endX: e.clientX,
				endY: e.clientY,
			});
			this.startX = e.clientX;
			this.startY = e.clientY;
		},

		mouseup(e) {
			this.isMouseDown = false;
		},

	},

	mounted() {
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
