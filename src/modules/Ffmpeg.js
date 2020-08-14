import BaseModule from '../structures/modules/BaseModule.js'
import ffmpeg from 'fluent-ffmpeg'

export default class Ffmpeg extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Ffmpeg, {
            name: 'ffmpeg'
        });
    }

    toAudio(stream, format = 'mp3') {
        return ffmpeg(stream)
            .format(format)
            .noVideo()
            .pipe();
    }

    setup() {

    }
}
