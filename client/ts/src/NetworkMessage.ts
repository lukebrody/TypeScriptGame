import { Point } from "./math";

import { Option } from 'prelude-ts'

export abstract class NetworkMessage {
    playerPosition: Option<PlayerPositionMessage> = Option.none();
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