import Player from 'universe/Player'
import Cow from 'universe/Cow'

import Utility from 'Utility'
import CowUpdatePacket from 'packets/server/CowUpdatePacket'

function delay(delay, value) {
    return new Promise(resolve => setTimeout(resolve, delay, value));
}
/**
 * Expanding universe consisting of multiple zones.
 */
export default
class Universe {
    constructor(server) {
        this.server = server;
        this.width = 1024;
        this.height = 720;

        this.players = {};
        this.cows = {};

        this.spawnedCowCount = 0;

        this.spawnCow();
    }

    createPlayer(socket) {
        const x = Utility.randomInt(100, 400);
        const y = Utility.randomInt(100, 400);
        const angle = Utility.randomInt(0, 359);

        let player = new Player(this.server.uniqueObjectId(), x, y, angle, 0);

        return player;
    }

    addPlayer(player) {
        this.players[player.id] = {
            id: player.id,
            x: player.x,
            y: player.y,
            angle: player.angle,
            velocity: player.velocity,
            acceleration: player.acceleration,
            angularVelocity: player.angularVelocity,
            angularAcceleration: player.angularAcceleration
        };
    }

    updatePlayer(player) {
        this.players[player.id] = player;
    }

    removePlayer(player) {
        delete this.players[player.id];
    }

    getPlayers() {
        let all = [];
        for (let id of Object.keys(this.players)) {
            all.push(this.players[id]);
        }
        return all;
    }

    spawnCow() {
        if (this.spawnedCowCount < 5) {
            this.spawnedCowCount++;
            delay(Utility.randomInt(300, 5000)).then(result => this.createCow());
        }
    }

    createCow() {
        const x = Utility.randomInt(50, this.width - 50);
        const y = Utility.randomInt(50, this.height - 50);

        const cow = new Cow(this.server.uniqueObjectId(), x, y, 0);
        this.cows[cow.id] = cow;

        const sockets = this.server.io.sockets.connected;
        for (let s of Object.keys(sockets)) {
            let socket = sockets[s];
            new CowUpdatePacket(cow, true).send(socket);
        }
        console.log('spawned cow and sent to clients');

        this.spawnCow();
    }

    removeCow(id) {
        console.log('removing cow: ' + Object.keys(this.cows).length);
        const sockets = this.server.io.sockets.connected;
        for (let s of Object.keys(sockets)) {
            let socket = sockets[s];
            new CowUpdatePacket({id: id}, false).send(socket);
        }

        delete this.cows[id];

        this.spawnedCowCount--;

        this.spawnCow();
    }
}