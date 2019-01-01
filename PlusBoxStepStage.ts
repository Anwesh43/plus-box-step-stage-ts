const w : number = window.innerWidth, h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const nodes : number = 4
const lines : number = 4
const edges : number = 2
const strokeFactor = 90
const sizeFactor = 3
const color = "#0D47A1"

const maxScale : Function = (scale : number, i : number, n : number) : number => {
    return Math.max(0, scale - i / n)
}

const divideScale : Function = (scale : number, i : number, n : number) : number => {
    return Math.min(1/n, maxScale(scale, i, n))
}

const scaleFactor : Function = (scale : number) : number => Math.floor(this / scDiv)


const mirrorValue : Function = (scale : number, a : number, b : number) : number => {
    const k : number = (1 - scaleFactor(scale))
    return (1 - k) / a + k / b
}

const updateScale : Function = (scale : number, dir : number, a : number, b : number) : number => {
    return mirrorValue(scale, a, b) * dir * scGap
}

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
