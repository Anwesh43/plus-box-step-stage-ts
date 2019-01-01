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

const drawVerticalLine : Function = (context : CanvasRenderingContext2D, d : number, x : number, y : number) => {
    context.save()
    context.translate(x, y)
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(0, d)
    context.stroke()
    context.restore()
}

const drawPBSNode : Function = (context : CanvasRenderingContext2D, i : number, scale : number) => {
    const gap : number = w / (nodes + 1)
    const sc1 : number = divideScale(scale, 0, 2)
    const sc2 : number = divideScale(scale, 1, 2)
    const size : number = gap / 3
    context.strokeStyle = color
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / strokeFactor
    context.save()
    context.translate(gap * (i + 1), h/2)
    context.rotate(Math.PI/2 * sc2)
    for (var j = 0; j < lines; j++) {
        const sc : number = divideScale(sc1, j, lines)
        context.save()
        context.rotate(Math.PI/2 * j)
        drawVerticalLine(context, size, 0, 0)
        for (var k = 0; k < edges; k++) {
            const sck : number = divideScale(sc, j, lines)
            context.save()
            context.translate(size, size)
            context.rotate(Math.PI/2 * -k)
            drawVerticalLine(context, -size * sck, 0, 0)
            context.restore()
        }
        context.restore()
    }
    context.restore()
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

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0
    update(cb : Function) {
        this.scale += updateScale(this.scale, this.dir, lines * edges, 1)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class PBSNode {
    state : State = new State()
    prev : PBSNode
    next : PBSNode

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new PBSNode(this.i + 1)
            this.next.prev = this
        }

    }

    draw(context : CanvasRenderingContext2D) {
        drawPBSNode(context, this.i, this.state.scale)
        if (this.next) {
            this.next.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : PBSNode {
        var curr : PBSNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class PlusBoxStep {

    root : PBSNode = new PBSNode(0)
    curr : PBSNode = this.root
    dir : number = 1
    draw(context : CanvasRenderingContext2D) {
        this.root.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}
