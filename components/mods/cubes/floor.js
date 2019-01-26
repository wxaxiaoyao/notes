
import _ from "lodash";
import Face from "./face.js";
import Block from "./block.js";

class Floor {
	constructor({cubeSize, cubeColNum}) {
		const floor = this;

		floor.cubeSize = cubeSize;
		floor.cubeColNum = cubeColNum;

		floor.sizeEdges = {up:[], right: [], bottom: [], left: []};

		_.set(floor, 'frontFace', new Face({faceType:"front"}));
		_.set(floor, 'backFace', new Face({faceType:"back"}));

		_.set(floor, 'floorEles.front', floor.frontFace);
		_.set(floor, 'floorEles.back', floor.backFace);

		this.style = {transform:"", opacity:1};

		_.set(floor, 'floorEles.frontMask.className', 'floor-frontmask');
		_.set(floor, 'floorEles.backMask.className', 'floor-backmask');
		_.set(floor, 'floorEles.floorBox.className', 'floor-box');
		_.set(floor, 'floorEles.floorBox.style', {transform:"", opacity:1, transition:null});
		_.set(floor, 'floorEles.front.className', 'floor-front');
		_.set(floor, 'floorEles.back.className', 'floor-back');
		_.set(floor, 'floorEles.up.style.top', '50%');
		_.set(floor, 'floorEles.left.style.top', '50%');
		_.set(floor, 'floorEles.bottom.style.top', '50%');
		_.set(floor, 'floorEles.right.style.top', '50%');

		//初始化最初变换
		_.set(floor, 'floorEles.frontMask.style.opacity', 1);
		_.set(floor, 'floorEles.backMask.style.opacity', 1);
		_.set(floor, 'floorEles.frontMask.style.transform', 'translateZ(0px)');
		_.set(floor, 'floorEles.backMask.style.transform', 'rotateY(180deg) translateZ(0px)');
		_.set(floor, 'floorEles.front.style.transform', 'translateZ(0px)');
		_.set(floor, 'floorEles.back.style.transform', 'rotateY(180deg) translateZ(0px)');

		_.set(floor, 'floorEles.up.style.transform', 'rotateX(90deg) rotateY(0deg) translateZ(0px)');
		_.set(floor, 'floorEles.left.style.transform', 'rotateX(90deg) rotateY(270deg) translateZ(0px)');
		_.set(floor, 'floorEles.bottom.style.transform', 'rotateX(90deg) rotateY(180deg) translateZ(0px)');
		_.set(floor, 'floorEles.right.style.transform', 'rotateX(90deg) rotateY(90deg) translateZ(0px)');
	}

	reset({cubeSize, cubeColNum}) {
		this.cubeSize = cubeSize = cubeSize || this.cubeSize;
		this.cubeColNum = cubeColNum = cubeColNum || this.cubeColNum;

		const blockSize = cubeSize / cubeColNum;
		const blockWidthPercent = 100 / cubeColNum;
		const floorEles = this.floorEles;

		floorEles.up.style.height = blockWidthPercent + '%';
		floorEles.left.style.height = blockWidthPercent + '%';
		floorEles.bottom.style.height = blockWidthPercent + '%';
		floorEles.right.style.height = blockWidthPercent + '%';

		floorEles.up.style.width =  '100%';
		floorEles.left.style.width =  '100%';
		floorEles.bottom.style.width =  '100%';
		floorEles.right.style.width =  '100%';

		floorEles.up.style["margin-top"] = -blockWidthPercent/2 + '%';
		floorEles.left.style["margin-top"] = -blockWidthPercent/2 + '%';
		floorEles.bottom.style["margin-top"] = -blockWidthPercent/2 + '%';
		floorEles.right.style["margin-top"] = -blockWidthPercent/2 + '%';

		//前后面以及前后面mask, 四边   translateZ
		floorEles.frontMask.style.transform = floorEles.frontMask.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
		floorEles.backMask.style.transform = floorEles.backMask.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
		floorEles.front.style.transform = floorEles.front.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
		floorEles.back.style.transform = floorEles.back.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');

		floorEles.up.style.transform = floorEles.up.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		floorEles.right.style.transform = floorEles.right.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		floorEles.bottom.style.transform = floorEles.bottom.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		floorEles.left.style.transform = floorEles.left.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');


		//前后面的blocks
		this.frontFace.reset({cubeColNum: this.cubeColNum, cubeSize: this.cubeSize});
		this.backFace.reset({cubeColNum: this.cubeColNum, cubeSize: this.cubeSize});

		//todo:置空前后里面的block的箭头
		_.each(this.frontFace.blocks, blockRow => {
			_.each(blockRow, block => {
				block.arrow = [];
			});
		});
		_.each(this.backFace.blocks, blockRow => {
			_.each(blockRow, block => {
				block.arrow = [];
			});
		});

		//四边block,blockType统一先设置成front
		for (let sizeType in this.sizeEdges) {
			this.sizeEdges[sizeType] = [];
			floorEles[sizeType].blocklist = [];
			for (let i = 0; i < cubeColNum; i++) {
				const blockData = {
					type: 'front',
					col: i,
					row: 0,
					width: 100/cubeColNum,
					height: 100,
					left: 100 / cubeColNum * i,
					top: 0,
					floorBlock: true,
					cubeColNum: cubeColNum,
					cubeSize: cubeSize,
				}
				const block = new Block(blockData);
				this.sizeEdges[sizeType].push(block);
				floorEles[sizeType].blocklist.push(block);
			}
		}
	}
	
	//sizeBlockArr是sizeEdges中的某个，里面是block对象， sizeData 是形如['front','left','bottom'..]，一面中一层的颜色信息
	setSizeData(sizeBlockArr, sizeData) {
		for (var i = 0; i < sizeData.length; i++) {
			sizeBlockArr[i].setType(sizeData[i]);
		}
	}

	//rotateType旋转类型：x/y/z；floorNum：该方向下的第几层；旋转层数据；方向；持续时间；旋转完之后的回调
	rotate(rotateType, floorNum, rotateFloorData, dir, durTime, callback) {
		const cube_floor_num = this.cubeColNum;
		const cubeSize = this.cubeSize,
			blockSize = cubeSize/cube_floor_num,
			blockWidthPercent = 100/cube_floor_num;

		//设置旋转数据
		rotateFloorData.faceUp && this.frontFace.setFaceData(rotateFloorData.faceUp.faceData);
		rotateFloorData.faceBottom && this.backFace.setFaceData(rotateFloorData.faceBottom.faceData);
		
		//设置四边的数据
		this.setSizeData(this.sizeEdges.up, rotateFloorData.sizeEdges[0].floorData);
		this.setSizeData(this.sizeEdges.right, rotateFloorData.sizeEdges[1].floorData);
		this.setSizeData(this.sizeEdges.bottom, rotateFloorData.sizeEdges[2].floorData);
		this.setSizeData(this.sizeEdges.left, rotateFloorData.sizeEdges[3].floorData);

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
		this.style.transform = floorWrapTransform;

		//设置上下蒙板
		this.floorEles.backMask.style.opacity = (floorNum == 0 ? '0' : '1');
		this.floorEles.frontMask.style.opacity = (floorNum == cube_floor_num - 1 ? '0' : '1');

		this.style.opacity = 1;

		this.floorEles.floorBox.style.transition = 'transform ' + durTime/1000 + 's';
		this.floorEles.floorBox.style.transform = 'rotateZ(' + (dir == 1 ? 90 : -90) + 'deg)';

		setTimeout(() => {
			callback();
			this.style.opacity = 0;
			this.style.transform = 'scale(0.1)';
			this.floorEles.floorBox.style.transform = '';
		}, durTime-100);
	}
}

export default Floor;
