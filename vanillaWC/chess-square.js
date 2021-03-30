const squareClickEventName = 'square-click';
const moveEventName = 'move';
const chessPieceMimeType = 'text/chess-piece';

export default class ChessSquare extends HTMLElement {
    selected = false

    constructor() {
        super()

        this.attachShadow({mode: 'open'})

        const square = document.createElement('div')
        this.square = square
        this.square.classList.add('square')
        square.style.width = '100%'
        square.style.height = '100%'
        square.setAttribute("draggable", 'true')

        const highlight = document.createElement('div')
        this.highlightSquare = highlight
        this.highlightSquare.classList.add('highlight')

        square.appendChild(highlight)

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
                e.dataTransfer.dropEffect = "move"
            }
        })

        this.addEventListener('drop', e => {
            if (this.isChessPiece(e)) {
                e.preventDefault()
                this.square.classList.remove('chess-piece-hover')
                const piece = e.dataTransfer.getData(chessPieceMimeType)
                const file = e.dataTransfer.getData('text/file')
                const rank = e.dataTransfer.getData('text/rank')
                const algebraic = e.dataTransfer.getData('text/algebraic')

                // console.log('drop', this.file, this.rank, piece);
                this.dispatchEvent(this.moveEvent({from: {file, rank, algebraic}, to: {file: this.file, rank: this.rank, algebraic: this.algebraic}, piece}))
                return
            }

            const algebraic = e.dataTransfer.getData('text/algebraic')

            if (algebraic) {
                this.dispatchEvent(new CustomEvent('point', {detail: { origin: algebraic, target: this.algebraic }}))
            }
        })

        this.addEventListener('dragexit', e => {
            if (this.isChessPiece(e)) {
                e.preventDefault()
                this.square.classList.remove('chess-piece-hover')
               }
        })

        this.shadowRoot.append(square, style)
    }

    isSelected() {
        return this.square.classList.contains('selected')
    }

    highlight(color) {
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
        this.algebraic = this.file + this.rank

        const p = this.getAttribute('piece')
        if (p) {
            const piece = this.newPiece(p)
            this.piece = piece
            this.square.appendChild(piece)
        }

        this.square.style.backgroundColor = this.color

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
                piece: this.piece?.pieceName,
            }
        });
    }

    moveEvent(detail) {
        return new CustomEvent(moveEventName, {
            bubbles: true,
            detail,
        })
    }

    removePiece() {
        this.piece.removeEventListener('dragstart', this.dragPieceStartListener)
        const piece = this.piece
        this.square.removeChild(this.piece)
        this.piece = undefined
        this.removeAttribute('piece')
        return piece
    }

    setPiece(piece) {
        this.piece = piece
        this.piece.addEventListener('dragstart', this.dragPieceStartListener.bind(this))
        this.square.appendChild(this.piece)
        this.setAttribute('piece', piece.pieceName)
    }

    newPiece(p) {
        const colour = p.toLowerCase() === p ? 'd' : 'l'
        const piece = document.createElement('img')
        piece.pieceName = p
        piece.setAttribute('draggable', 'true')
        piece.setAttribute('src', `Chess_${p.toLowerCase()}${colour}t45.svg`)
        piece.setAttribute('class', 'chessPiece')
        piece.addEventListener('dragstart', this.dragPieceStartListener.bind(this))
        return piece
    }

    dragPieceStartListener(e) {
        e.dataTransfer.setData(chessPieceMimeType, e.target.pieceName)
        e.dataTransfer.setData('text/file', this.file)
        e.dataTransfer.setData('text/rank', this.rank)
        e.dataTransfer.setData('text/algebraic', this.algebraic)
        e.dataTransfer.effectAllowed = "move"
    }

    dragSquareStartListener(e) {
        var img = new Image();
        // img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        // e.dataTransfer.setDragImage(img, 0, 0);
        // e.dataTransfer.setData('text/algebraic', this.algebraic)
        // console.log('oyounoanoien')
        e.dataTransfer.effectAllowed = 'none'
    }

    isChessPiece(e) {
        return e.dataTransfer.types.includes(chessPieceMimeType);
    }
}
