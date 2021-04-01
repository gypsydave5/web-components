
const squareClickEventName = 'square-click';
const moveEventName = 'move';
const chessPieceMimeType = 'text/chess-piece';

export default class ChessSquare extends HTMLElement {
    selected = false
    square: HTMLElement
    highlightSquare: HTMLElement
    rank: string | null = null
    file: string | null = null
    algebraic: string | null = null
    color: string | null = null
    piece: ChessPiece | null = null

    constructor() {
        super()

        this.attachShadow({mode: 'open'})

        this.square = document.createElement('div')
        this.square.classList.add('square')
        this.square.style.width = '100%'
        this.square.style.height = '100%'
        //this.square.setAttribute("draggable", 'true')

        this.highlightSquare = document.createElement('div')
        this.highlightSquare.classList.add('highlight')

        this.square.appendChild(this.highlightSquare)

        const style = document.createElement('style')

        style.textContent = `        
.square {
    box-sizing: border-box;
    position: relative;
}

.highlight {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.4;
    background-color: red;
    width: 100%;
    height: 100%;
    display: none;
}
        
.chessPiece {
    box-sizing: border-box;
    width: 100%;
    height: auto;
}

.selected {
    border: 2px solid yellow;
}
          
.chess-piece-hover {
    border: 2px solid red;
    background-color: yellow;        
}`

        // this.square.addEventListener('dragstart', this.dragSquareStartListener.bind(this))

        this.addEventListener('dragenter', e => {
            if (this.isChessPiece(e)) {
                e.preventDefault()
                this.square.classList.add('chess-piece-hover')
                // console.log('dragenter', this.file, this.rank, e.dataTransfer.getData(chessPieceMimeType));
            }
        })

        this.addEventListener('dragover', e => {
            if (this.isChessPiece(e)) {
                e.preventDefault()
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = "move"
                }
            }
        })

        this.addEventListener('drop', e => {
            if (this.isChessPiece(e)) {
                e.preventDefault()
                this.square.classList.remove('chess-piece-hover')
                if (e.dataTransfer) {
                    const piece = e.dataTransfer.getData(chessPieceMimeType)
                    const file = e.dataTransfer.getData('text/file')
                    const rank = e.dataTransfer.getData('text/rank')
                    const algebraic = e.dataTransfer.getData('text/algebraic')

                    this.dispatchEvent(this.moveEvent({
                        from: {file, rank, algebraic},
                        to: {file: this.file, rank: this.rank, algebraic: this.algebraic},
                        piece
                    }))
                }

                // console.log('drop', this.file, this.rank, piece);
                return
            }

            if (e.dataTransfer) {
                const algebraic = e.dataTransfer.getData('text/algebraic')
                if (algebraic) {
                    this.dispatchEvent(new CustomEvent('point', {detail: {origin: algebraic, target: this.algebraic}}))
                }
            }
        })

        this.addEventListener('dragexit', (e: Event) => {
            if (e instanceof DragEvent && this.isChessPiece(e)) {
                e.preventDefault()
                this.square.classList.remove('chess-piece-hover')
            }
        })

        this.shadowRoot?.append(this.square, style)
    }

    isSelected() {
        return this.square.classList.contains('selected')
    }

    highlight(color: string) {
        this.highlightSquare.style.backgroundColor = color
        this.highlightSquare.style.display = 'block'
    }

    resetHighlight() {
        this.highlightSquare.style.display = 'none'
    }

    connectedCallback() {
        this.rank = this.getAttribute('rank')
        this.file = this.getAttribute('file')
        this.color = this.getAttribute('color')
        this.algebraic = this.file && this.rank ? this.file + this.rank : ''
        const p = this.getAttribute('piece')

        if (p) {
            const piece = this.newPiece(p)
            this.piece = piece
            this.square.appendChild(piece)
        }

        if (typeof this.color === "string") {
            this.square.style.backgroundColor = this.color
        }

        this.square.onclick = (e) => {
            this.dispatchEvent(this.clickEvent())
        }
    }

    clickEvent() {
        return new CustomEvent(squareClickEventName, {
            bubbles: true,
            detail: {
                rank: this.rank,
                file: this.file,
                algebraic: this.algebraic,
                piece: this.piece?.name,
            }
        });
    }

    moveEvent(detail: any) {
        return new CustomEvent(moveEventName, {
            bubbles: true,
            detail,
        })
    }

    removePiece() {
        this.piece?.removeEventListener('dragstart', this.dragPieceStartListener.bind(this))
        const piece = this.piece
        this.piece && this.square.removeChild(this.piece)
        this.piece = null
        this.removeAttribute('piece')
        return piece
    }

    setPiece(piece: ChessPiece) {
        this.piece = piece
        this.piece.addEventListener('dragstart', this.dragPieceStartListener.bind(this))
        this.square.appendChild(this.piece)
        this.setAttribute('piece', piece.name)
    }

    newPiece(p: string): ChessPiece {
        const colour = p.toLowerCase() === p ? 'd' : 'l'
        const piece = document.createElement('chess-piece') as ChessPiece
        piece.setAttribute('src', `public/Chess_${p.toLowerCase()}${colour}t45.svg`)
        piece.setAttribute('name', p)
        piece.setAttribute('draggable', 'true')
        piece.setAttribute('src', `public/Chess_${p.toLowerCase()}${colour}t45.svg`)
        piece.setAttribute('class', 'chessPiece')
        piece.addEventListener('dragstart', this.dragPieceStartListener.bind(this))
        return piece
    }

    dragPieceStartListener(e: DragEvent)  {
            if (e.dataTransfer) {
                e.dataTransfer.setData(chessPieceMimeType, this.piece?.name ?? '')
                e.dataTransfer.setData('text/file', this.file ?? '')
                e.dataTransfer.setData('text/rank', this.rank ?? '')
                e.dataTransfer.setData('text/algebraic', this.algebraic ?? '')
                e.dataTransfer.setData('text/square', this.algebraic ?? '')
                e.dataTransfer.effectAllowed = "move"
            }
    }

    isChessPiece(e: DragEvent) {
        return e.dataTransfer?.types.includes(chessPieceMimeType);
    }
}

export class ChessPiece extends HTMLElement {
    name: string = ''
    private img: HTMLImageElement

    constructor() {
        super();
        this.img = document.createElement('img')
        this.attachShadow({mode: 'open'})

        this.img.style.width = "100%"
        this.img.style.height = "auto"
        this.shadowRoot?.append(this.img)
    }

    connectedCallback() {
        this.name = this.getAttribute('name') ?? ''
        const src = this.getAttribute('src')
        console.log(src)
        if (src) this.img.src = src
    }
}

