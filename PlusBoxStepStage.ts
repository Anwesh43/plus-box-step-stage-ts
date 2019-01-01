const w : number = window.innerWidth, h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const nodes : number = 4
const lines : number = 4
const edges : number = 2
const strokeFactor = 90
const sizeFactor = 3
const color = "#0D47A1"

class PlusBoxStepStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage = new PlusBoxStepStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
