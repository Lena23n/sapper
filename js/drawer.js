function Drawer () {
	this.field = null;
	this.context = null;
	this.fieldWidth = null;
	this.fieldHeight = null;
	this.cellSize = {
		w: null,
		h: null
	}
}


Drawer.prototype = {
	createField : function (id, fieldSide) {
		this.field = document.createElement('canvas');
		this.field.style.width = '300px';
		this.field.style.height = '300px';

		this.fieldWidth = this.field.width;
		this.fieldHeight = this.field.height;

		this.context = this.field.getContext('2d');

		this.cellSize.w = this.fieldWidth / fieldSide;
		this.cellSize.h = this.fieldHeight/ fieldSide;

		this.attachToDOM(id, this.field);
	},

	attachToDOM : function (id, child) {
		document.getElementById(id).appendChild(child);
	},

	draw : function (array, fieldSide) {
		this.context.clearRect(0, 0, this.fieldWidth, this.fieldHeight);

		//var i, x, y, text;
		//
		//for (i = 0; i < array.length; i++) {
		//	x = i%fieldSide;
		//	y = Math.floor(i/fieldSide);
		//	text = array[i];
		//
		//	x *=this.cellSize.w;
		//	y *=this.cellSize.h;
		//
		//	this.drawCell(text, x, y);
		//}

		//new version

		var i, j, x, y, text;

		for (i = 0; i < fieldSide; i++) {
			for(j = 0; j < fieldSide; j++) {
				x = i*this.cellSize.w;
				y = j*this.cellSize.h;
				text = array[i][j];

				this.drawCell(text, x, y);
			}
		}

	},

	drawCell : function ( text, x ,y) {

		this.context.fillStyle = '#333333';
		this.context.strokeStyle = 'grey';
		this.context.fillRect(x, y, this.cellSize.w, this.cellSize.h);
		this.context.strokeRect(x, y, this.cellSize.w, this.cellSize.h);
		this.context.font = "12px Arial";
		this.context.textBaseline = 'middle';
		this.context.textAlign = "center";
		this.context.fillStyle = "#ffffff";
		this.context.fillText(text, x+14, y+8);

	}
};