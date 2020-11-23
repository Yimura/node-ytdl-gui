import BaseModule from '../structures/modules/BaseModule.js'
import ffmpeg from 'fluent-ffmpeg'

export default class Ffmpeg extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Ffmpeg, {
            name: 'ffmpeg'
        });
    }

    /**
     * @param {stream.Readable} in
     * @param {stream.Writable} out
     * @param {string} format
     */
    toAudio(input, output, format = 'mp3') {
        return ffmpeg(input)
            .output(output)
            .format(format)
            .noVideo();
    }

    setup() {

    }
}
