import GameObject from 'universe/GameObject'

const WIDTH = 50;
const HEIGHT = 50;

export default
class Cow extends GameObject {
    constructor(id, x, y, angle, score) {
        super(id, 'cow', x, y, angle, WIDTH, HEIGHT);

        this.score = score;
    }
}