function Game(id, gameInfoWrapId) {
	this.id = id;
	this.gameInfoWrapId = gameInfoWrapId;
	this.drawer = new Drawer();
	this.holder = null;
	this.game = [];
	this.view = [];
	this.mineCount = 12;
	this.flagCount = this.mineCount;
	this.fieldSide = 10;
	this.cellState = {
		EMPTY: 0,
		MINE: 9,
		OPEN: 10,
		FLAG: 11,
		MARKED : [1,2,3,4,5,6,7,8,10]
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
			self.rightClickListener(e);
		});

		this.startGame();
	},

	startGame: function () {
		this.clearHolder();
		this.createField();
		this.flagCount = this.mineCount;
		this.writeGameInfo();
	},

	createField: function () {
		this.drawer.createField(this.id, this.fieldSide, this.cellState);

		this.createEmptyGameField();
		this.putMine();
		this.calculateSiblingMines();

		this.drawer.draw(this.view, this.fieldSide);
	},

	writeGameInfo : function () {
		var wrap = document.getElementById(this.gameInfoWrapId),
			text = 'Flags left: ';
		wrap.innerHTML = text + this.flagCount;
	},

	createEmptyGameField: function () {
		var i,
			numberOfCells = Math.pow(this.fieldSide, 2);

		for (i = 0; i < numberOfCells; i++) {
			this.game[i] = this.cellState.EMPTY;
			this.view[i] = this.cellState.EMPTY;
		}
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

	getSiblingIndices : function (i) {
		var w = this.fieldSide;

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
			siblingIndex = this.getSiblingIndices(i),
			isMineSibling = {},
			key,
			siblingsMineArray = [],
			obj;

		//sibling cell has a MINE
		for (key in sibling) {
			isMineSibling[key] = sibling[key] && this.game[siblingIndex[key]] == mine;
		}

		//array with checked siblings whether they have a MINE
		for (obj in isMineSibling) {
			siblingsMineArray.push(isMineSibling[obj])
		}

		return siblingsMineArray;

	},

	findSiblings: function (i) {
		var w = this.fieldSide,
			result,
			sibling = this.getSiblingIndices(i),
			difference,
			currentCellX = i % w,
			currentCellY = Math.floor(i / w),
			map = {},
			key,
			obj,
			isSibling = {},
			realDifferenceX,
			realDifferenceY;

		//Necessary difference between current cell's x, y and its siblings x, y to be siblings
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

		//Difference between sibling cell's X and Y and current cell's X and Y
		for (key in sibling) {
			map[key] = [];
			map[key].push((sibling[key] % w) - currentCellX);
			map[key].push((Math.floor(sibling[key] / w) - currentCellY));
		}

		//check real difference
		for (obj in map) {
			realDifferenceX = map[obj][0] == difference[obj][0];
			realDifferenceY = map[obj][1] == difference[obj][1];

			isSibling[obj] = realDifferenceX && realDifferenceY;
		}

		result = isSibling;
		return result;
	},

	clearHolder: function () {
		this.holder.innerHTML = "";
	},

	leftClickListener: function (e) {
		var clickedCellPosition = this.defineCellPosition(e);

		this.openClickedCell(clickedCellPosition);
		this.checkCell(clickedCellPosition);
	},

	rightClickListener : function (e) {
		var clickedCellPosition = this.defineCellPosition(e);

		this.toggleFlag(clickedCellPosition);
	},

	defineCellPosition: function (e) {
		var offSetX, offSetY, currentX, currentY, x, y, result;

		offSetX = this.holder.offsetLeft;
		offSetY = this.holder.offsetTop;
		currentX = e.clientX - offSetX;
		currentY = e.clientY - offSetY;

		x = Math.floor(currentX / this.drawer.cellSize.w);
		y =Math.floor(currentY / this.drawer.cellSize.h);

		result = y * this.fieldSide + x;

		return result;
	},

	openClickedCell: function (cellNumberInArray) {

		switch (this.game[cellNumberInArray]) {
			case this.cellState.EMPTY:
				this.openSiblingCells(cellNumberInArray);
				break;
			default:
				this.view[cellNumberInArray] = this.game[cellNumberInArray];
		}

		this.drawer.draw(this.view, this.fieldSide);
	},

	openSiblingCells: function (i) {
		var siblings /*= this.findSiblings(i)*/,
			key,
			siblingIndex,
			isSibling,
			isCellNotMine,
			isCellNotFlag,
			activeCellsToCheck = [];

			activeCellsToCheck.push(i);

		while (activeCellsToCheck.length) {

			siblings = this.findSiblings(activeCellsToCheck[0]);
			siblingIndex = this.getSiblingIndices(activeCellsToCheck[0]);

			for (key in siblings) {
				isSibling = siblings[key] === true;
				isCellNotMine = this.game[siblingIndex[key]] < this.cellState.MINE;
				isCellNotFlag = this.view[siblingIndex[key]] !== this.cellState.FLAG;

				if(isSibling && isCellNotMine && isCellNotFlag) {

					if (this.game[siblingIndex[key]] == this.cellState.EMPTY) {

						activeCellsToCheck.push(siblingIndex[key])
						// todo rewrite recursion to plain cycle

						this.view[siblingIndex[key]] = this.cellState.OPEN;
						this.game[siblingIndex[key]] = this.cellState.OPEN;
					} else {
						this.view[siblingIndex[key]] = this.game[siblingIndex[key]];
					}

					//switch (this.game[siblingIndex[key]]) {
					//	case this.cellState.EMPTY:
					//		this.view[siblingIndex[key]] = this.cellState.OPEN;
					//		this.game[siblingIndex[key]] = this.cellState.OPEN;
					//		// todo rewrite recursion to plain cycle
					//
					//		activeCellsToCheck.push(siblingIndex[key]);
					//
					//		//this.openSiblingCells(siblingIndex[key]);
					//		break;
					//	default:
					//		this.view[siblingIndex[key]] = this.game[siblingIndex[key]];
					//}
				}
			}
			activeCellsToCheck.shift();
			console.log(activeCellsToCheck);
		}



		//for (key in sibling) {
		//	isSibling = sibling[key] === true;
		//	isCellNotMine = this.game[siblingIndex[key]] < this.cellState.MINE;
		//	isCellNotFlag = this.view[siblingIndex[key]] !== this.cellState.FLAG;
		//
		//	if(isSibling && isCellNotMine && isCellNotFlag) {
		//
		//		switch (this.game[siblingIndex[key]]) {
		//			case this.cellState.EMPTY:
		//				this.view[siblingIndex[key]] = this.cellState.OPEN;
		//				this.game[siblingIndex[key]] = this.cellState.OPEN;
		//				// todo rewrite recursion to plain cycle
		//				this.openSiblingCells(siblingIndex[key]);
		//				break;
		//			default:
		//				this.view[siblingIndex[key]] = this.game[siblingIndex[key]];
		//		}
		//	}
		//}
		this.view[i] = this.cellState.OPEN;
	},

	toggleFlag :function (i) {

		var cellIsMarked = this.cellState.MARKED.indexOf(this.view[i]) >= 0;

		if (cellIsMarked) {
			alert('Cell is already opened!');
			return false;
		}

		// todo simplify this
		switch (this.view[i]) {
				case this.cellState.FLAG:
					this.view[i] = this.cellState.EMPTY;
					this.flagCount +=1;
					this.writeGameInfo();
					break;
				default:
					if(this.flagCount > 0) {
						this.view[i] = this.cellState.FLAG;
						this.flagCount -=1;
						this.writeGameInfo();
					} else {
						alert('There are no flags left!');
					}
			}

		this.drawer.draw(this.view, this.fieldSide);
	},

	checkCell : function (cellNumberInArray) {
		var isGameSolved;

		if(this.game[cellNumberInArray] == this.cellState.MINE) {
			this.restartGame('You loose!');
		}

		isGameSolved = this.isCheckWin();

		if(isGameSolved) {
			this.restartGame('You win!');
		}
	},

	restartGame : function (message) {
		alert(message);
		this.startGame();
	},

	isCheckWin : function () {
		var isGameSolved = true,
			i = 0;

		// todo use right instrument
		while (i < this.game.length && isGameSolved) {
			var game = this.game[i],
				view = this.view[i],
				isMineCell = game == this.cellState.MINE && view !== this.checkCell.MINE;

			isGameSolved = ((game == view) || isMineCell);

			i++;
		}

		return isGameSolved;
	}
};

function pageLoaded() {
	var game = new Game('canvas', 'game-info');

	game.init();
}

window.addEventListener('load', pageLoaded);

