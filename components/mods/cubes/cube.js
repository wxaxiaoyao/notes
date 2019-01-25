

import _ from "lodash";

import common from "./common.js";
import Face from "./face.js";
import Floor from "./floor.js";
import Block from "./block.js";

const {rotateDir, rotateSquareArr} = common;

class Cube {
	constructor() {
		this.faces = {'front': null,'right': null,'back': null,'left': null,'up': null,'bottom': null};

		this.style = {};
		this.className = "";
		this.cubeStyle = "cool";
		this.cubeSize = 200;
		this.cubeColNum = 3;
		this.motions = [];
		this.redoMotions = [];
		this.lock = false;
		this.rotateFloorData = {
			'sizeEdges':[],
			'faceUp': null,
			'faceBottom': null
		};//准备给旋转层的数据
		this.newSetFloorData = {
			'sizeEdges':[],//每一边数据形式{faceType:'',colOrRow: '', floorNum:'', floorData:[]}
			'faceUp': {'faceType':'', 'faceData':[]},//当次旋转不涉及顶面则null
			'faceBottom': {'faceType':'', 'faceData':[]}////当次旋转不涉及底面则null
		};//准备设置旋转之后的数据

		for (let type in this.faces) {
			this.faces[type] = new Face(type);
		}
		
		this.floor = new Floor({
			cubeSize: this.cubeSize,
			cubeColNum: this.cubeColNum,
		});

		this.reset();
	}

	reset(cubeSize, cubeColNum, cubeStyle) {
		this.cubeSize = cubeSize || this.cubeSize;
		this.cubeColNum = cubeColNum || this.cubeColNum;
		this.cubeStyle = cubeStyle || this.cubeStyle;

		this.className = 'cube-ani ' + this.cubeStyle;
		this.style.width = this.cubeSize + 'px';
		this.style.height = this.cubeSize + 'px';
		this.style['margin-left'] = -(this.cubeSize / 2) + 'px';
		this.style['margin-top'] = -(this.cubeSize / 2) + 'px';

		this.floor.reset({cubeSize:this.cubeSize, cubeColNum: this.cubeColNum});

		for (let faceType in this.faces) {
			this.faces[faceType].reset({cubeColNum:this.cubeColNum, cubeSize: this.cubeSize});
			this.faces[faceType].style.transform = this.faces[faceType].style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + this.cubeSize/2 + 'px)');
		}		

	}

	startRotateAnimate() {
		this.className +=  ' cube-ani';
		this.style.transition = 'all 1s';
	}

	stopRotateAnimate() {
		this.className = this.className.replace('cube-ani', '');
		this.style.transform = 'rotateX(0deg) rotateY(0deg)';
		this.style.transition = '';
	}

	startCube() {
		let randomRotateNum = this.cubeColNum * 30;   //随机转多少下
		const rotateTypes = ['x','y','z'];

		const randomRotate = () => {
			if (randomRotateNum <= 0) {
				this.lock = true;
				this.stopRotateAnimate();
				return clearInterval(this.randomRotateTimer);
			}
			const rotateType = rotateTypes[parseInt(Math.random() * 3)];
		    const dir = (Math.random() > 0.5 ? 1 : -1);
			const floorNum = parseInt(Math.random() * this.cubeColNum);

			this.rotate(rotateType, dir, floorNum, 0, false);//随机转魔方不需要动画
			randomRotateNum--;
		}
		this.randomRotateTimer = setInterval(randomRotate, 40);
		//cubeOptWrap.style.bottom = '-200px';
		//cubePlayingOptWrap.style.top = 0;
	}

	resetCube() {
		//重置魔方
		this.motions = [];
		this.redoMotions = [];
		this.lock = false;
		this.startRotateAnimate();
		//cubeOptWrap.style.bottom = '0px';
		//cubePlayingOptWrap.style.top = '-200px';
		this.reset();
	}
	
	//手动旋转 ，记录动作
	handRotateCube(rotateType, dir, floorNum, durTime, ani) {
		this.motions.push([rotateType, dir, floorNum]);//记录动作，以作撤销用
		this.redoMotions = [];//手操作一次就没有redo了
		this.rotateCube(rotateType, dir, floorNum, durTime, ani);
	}

	rotateCube(rotateType, dir, floorNum, durTime, ani) {
		this.rotate(rotateType, dir, floorNum, durTime, ani, () => {
			//胜利
			this.lock = false;
			this.startRotateAnimate();
			//gamer.success();
		});
	}

	//撤销
	undo() {
		if (this.motions.length == 0) return;
		var undoData = this.motions.pop();
		this.redoMotions.push(undoData);
		this.rotateCube(undoData[0], - parseInt(undoData[1]), undoData[2], 500, true);	
	}

	//redo 
	redo() {
		if (this.redoMotions.length == 0) return;
		var redoData = this.redoMotions.pop();
		this.motions.push(redoData);
		this.rotateCube(redoData[0], redoData[1], redoData[2], 500, true);	
	}

	setSize(size) {
		this.cubeSize = size;
		this.reset();
	}

	setColNum(colNum) {
		this.cubeColNum = colNum;
		this.reset();
	}

	setStyle(style) {
		this.cubeStyle = style;
		this.reset();
	}

	rotate(rotateType, dir, floorNum, durTime, ani, successCallback) {
		//console.log(rotateType, dir, floorNum);
		const cube_floor_num = this.cubeColNum;
		if (this.rotateFloorRotating) {
			return;
		} else {
			this.rotateFloorRotating = true;
		}

		const rotateDirObj = rotateDir[rotateType];
		//const rotateFloorData = this.rotateFloorData;
		const rotateFloorData = {
			'sizeEdges':[],
			'faceUp': null,
			'faceBottom': null
		};//准备给旋转层的数据
		const newSetFloorData = {
			'sizeEdges':[],//每一边数据形式{faceType:'',colOrRow: '', floorNum:'', floorData:[]}
			'faceUp': {'faceType':'', 'faceData':[]},//当次旋转不涉及顶面则null
			'faceBottom': {'faceType':'', 'faceData':[]}////当次旋转不涉及底面则null
		};//准备设置旋转之后的数据
		rotateFloorData.floorNum = floorNum;
		//四边的数据
		for (var i = 0; i < 4; i++) {
			rotateFloorData.sizeEdges[i] = {};
			//rotateFloorData.sizeEdges[i] = faces[rotateDirObj.sizeEdges[i].face].getFloorData(rotateType, floorNum);
			rotateFloorData.sizeEdges[i].faceType = rotateDirObj.sizeEdges[i].face;
			rotateFloorData.sizeEdges[i].floorData = this.faces[rotateDirObj.sizeEdges[i].face].getFloorData(rotateType, floorNum);

			//旋转后的facetype也顺便在这里赋值
			newSetFloorData.sizeEdges[i] = {};
			newSetFloorData.sizeEdges[i].faceType = rotateFloorData.sizeEdges[i].faceType;
		}

		//判断是否要上下面数据
		rotateFloorData.faceUp = null;
		rotateFloorData.faceBottom = null;
		if (floorNum == cube_floor_num - 1) {//需要顶面数据
			rotateFloorData.faceUp = {};
			rotateFloorData.faceUp.faceType = rotateDirObj.faceUp.face;//上层面类型
			rotateFloorData.faceUp.faceData = rotateSquareArr(this.faces[rotateDirObj.faceUp.face].getFaceData(), 1, rotateDirObj.faceUp.rotateDegree);//上层面数据
		} else if (floorNum == 0) {
			rotateFloorData.faceBottom = {};
			rotateFloorData.faceBottom.faceType = rotateDirObj.faceBottom.face;//下层面类型
			rotateFloorData.faceBottom.faceData = rotateSquareArr(this.faces[rotateDirObj.faceBottom.face].getFaceData(), 1, rotateDirObj.faceBottom.rotateDegree);//下层面数据
		}


		/* 旋转后会变成的数据 */
		//const newSetFloorData = this.newSetFloorData;
		var newIndex = (dir == 1 ? 1 : 3);
		for (var i = 0 ; i < 4; i++) {
			newSetFloorData.sizeEdges[newIndex].floorData = rotateFloorData.sizeEdges[i].floorData;
			newIndex = (++newIndex % 4);
		}
		newSetFloorData.faceUp = null;
		newSetFloorData.faceBottom = null;
		if (rotateFloorData.faceUp) {
			newSetFloorData.faceUp = {};
			newSetFloorData.faceUp.faceType = rotateDirObj.faceUp.face;
			newSetFloorData.faceUp.faceData = rotateSquareArr(rotateFloorData.faceUp.faceData, dir, 1);
		} 
		if (rotateFloorData.faceBottom) {
			newSetFloorData.faceBottom = {};
			newSetFloorData.faceBottom.faceType = rotateDirObj.faceBottom.face;
			if (newSetFloorData.faceBottom.faceType == 'up') {
				newSetFloorData.faceBottom.faceData = rotateSquareArr(rotateFloorData.faceBottom.faceData, dir, 1);
			} else {
				newSetFloorData.faceBottom.faceData = rotateSquareArr(rotateFloorData.faceBottom.faceData, -1 *dir, 1);
			}
		}	

		//将新的魔方数据设置魔方的函数
		const setData = () => {
			for (var i = 0; i < 4; i++) {
				this.faces[newSetFloorData.sizeEdges[i].faceType].setFloorData(rotateType, floorNum, newSetFloorData.sizeEdges[i].floorData);
			}

			newSetFloorData.faceUp && this.faces[newSetFloorData.faceUp.faceType].setFaceData(newSetFloorData.faceUp.faceData);
			newSetFloorData.faceBottom && this.faces[newSetFloorData.faceBottom.faceType].setFaceData(newSetFloorData.faceBottom.faceData);

			//判断是否胜利
			var success = true;
			for (var faceType in faces) {
				success = (success && faces[faceType].isAllSame());
			}		
			if (success) {successCallback();}	
		}	

		if (ani) {//需要动画
			this.floor.rotate(rotateType, floorNum, rotateFloorData, dir, durTime, () => {
				this.rotateFloorRotating = false;
				setData();
			});
		} else {
			this.rotateFloorRotating = false;
			setData();
		}

	}
}

export default Cube;
