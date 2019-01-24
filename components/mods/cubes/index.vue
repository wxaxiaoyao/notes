
<template>
	<div class="cubes-container">
		<div class='state'>
			<div id='startBtn'>Start</div>

			<div id='cubeWrap' :class="cubeWrapClass" :style="cubeWrapStyle">
				<div id="floorWrap" class="floor-wrap">
					<div :style="floorFrontMaskStyle" class="floor-frontmask"></div>
					<div :style="floorBackMaskStyle" class="floor-backmask"></div>
					<div class="floor-box">
						<div :style="floorFrontStyle" class="floor-front"></div>
						<div :style="floorBackStyle" class="floor-back"></div>
						<div :style="floorUpStyle" class="floor-up"></div>
						<div :style="floorLeftStyle" class="floor-left"></div>
						<div :style="floorBottomStyle" class="floor-bottom"></div>
						<div :style="floorRightStyle" class="floor-right"></div>
					</div>
				</div>

				<div :style="faceFrontStyle" class="face front"></div>
				<div :style="faceBackStyle" class="face back"></div>
				<div :style="faceUpStyle" class="face up"></div>
				<div :style="faceLeftStyle" class="face left"></div>
				<div :style="faceBottomStyle" class="face bottom"></div>
				<div :style="faceRightStyle" class="face right"></div>
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

//rotateDegree: 转多少个90(顺时针)度才能做成旋转层floor的顶面，底面 旋转层的底面是他的顶面向Y轴旋转180度做成的
//floor的原始是z轴堆叠方向的，
const rotateDir = {
	'y': {
			'sizeEdges': [
				{'face': 'front', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'right', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'back', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'left', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
			],
			'faceUp': {'face': 'bottom', 'rotateDegree': 0},
			'faceBottom': {'face': 'up', 'rotateDegree': 2}
		},
	'x': {
			'sizeEdges': [
				{'face': 'up', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
				{'face': 'back', 'rowOrCol': 'col', 'stackDir': '-1', 'readDir': '1'},
				{'face': 'bottom', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
				{'face': 'front', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
			],
			'faceUp': {'face': 'right', 'rotateDegree': 0},
			'faceBottom': {'face': 'left', 'rotateDegree': 0}
		},
	'z': {
			'sizeEdges': [
				{'face': 'up', 'rowOrCol': 'row', 'stackDir': '1', 'readDir': '1'},
				{'face': 'right', 'rowOrCol': 'col', 'stackDir': '-1', 'readDir': '1'},
				{'face': 'bottom', 'rowOrCol': 'row', 'stackDir': '-1', 'readDir': '-1'},
				{'face': 'left', 'rowOrCol': 'col', 'stackDir': '1', 'readDir': '-1'},
			],
			'faceUp': {'face': 'front', 'rotateDegree': 0},
			'faceBottom': {'face': 'back', 'rotateDegree': 0}
		},
};

//旋转i == j二维数组 dir: 1 顺时针， -1 逆时针, step 步数
function rotateSquareArr(arr, dir, step) {
	if (step == 0) {return arr;}
	var rotate180 = false, arrAfterRotate = [], floor = arr.length, maxIndex = floor - 1;

	step = step % 4;
	if (Math.abs(step) == 3) {
		dir = dir * -1;
	} else if (Math.abs(step) == 2) {
		rotate180 = true;
	}

	if (rotate180) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[maxIndex - i]) {
					arrAfterRotate[maxIndex - i] = [];
				}
				arrAfterRotate[maxIndex - i][maxIndex - j] = arr[i][j];
			}
		}		
	} else if (dir == 1) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[j]) {
					arrAfterRotate[j] = [];
				}
				arrAfterRotate[j][maxIndex - i] = arr[i][j];
			}
		}			
	} else if (dir == -1) {
		for (var i = 0; i < floor; i++) {
			for (var j = 0; j < floor; j++) {
				if (!arrAfterRotate[maxIndex - j]) {
					arrAfterRotate[maxIndex - j] = [];
				}
				arrAfterRotate[maxIndex - j][i] = arr[i][j];
			}
		}			
	}

	return arrAfterRotate;
}

export default {
	mixins:[mod],

	data: function() {
		return {
			cubeColNum: 3,
			cubeSize: 200,
			style: 'cool',
			cubeColors:[],
			cubeRotateFloorRotating: false,
			cubeAnimateGapTime: 1000,
			cubeRotateFloorData: {
				sizeEdges:[],
				faceUp:null,
				faceBottom: null,
			},
			cubeNewSetFloorData: {
				sizeEdges: [],
				faceUp: null,
				faceBottom: null,
			},
			cubeWrapClass:"",
			cubeWrapStyle:{width:"0px", height:"0px", 'margin-left':"0px", "margin-top":"0p"},
			floorFrontMaskStyle:{transform: 'translateZ(0px)',},
			floorBackMaskStyle:{transform: 'rotateY(180deg) translateZ(0px)',},
			floorFrontStyle:{transform: 'translateZ(0px)',},
			floorBackStyle:{transform: 'rotateY(180deg) translateZ(0px)',},
			floorUpStyle:{width:"0px", height:"0px","margin-top":"0px", top: "50%", transform: 'rotateX(90deg) rotateY(0deg) translateZ(0px)',},
			floorLeftStyle:{width:"0px", height:"0px","margin-top":"0px", top: "50%", transform: 'rotateX(90deg) rotateY(270deg) translateZ(0px)',},
			floorBottomStyle:{width:"0px", height:"0px","margin-top":"0px", top: "50%", transform: 'rotateX(90deg) rotateY(180deg) translateZ(0px)',},
			floorRightStyle:{width:"0px", height:"0px","margin-top":"0px", top: "50%", transform: 'rotateX(90deg) rotateY(90deg) translateZ(0px)'},

			floorFrontFace:{blocks:[[]], type:"front", blocklist:[]},
			floorBackFace:{blocks:[[]], type:'back', blocklist:[]},

			blockWidthPercent: 0,
			hasBeenInit: false,
			// face 
			faceFrontStyle:{transform:'translateZ(0px)'},
			faceRightStyle:{transform:'rotateY(90deg) translateZ(0px)'},
			faceBackStyle:{transform:'rotateY(180deg) translateZ(0px)'},
			faceLeftStyle:{transform:'rotateY(270deg) translateZ(0px)'},
			faceUpStyle:{transform:'rotateX(90deg) translateZ(0px)'},
			faceBottomStyle:{transform:'rotateX(270deg) translateZ(0px)'},
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		cubeInit() {
			// 设置6个面
			this.faceFrontStyle = {transform:'translateZ(0px)'};
			this.faceRightStyle = {transform:'rotateY(90deg) translateZ(0px)'};
			this.faceBackStyle = {transform:'rotateY(180deg) translateZ(0px)'};
			this.faceLeftStyle = {transform:'rotateY(270deg) translateZ(0px)'};
			this.faceUpStyle = {transform:'rotateX(90deg) translateZ(0px)'};
			this.faceBottomStyle = {transform:'rotateX(270deg) translateZ(0px)'};
		    
			// reset
			this.cubeReset();
		},

		cubeReset() {
			this.cubeWrapClass = "cube-ani " + this.style;
			this.cubeWrapStyle.width = this.cubeSize + "px";
			this.cubeWrapStyle.height = this.cubeSize + 'px';
			this.cubeWrapStyle['margin-left'] = -(this.cubeSize / 2) + 'px';
			this.cubeWrapStyle['margin-top'] = -(this.cubeSize / 2) + 'px';

			this.floorReset();
		},

		floorReset() {
			const cubeSize = this.cubeSize;
			const cube_floor_num = this.cubeColNum;
			const blockSize = cubeSize / cube_floor_num;
			const blockWidthPercent = 100 / cube_floor_num;

			this.floorUpStyle.height = blockWidthPercent + "%";
			this.floorLeftStyle.height = blockWidthPercent + "%";
			this.floorBottomStyle.height = blockWidthPercent + "%";
			this.floorRightStyle.height = blockWidthPercent + "%";
			this.floorUpStyle.width = "100%";
			this.floorLeftStyle.width = "100%";
			this.floorBottomStyle.width = "100%";
			this.floorRightStyle.width = "100%";
			this.floorUpStyle['margin-top'] = -blockWidthPercent/2 + "%";
			this.floorLeftStyle['margin-top'] = -blockWidthPercent/2 + "%";
			this.floorBottomStyle['margin-top'] = -blockWidthPercent/2 + "%";
			this.floorRightStyle['margin-top'] = -blockWidthPercent/2 + "%";
			// 前后面以及前后面mask, 四边   translateZ
			this.floorFrontMaskStyle.transform = this.floorFrontMaskStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
			this.floorBackMaskStyle.transform = this.floorBackMaskStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
			this.floorFrontStyle.transform = this.floorFrontStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
			this.floorBackStyle.transform = this.floorBackStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');

			this.floorUpStyle.transform = this.floorUpStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
			this.floorRightStyle.transform = this.floorReset.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
			this.floorBottomStyle.transform = this.floorBottomStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
			this.floorLeftStyle.transform = this.floorLeftStyle.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		},

		faceReset(face = {}) {
			const cube_floor_num = this.cubeColNum;

			face.blocks = face.blocks || [];
			face.blocklist = [];
			
			face.blocks = _.times(cube_floor_num, _ => []);
			for (let i = 0; i < cube_floor_num; i++) {
				face.blocks[i] = _.times(cube_floor_num, _ => {
					const size = 100 / cube_floor_num;
					return {face: face.type, type: face.type, col: j, row: i, width: size, height: size, left: size * j,	top: size * i, floorBlock: false};
				});
				for (let j = 0; j < cube_floor_num; j++) {
					this.blockReset(face.blocks[i][j]);
					face.blocklist.push(face.block[i][j]);
				}
			}
		},

		blockReset(block={}) {
			block.styleTop = block.top + block.height / 2 + "%";
			block.styleLeft = block.left + block.width / 2 + "%";
			block.className = "block block-" + block.type;
			setTimeout(() => {
				block.styleWidth = block.width + "%";
				block.styleHeight = block.height + "%";
				block.styleTop = block.top + "%";
				block.styleLeft = block.left + "%";
			}, 100);

			if (block.floorBlock) return;
			//var block = this,
				//rowRotateData = {},//箭头横向（left right）转的时候要用的旋转数据，在sizeEdges里
				//colRotateData = {};//箭头竖向（up down）转的时候要用的旋转数据，在sizeEdges里

			////确定横竖分别会触发的旋转方向，主要就是用faceType查common.js的rotateDir
			//for (var dir in rotateDir) {
				//var edges = rotateDir[dir].sizeEdges;
				//for (var i = 0; i < edges.length; i++) {
					//if (edges[i].face == this.belongFaceType) {
						//if (edges[i].rowOrCol == 'row') {
							//rowRotateData.rotateType = dir;
							//rowRotateData.stackDir = edges[i].stackDir;
							//rowRotateData.readDir = edges[i].readDir;
						//} else {
							//colRotateData.rotateType = dir;
							//colRotateData.stackDir = edges[i].stackDir;
							//colRotateData.readDir = edges[i].readDir;
						//}
					//}
				//}
			//}
			//for (var i = 0; i < arrowEles.length; i++) {
				//var arrowType = arrowEles[i].className.replace('arrow-', ''),
					//rotateType = '',
					//dir = '',
					//floorNum = 0;

				//switch (arrowType) {
					//case 'up':
						//rotateType = colRotateData.rotateType;
						//dir = -colRotateData.readDir;
						//floorNum = (colRotateData.stackDir == 1 ? block.col : cube_floor_num - 1 - block.col);
						//break;
					//case 'down':
						//rotateType = colRotateData.rotateType;
						//dir = colRotateData.readDir;
						//floorNum = (colRotateData.stackDir == 1 ? block.col : cube_floor_num - 1 - block.col);
						//break;
					//case 'left':
						//rotateType = rowRotateData.rotateType;
						//dir = -rowRotateData.readDir;
						//floorNum = (rowRotateData.stackDir == 1 ? block.row : cube_floor_num - 1 - block.row);
						//break;
					//case 'right':
						//rotateType = rowRotateData.rotateType;
						//dir = rowRotateData.readDir;
						//floorNum = (rowRotateData.stackDir == 1 ? block.row : cube_floor_num - 1 - block.row);
						//break;
				//}
				//arrowEles[i].setAttribute('alt', rotateType + ',' + dir + ',' + floorNum);
				//arrowEles[i].style.borderWidth = (cube.getCurrentCubeSize()/cube_floor_num)/6 + 'px';
			//}
		},

		//sizeBlockArr是sizeEdges中的某个，里面是block对象， sizeData 是形如['front','left','bottom'..]，一面中一层的颜色信息
		floorSetSizeData(sizeBlockArr, sizeData) {
			_.each(sizeData, (data, i) => sizeBlockArr[i].setType(data));
		},

		//rotateType旋转类型：x/y/z；floorNum：该方向下的第几层；旋转层数据；方向；持续时间；旋转完之后的回调
		floorRotate(rotateType, floorNum, rotateFloorData, dir, durTime, callback) {
			let cubeSize = cube.getCurrentCubeSize(),
				blockSize = cubeSize/cube_floor_num,
				blockWidthPercent = 100/cube_floor_num;

			//设置旋转数据
			rotateFloorData.faceUp && frontFace.setFaceData(rotateFloorData.faceUp.faceData);
			rotateFloorData.faceBottom && backFace.setFaceData(rotateFloorData.faceBottom.faceData);
			
			//设置四边的数据
			setSizeData(sizeEdges.up, rotateFloorData.sizeEdges[0].floorData);
			setSizeData(sizeEdges.right, rotateFloorData.sizeEdges[1].floorData);
			setSizeData(sizeEdges.bottom, rotateFloorData.sizeEdges[2].floorData);
			setSizeData(sizeEdges.left, rotateFloorData.sizeEdges[3].floorData);

			//设置floor位置，和transition时间
			var floorWrapTransform = '';
			switch (rotateType) {
				case 'z':
					floorWrapTransform = '';
					break; 
				case 'x':
					floorWrapTransform = 'rotateY(90deg)';
					break;
				case 'y':
					floorWrapTransform = 'rotateX(-90deg)';
			}
			floorWrapTransform += 'translateZ(' + ((floorNum - (cube_floor_num-1)/2) * blockSize) + 'px)';
			floorEles.floorWrap.style.transform = floorWrapTransform;

			//设置上下蒙板
			floorEles.backMask.style.opacity = (floorNum == 0 ? '0' : '1');
			floorEles.frontMask.style.opacity = (floorNum == cube_floor_num - 1 ? '0' : '1');

			floorEles.floorWrap.style.opacity = 1;

			floorEles.floorBox.style.transition = 'transform ' + durTime/1000 + 's';
			floorEles.floorBox.style.transform = 'rotateZ(' + (dir == 1 ? 90 : -90) + 'deg)';

			setTimeout(function() {
				callback();
				floorEles.floorWrap.style.opacity = 0;
				floorEles.floorWrap.style.transform = 'scale(0.1)';
				floorEles.floorBox.style.transform = '';
			}, durTime-100);
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
