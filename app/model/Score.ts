export class Score {
    constructor(
        public mistakesCount: number = 0,
        public score: number = 0,
    ) { }

    public incrementMistakes() {
        this.mistakesCount++
    }

    public increaseScore(points: number) {
        this.score += points
    }

    public decreaseScore(points: number) {
        this.score -= points
    }

    public reset() {
        this.mistakesCount = 0
        this.score = 0
    }

}