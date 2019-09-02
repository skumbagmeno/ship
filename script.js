var $ = jQuery = require("jquery");

const teams = ['Aliens', 'Humans'];
const Orientation = Object.freeze({
    VERTICAL: Symbol('vertical'),
    HORIZONTAL: Symbol('horizontal')
});
const Status = Object.freeze({
    HIT: Symbol('hit'),
    NOTHIT: Symbol('nothit')
});

class Point {
    x = null;
    y = null;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Association {
    point = null;
    ship = null;
    constructor(point, ship) {
        this.point = point;
        this.ship = ship;
    }
}

class ShipPart {
    status = Status.NOTHIT;
    point = null;
    constructor(point, status) {
        this.status = status;
        this.point = point;
    }
}
class Ship {
    length = 1;
    direction = Orientation.VERTICAL;
    parts = [];

    constructor(length) {
        this.length = length;
        for (let i = 0; i < this.length; i++) {
            this.parts.push( new ShipPart(null, Status.NOTHIT) );
        }
    }

    setHit(point) {
        const i = this.parts.findIndex(e => e.point === point);
        if (i) {
            this.parts[i].state = Status.HIT;
        }
        if (this.isDead()) {
            console.log("Nave distrutta");
        }
    }

    isDead() {
        return !(this.parts.find(e => e.state === Status.NOTHIT));
    }
}

class Grid {
    classListener = 'cell';
    defaultDimension = 8;
    dimension = null;
    matrix = {};
    associations = [];

    placing = null;
    startposition = null;
    endposition = null;

    constructor(dimension = null) {
        this.dimension = (dimension ? dimension : this.defaultDimension);
    }

    init() {
        for (let i = 0; i < this.dimension; i++) {
            let row = {
                index: i,
                name: getRowIndex(i),
                cells: []
            };
            for (let k = 0; k < this.dimension; k++) {
                let cell = new Point(k, i);
                row.cells.push(cell);
            }
            this.matrix[row.name] = row;
        }
        this.render();
        this.startListening();
    }

    getPoint(x, y) {
        return this.associations.findIndex(e => {
            return (e.point.x === x && e.point.y === y);
        });
    }

    render() {
        console.log(this.matrix);
        let rendered = document.createElement('div');
        for (let colIndex in this.matrix) {
            let col = this.matrix[colIndex];
            let rowNode = document.createElement('div');
            rowNode.className = 'row';
            col.cells.forEach(cell => {
                let node = document.createElement('div');
                node.className = this.classListener;
                node.setAttribute('data-x', cell.x);
                node.setAttribute('data-y', cell.y);
                // node.innerHTML = col.name + " - " + cell.point.x;
                rowNode.appendChild(node);
            })
            rendered.appendChild(rowNode);
        }
        document.getElementById('exe').appendChild(rendered);
    }

    startListening() {
        const _this = this;
        $('.' + _this.classListener)
            .on('mousedown', function () {
                if (_this.placing) {
                    const x = parseInt($(this).data('x'), 10);
                    const y = parseInt($(this).data('y'), 10);
                    _this.startposition = new Point(x, y);
                    console.log("Start AT", _this.startposition);
                }
            })
            .on('mouseup', function () {
                if (_this.placing && _this.startposition) {
                    const x = parseInt($(this).data('x'), 10);
                    const y = parseInt($(this).data('y'), 10);
                    _this.endposition = new Point(x, y);
                    console.log("Ends AT", _this.endposition);
                    _this.createAssociation();
                }
            })
        $('.ship').on('click', function () {
            const hp = parseInt($(this).data('hp'), 10);
            _this.setPlacingShip(hp);
        })
    }

    createAssociation() {
        if (
            this.startposition && 
            this.endposition && 
            this.placing &&
            (this.startposition.x === this.endposition.x || this.startposition.y === this.endposition.y) &&
            ((this.startposition.x + this.endposition.x) % this.placing === 0 || (this.startposition.y + this.endposition.y) % this.placing === 0)) {
                if (this.startposition.x === this.endposition.x) { // Vertic
                    const start = (this.startposition.y > this.endposition.y ? this.endposition.y : this.startposition.y);
                    const end = (start === this.startposition.y ? this.endposition.y : this.startposition.y);
                    for (let i = start; i < (end + 1); i++) {
                        this.associations.push(new Association(new Point(this.startposition.x, i)));
                    }
                } else { // Horiz
                    const start = (this.startposition.y > this.endposition.y ? this.endposition.y : this.startposition.y);
                    const end = (start === this.startposition.y ? this.endposition.y : this.startposition.y);
                    for (let i = start; i < (end + 1); i++) {
                        this.associations.push(new Association(new Point(i, this.startposition.y)));
                    }
                }
                console.log("Ok", this);
        } else {
            console.log("Error", this);
        }
        this.startposition = null;
        this.endposition = null;
    }

    setPlacingShip(hp) {
        this.placing = hp;
        console.log("Stai posizionando una barca da " + hp);
    }
}

const grid = new Grid();
document.addEventListener('DOMContentLoaded', function() {
    grid.init();
})


function getRowIndex (n) {
    return getChar(parseInt(n));
}
function getChar (n) {
    return String.fromCharCode(65 + n);
}