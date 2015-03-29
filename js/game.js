function Game(id) {
	this.id = id;
	this.drawer = new Drawer();
	this.holder = null;
	this.game = [];
	this.view = [];
	this.mineCount = 8;
	this.fieldSide = 10;
	this.cellState = {
		EMPTY: 0,
		MINE: 9,
		OPEN: 10
	}
}

Game.prototype = {
	init: function () {
		var self = this;

		this.holder = document.getElementById(this.id);

		this.holder.addEventListener('click', function (e) {
			self.leftClickListener(e);
		});

		this.holder.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		});

		this.startGame();
	},

	startGame: function () {
		this.clearHolder();
		this.createField();
	},

	createField: function () {
		this.drawer.createField(this.id, this.fieldSide, this.cellState);

		this.createEmptyGameField();
		this.putMine();
		this.calculateSiblingMines();

		this.drawer.draw(this.view, this.fieldSide);
	},

	createEmptyGameField: function () {
		var i,
			numberOfCells = Math.pow(this.fieldSide, 2);

		for (i = 0; i < numberOfCells; i++) {
			this.game[i] = this.cellState.EMPTY;
			this.view[i] = this.cellState.EMPTY;
		}

		//new version
		//var i,j;
		//
		//for (i = 0; i < this.fieldSide; i++) {
		//	this.game[i] = [];
		//	for (j = 0; j < this.fieldSide; j++) {
		//		this.game[i][j] = this.cellState.EMPTY;
		//	}
		//}

	},

	putMine: function () {
		var i,
			mines = this.mineCount,
			numberOfCells = Math.pow(this.fieldSide, 2);

		while (mines > 0) {
			i = Math.floor(Math.random() * numberOfCells);

			if (this.game[i] === this.cellState.EMPTY) {
				this.game[i] = this.cellState.MINE;
				mines--;
			}
		}

		//new version
		//var  x, y,
		//	mines = this.mineCount;
		//
		//while(mines > 0) {
		//	x = Math.floor((Math.random()*this.fieldSide));
		//	y = Math.floor((Math.random()*this.fieldSide));
		//
		//	if (this.game[x][y] === 0) {
		//		this.game[x][y] = this.cellState.MINE;
		//
		//		console.log(x, y);
		//		mines--;
		//	}
		//}


	},

	calculateSiblingMines: function () {
		var i,
			j;

		for (i = 0; i < this.game.length; i++) {
			if (this.game[i] !== this.cellState.MINE) {
				var result = 0,
					siblingMines = this.findSiblingMines(i);

				for (j = 0; j < siblingMines.length; j++) {
					if (siblingMines[j] == true) {
						result++;
					}
				}

				this.game[i] = result;
			}
		}
	},

	defineSiblingIndex : function (i) {
		var w = this.fieldSide,
			result;
		//sibling cell index
		var sibling = {
			left: i - 1,
			topLeft: i - w - 1,
			top: (i - w),
			topRight: i - w + 1,
			right: i + 1,
			bottomRight: i + w + 1,
			bottom: i + w,
			bottomLeft: i + w - 1
		};

		return sibling;
	},

	findSiblingMines: function (i) {
		var mine = this.cellState.MINE,
			sibling = this.findSiblings(i),
			siblingIndex = this.defineSiblingIndex(i),
			isMineSibling = {};

		//sibling cell has a MINE

		for (var key in sibling) {
			isMineSibling[key] = sibling[key] && this.game[siblingIndex[key]] == mine;
		}

		//array with checked siblings whether they have a MINE
		var siblingsMineArray = [
			isMineSibling.left,
			isMineSibling.topLeft,
			isMineSibling.top,
			isMineSibling.topRight,
			isMineSibling.right,
			isMineSibling.bottomRight,
			isMineSibling.bottom,
			isMineSibling.bottomLeft
		];

		return siblingsMineArray;

	},

	findSiblings: function (i) {
		var w = this.fieldSide,
			result,
			sibling = this.defineSiblingIndex(i),
			difference,
			currentCellX = i % w,
			currentCellY = Math.floor(i / w);


		difference = {
			left: [-1, 0],
			topLeft: [-1, -1],
			top: [0, -1],
			topRight: [1, -1],
			right: [1, 0],
			bottomRight: [1, 1],
			bottom: [0, 1],
			bottomLeft: [-1, 1]
		};

		//Sibling cell's X and Y
		var map = {};

		for (var key in sibling) {
			map[key] = [];
			map[key].push((sibling[key] % w) - currentCellX);
			map[key].push((Math.floor(sibling[key] / w) - currentCellY));
		}

		var isSibling = {};

		for (var obj in map) {
			isSibling[obj] = (map[obj][0] == difference[obj][0]) && (map[obj][1] == difference[obj][1]);
		}

		result = isSibling;
		return result;

	},

	//checkSiblings : function (values) {
	//
	//	var isSiblingCell,
	//		result,
	//		value;
	//
	//	//description of different types of values
	//	value = {
	//		sibling: [0],
	//		row: [1],
	//		column: [2],
	//		diagonal: [3]
	//	};
	//
	//
	//	//gives sibling cells
	//	isSiblingCell = {
	//		left: values[value].left && this.game[sibling.left],
	//		topLeft: isSiblingDiagonal.topLeft && this.game[sibling.topLeft],
	//		top: isSiblingColumn.top && this.game[sibling.top],
	//		topRight: isSiblingDiagonal.topRight && this.game[sibling.topRight],
	//		right: isSiblingRow.right && this.game[sibling.right],
	//		bottomRight: isSiblingDiagonal.bottomRight && this.game[sibling.bottomRight],
	//		bottom: isSiblingColumn.bottom && this.game[sibling.bottom],
	//		bottomLeft: isSiblingDiagonal.bottomLeft && this.game[sibling.bottomLeft]
	//	};
	//
	//	result = isSiblingCell;
	//	return result;
	//},

	clearHolder: function () {
		this.holder.innerHTML = "";
	},

	leftClickListener: function (e) {
		var clickedCellPosition = this.defineCellPosition(e);

		this.openClickedCell(clickedCellPosition.x, clickedCellPosition.y);

	},

	defineCellPosition: function (e) {
		var offSetX, offSetY, currentX, currentY, x, y;

		offSetX = this.holder.offsetLeft;
		offSetY = this.holder.offsetTop;
		currentX = e.clientX - offSetX;
		currentY = e.clientY - offSetY;

		var result = {
			x: Math.floor(currentX / this.drawer.cellSize.w),
			y: Math.floor(currentY / this.drawer.cellSize.h)
		};

		return result;
	},

	openClickedCell: function (x, y) {
		var cellNumberInArray = y * this.fieldSide + x;

		if (this.game[cellNumberInArray] == this.cellState.EMPTY) {
			var k = this.openSiblingCells(cellNumberInArray);
				//this.wave(k);

		} else {
			this.view[cellNumberInArray] = this.game[cellNumberInArray];
		}

		this.drawer.draw(this.view, this.fieldSide);
	},

	openSiblingCells: function (i) {
		var sibling = this.findSiblings(i),
			siblingIndex = this.defineSiblingIndex(i),
			mass = [];

		for (var key in sibling) {
			if(sibling[key] === true && this.game[siblingIndex[key]] < 9 && this.view[siblingIndex[key]] !== this.cellState.OPEN) {

				if (this.game[siblingIndex[key]] == this.cellState.EMPTY) {
					this.view[siblingIndex[key]] = this.cellState.OPEN;

					mass.push(siblingIndex[key]);

					this.openSiblingCells(siblingIndex[key]);

				} else if (this.game[siblingIndex[key]] !== this.cellState.EMPTY) {
					this.view[siblingIndex[key]] = this.game[siblingIndex[key]];
				}
				//mass.push(siblingIndex[key]);
			}
		}
		this.view[i] = this.cellState.OPEN;

		return mass;
	}/*,

	wave : function (k) {
		var m = [];

		for (var j = 0; j < k.length; j++) {
			m.push(this.openSiblingCells(k[j]));
			console.log(m);
		}

		k = m;
		//this.wave(k);
	}*/

};

function pageLoaded() {
	var game = new Game('canvas');

	game.init();
}

window.addEventListener('load', pageLoaded);

