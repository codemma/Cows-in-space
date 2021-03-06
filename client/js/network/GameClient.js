let instance = null;

export default
class GameClient {
    constructor() {
        if (!instance) {
            instance = this;

            this.socket = io(COWS_URL, {
                path: COWS_PATH
            });
            this.socket.connect();
        }

        return instance;
    }

    static get instance() {
        if (instance == null) {
            instance = new GameClient();
        }
        return instance;
    }

    relogin() {
        console.log('reconnecting...');
        this.login(this.username, this.password);
    }

    login(username, password) {
        console.log('Logging in user: ' + username);
        this.username = username;
        this.password = password;

        this.socket.emit('login-request', {
            username: username,
            password: password
        });
    }

    on(name, callback) {
        this.socket.on(name, callback);
    }

    update(player) {
        this.socket.emit('game-update', {
            x: player.x,
            y: player.y,
            angle: player.angle,
            id: player.id,
            vel: player.body.velocity,
            acc: player.body.acceleration,
            aVel: player.body.angularVelocity,
            aAcc: player.body.angularAcceleration
            });
    }

    gotCow(id) {
        this.socket.emit('cow-update', {
            id: id
        });
    }

    planetCollision(id) {
        this.socket.emit('planet-collision', {
        });
    }

}
