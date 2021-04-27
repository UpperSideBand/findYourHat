const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const avatar = 'P';
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

    get columns() {
        return this._columns;
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
    get playerLocation() {
        return this._field[this.locationY][this.locationX];
    }
    get rows() {
        return this._rows;
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
    set playerLocation(char) {
        this.field[this.locationY][this.locationX] = char;
    }

    static generateField(
        rows = defaultRows,
        columns = defaultColumns,
        holesPercent = defaultHolePercent
    ) {
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

    displayField() {
        console.log('');
        for (let y = 0; y < this.rows; y++) {
            console.log(this.field[y].join(''));
        }
        console.log('');
    }

    hatFound() {
        return this.playerLocation === hat ? true : false;
    }

    isInHole() {
        return this.playerLocation === hole ? true : false;
    }

    isOutOfBounds() {
        return 0 <= this.locationY &&
            this.locationY < this.rows &&
            0 <= this.locationX &&
            this.locationX < this.columns
            ? false
            : true;
    }

    requestInput() {
        const reply = prompt('Which way would you like to go? ').toUpperCase();
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

    runGame() {
        let gameOver = false;
        this.setRandomStartLocation();
        this.setRandomHatLocation();
        while (!gameOver) {
            console.log('\nGo find your hat!');
            this.displayField();
            const prevX = this.locationX;
            const prevY = this.locationY;
            this.requestInput();
            if (this.validMove()) {
                this.field[prevY][prevX] = pathCharacter;
                this.playerLocation = avatar;
            } else gameOver = true;
        }
    }

    setRandomHatLocation() {
        let hatX = randomFloor(this.columns);
        let hatY = randomFloor(this.rows);
        // Check that hat is not generated in current player location and fix if required
        while (hatX === this.locationX && hatY === this.locationY) {
            hatX = randomFloor(this.columns);
            hatY = randomFloor(this.rows);
        }
        this.field[hatY][hatX] = hat;
    }

    setRandomStartLocation() {
        this.locationX = randomFloor(this.columns);
        this.locationY = randomFloor(this.rows);
        this.playerLocation = avatar;
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
}

function randomFloor(input) {
    return Math.floor(Math.random() * input);
}

// Init
const playArea = new Field(Field.generateField());
playArea.runGame();
