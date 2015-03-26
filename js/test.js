var controller;

var CONST = {
	EMPTY: 0,
	MINE: 9,
	CLOSED: 10,
	MINE_BOOM: 11,
	FLAG: 12,
	FLAG_MISTAKE: 13,
	GAME_OVER: 'over',
	WIN: 'win',
	PLAY: 'play'
};

function Module() {
	this.firstClick = true;
	this.play = true;
	this.gameState;
	this.flags = this.minesAmount = 40;
	this.fieldSide = 16;
	this.field = [];
	this.view = [];
	this.drawer = new DrawerCanvas();
	//this.drawer = new DrawerDOM();
}

// Field generators
Module.prototype.generateEmptyField = function () {
	var i, j;

	for (i = 0; i < this.fieldSide + 2; i++) {
		this.field[i] = [];
		this.view[i] = [];
		for (j = 0; j < this.fieldSide + 2; j++) {
			this.field[i][j] = CONST.EMPTY;
			this.view[i][j] = CONST.CLOSED;
		}
	}
};

Module.prototype.generateField = function (startX, startY) {
	var mines, x, y, result, i, j, k, t;

	// Creating an empty field with a larger field
	this.generateEmptyField();

	// Filling in this field mines
	mines = this.minesAmount;
	while (mines > 0) {
		x = Math.floor(Math.random() * (this.fieldSide)) + 1;
		y = Math.floor(Math.random() * (this.fieldSide)) + 1;
		if ((x < startX - 1 || x > startX + 1) || (y < startY - 1 || y > startY + 1) && this.field[x][y] === 0) {
			this.field[x][y] = CONST.MINE;
			mines--;
		}
	}

	// Calculating the number of mines around each cell
	for (i = 1; i <= this.fieldSide; i++) {
		for (j = 1; j <= this.fieldSide; j++) {
			if (this.field[i][j] !== CONST.MINE) {
				result = 0;
				for (k = i - 1; k < i + 2; k++) {
					for (t = j - 1; t < j + 2; t++) {
						if (this.field[k][t] === CONST.MINE && k !== 0 && t !== 0) {
							result++;
						}
					}
				}
				this.field[i][j] = result;
			}
		}
	}
};

// Logic
Module.prototype.msgToUser = function () {
	switch (this.gameState) {
		case CONST.GAME_OVER :
		{
			if (confirm("Game over :( New game?")) {
				controller.newGame();
			}
			break;
		}
		case CONST.WIN :
		{
			if (confirm("You win!!! :) New game?")) {
				controller.newGame();
			}
			break;
		}
		default :
		{
			//NOP
			break;
		}
	}
};

Module.prototype.flagToggle = function (x, y) {
	switch (this.view[x][y]) {
		case CONST.CLOSED :
		{
			if (this.flags > 0) {
				this.view[x][y] = CONST.FLAG;
				this.flags--;
			}
			break;
		}
		case CONST.FLAG :
		{
			this.view[x][y] = CONST.CLOSED;
			this.flags++;
			break;
		}
		default :
		{
			console.log('Error: flagToggle');
			break;
		}
	}
};

Module.prototype.viewChecker = function () {
	var continueGame = false;
	for (var i = 1; i < this.view.length - 1; i++) {
		for (var j = 1; j < this.view.length - 1; j++) {
			if (this.view[i][j] === CONST.CLOSED) {
				continueGame = true;
				break;
			}
		}
	}
	if (!continueGame) {
		this.gameState = CONST.WIN;
	}
};

Module.prototype.clickChecker = function (x, y) {
	switch (this.field[x][y]) {
		case CONST.EMPTY :
			this.openNearbyEmptyCells(x, y);
			break;
		case CONST.MINE :
			this.mineBang(x, y);
			break;
		default :
			this.view[x][y] = this.field[x][y];
			if (this.flags === 0) {
				this.viewChecker();
			}
			break;
	}
};

Module.prototype.openNearbyEmptyCells = function (x, y) {
	// Open nearby cells with numbers
	if (this.field[x][y] > 0 && this.field[x][y] < CONST.MINE) {
		this.view[x][y] = this.field[x][y];
	}
	// Open nearby empty cells
	if (this.view[x][y] !== CONST.EMPTY && this.field[x][y] === CONST.EMPTY) {
		this.view[x][y] = CONST.EMPTY;
		for (var i = x - 1; i < x + 2; i++) {
			for (var j = y - 1; j < y + 2; j++) {
				if ((x > 0 && y > 0) && (x <= this.fieldSide && y <= this.fieldSide)) {
					this.openNearbyEmptyCells(i, j);
				}
			}
		}
	}
};

Module.prototype.mineBang = function (x, y) {
	var i, j;

	for (i = 1; i < this.view.length; i++) {
		for (j = 1; j < this.view.length; j++) {
			if (this.field[i][j] === CONST.MINE && this.view[i][j] !== CONST.FLAG) {
				this.view[i][j] = CONST.MINE;
			} else if (this.field[i][j] !== CONST.MINE && this.view[i][j] === CONST.FLAG) {
				this.view[i][j] = CONST.FLAG_MISTAKE;
			}
		}
	}
	this.view[x][y] = CONST.MINE_BOOM;
	this.gameState = CONST.GAME_OVER;
};

// Util
Module.prototype.defineCellPosition = function (x, y) {
	var xPosition, yPosition;

	xPosition = x / this.drawer.cellSize;
	yPosition = y / this.drawer.cellSize;
	xPosition = xPosition - (xPosition % 1) + 1;
	yPosition = yPosition - (yPosition % 1) + 1;
	var result = {
		x: xPosition,
		y: yPosition
	};
	return result;
};

// Listeners
Module.prototype.clickListener = function () {
	var cellPosition;
	var self = this;
	document.getElementById('intercept').addEventListener("click", function (e) {
		if (self.gameState === CONST.PLAY) {
			var side = self.drawer.cellSize * self.fieldSide;
			if (e.x <= side && e.y <= side) {
				cellPosition = controller.defineCellPosition(e.x, e.y);
				if (controller.firstClick) {
					controller.generateField(cellPosition.x, cellPosition.y);
					controller.firstClick = false;
				}
				self.clickChecker(cellPosition.x, cellPosition.y);
				self.drawer.draw(self.fieldSide, self.view);
			}
		}
		self.msgToUser();
	}, false);
};

Module.prototype.rightClickListener = function () {
	var side;
	var self = this;
	document.getElementById('intercept').addEventListener("contextmenu", function (e) {
		e.preventDefault();
		if (self.gameState === CONST.PLAY) {
			side = self.drawer.cellSize * self.fieldSide;
			if (e.x <= side && e.y <= side) {
				var cellPosition = controller.defineCellPosition(e.x, e.y);
				if (!controller.firstClick) {
					self.flagToggle(cellPosition.x, cellPosition.y);
					self.drawer.draw(self.fieldSide, self.view);
					if (self.flags === 0) {
						self.viewChecker();
					}
				}
			}
		}
		self.msgToUser();
		return false;
	}, false);
};

Module.prototype.resizeListener = function () {
	var self = this;
	window.addEventListener('resize', function () {
		self.drawer.resizeAndDraw(self.fieldSide, self.view);
	}, false);
};

// Gameplay
Module.prototype.startGame = function () {
	this.gameState = CONST.PLAY;
	this.generateEmptyField();
	this.drawer.init(this.fieldSide, this.view);
	this.clickListener();
	this.rightClickListener();
	this.resizeListener();
	controller.firstClick = true;
};

Module.prototype.newGame = function () {
	this.gameState = CONST.PLAY;
	this.flags = this.minesAmount;
	this.generateEmptyField();
	this.drawer.draw(this.fieldSide, this.view);
	controller.firstClick = true;
};

controller = new Module();
controller.startGame();