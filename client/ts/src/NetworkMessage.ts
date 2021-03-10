import { Point } from "./math";

export abstract class NetworkMessage {
    playerPosition: PlayerPositionMessage | undefined = undefined;
}

export type PlayerId = string

export class PlayerPositionMessage {
    id: PlayerId
    position: Point

    constructor(id: PlayerId, position: Point) {
        this.id = id;
        this.position = position;
    }
}