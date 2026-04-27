export class TimelineHandler {
    //PUBLIC PROPS
    /** checks if the whole animation time is elapsed */
    public get isAnimationOver(): boolean {
        return this._elapsed > this.duration;
    }

    //PRIVATE PROPS
    /** animated timeline */
    private timeline: gsap.core.Timeline;
    /** total duration of the used timeline */
    private duration: number;
    /** how much time elapsed of the current animation from the last start */
    private _elapsed: number = 0;
    /** how much time elapsed of the current animation from the last start */
    public get elapsed(): number {
        return this._elapsed;
    }
    /** how much time elapsed of the current animation from the last start */
    private _shouldAnimate: boolean = false;
    /** how much time elapsed of the current animation from the last start */
    public get shouldAnimate(): boolean {
        return this._shouldAnimate;
    }

    //CONSTRUCTOR
    constructor(timeline: gsap.core.Timeline) {
        this.timeline = timeline;
        this.duration = timeline.totalDuration();
    }

    //PUBLIC METHODS
    /**
     * @param deltaTime time from last frame in seconds
     */
    public update(deltaTime: number) {
        this._elapsed += deltaTime;
        //show timeline data at _elapsed time
        this.timeline.time(this._elapsed);
        if (this.isAnimationOver) this._shouldAnimate = false;
    }


    /**
     * @shouldReset flag that decides if animation should be resetted (check method reset)
     * @summary sets shouldAnimate to true
     * @note this doesn't reset the animated object state
     */
    public play(shouldReset: boolean = false) {
        if (shouldReset)
            this.reset();

        this._shouldAnimate = true;
    }

    /**
     * @summary reset elapsed time to zero
     * @note this doesn't reset the animated object state
     */
    public reset() {
        this._elapsed = 0;
    }
}