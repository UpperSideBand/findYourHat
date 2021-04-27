const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const avatar = 'X';
const defaultRows = 12;
const defaultColumns = 23;
const defaultHolePercent = 0.12;

class Field {
    constructor(field = [[]]) {
        this._field = field;
        this._locationX = 0;
        this._locationY = 0;
        this._rows = field.length;
        this._columns = field[0].length;
    }

    get field() {
        return this._field;
    }
    get locationX() {
        return this._locationX;
    }
    get locationY() {
        return this._locationY;
    }

    get rows() {
        return this._rows;
    }

    get columns() {
        return this._columns;
    }

    set field(f) {
        this._field = f;
    }
    set locationX(locX) {
        this._locationX = locX;
    }
    set locationY(locY) {
        this._locationY = locY;
    }

    static generateField(
        rows = defaultRows,
        columns = defaultColumns,
        holesPercent = defaultHolePercent
    ) {
        // Create playing field
        const field = new Array(rows);
        for (let y = 0; y < rows; y++) {
            field[y] = new Array(columns);
            for (let x = 0; x < columns; x++) {
                const prob = Math.random();
                field[y][x] = holesPercent < prob ? fieldCharacter : hole;
            }
        }
        return field;
    }

    runGame() {
        let gameOver = false;
        playArea.setRandomStartLocation();
        playArea.setRandomHatLocation();
        while (!gameOver) {
            console.log('\nGo find your hat!');
            this.displayField();
            const prevX = this.locationX;
            const prevY = this.locationY;
            this.requestInput();
            if (this.validMove()) {
                this.field[prevY][prevX] = pathCharacter;
                this.field[this.locationY][this.locationX] = avatar;
            } else gameOver = true;
        }
    }

    validMove() {
        if (this.isOutOfBounds()) {
            console.log(
                '\nYou have gone out of bounds.\n\n  --== GAME OVER ==--'
            );
            return false;
        } else if (this.isInHole()) {
            console.log(
                '\nYou have fallen in a hole.\n\n  --== GAME OVER ==--'
            );
            return false;
        } else if (this.hatFound()) {
            console.log('\nYou have found your hat!\n\n  --== YOU WIN! ==--');
        } else return true;
    }

    isOutOfBounds() {
        return 0 <= this.locationY &&
            this.locationY < this.rows &&
            0 <= this.locationX &&
            this.locationX < this.columns
            ? false
            : true;
    }

    isInHole() {
        return this.field[this.locationY][this.locationX] === hole
            ? true
            : false;
    }

    hatFound() {
        return this.field[this.locationY][this.locationX] === hat
            ? true
            : false;
    }

    setRandomStartLocation() {
        this.locationX = Math.floor(Math.random() * this.columns);
        this.locationY = Math.floor(Math.random() * this.rows);
        this.field[this.locationY][this.locationX] = avatar;
    }

    setRandomHatLocation() {
        let hatX = Math.floor(Math.random() * this.columns);
        let hatY = Math.floor(Math.random() * this.rows);
        while (hatX === this.locationX && hatY === this.locationY) {
            let hatX = Math.floor(Math.random() * this.columns);
            let hatY = Math.floor(Math.random() * this.rows);
        }
        this.field[hatY][hatX] = hat;
    }

    displayField() {
        console.log('');
        for (let y = 0; y < this._field.length; y++) {
            console.log(this._field[y].join(''));
        }
        console.log('');
    }

    requestInput() {
        const reply = prompt('Which way? ').toUpperCase();
        switch (reply) {
            case 'U':
                this.locationY -= 1;
                break;
            case 'D':
                this.locationY += 1;
                break;
            case 'L':
                this.locationX -= 1;
                break;
            case 'R':
                this.locationX += 1;
                break;

            default:
                console.log('Please enter U,D,L or R.');
                this.requestInput();
                break;
        }
    }
}

const playArea = new Field(Field.generateField());
playArea.runGame();
