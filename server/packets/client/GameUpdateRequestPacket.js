import Packet from 'packets/Packet';

export default
class GameUpdateRequestPacket extends Packet {
    constructor(player) {
        super('update', {
            x: player.x,
            y: player.y,
            angle: player.angle,
            id: player.id
        });
    }
}

//lololololol