import ChessSquare, {ChessPiece} from "./chess-square";

const squareClickEventName = 'square-click';
const moveEventName = 'move';
const chessPieceMimeType = 'text/chess-piece';

const iToFile = (n: number) => String.fromCharCode(97 + n)
const iToRank = (n: number) => String(n + 1)
const isDark = (rank: string, file: string) => {
    const f = file.charCodeAt(0) - 97
    const r = rank.charCodeAt(0) - 49
    return (f + r) % 2 === 0
}

class Board {
    private position: any;
    private rawRows: any;
    private board: any;

    constructor(private readonly fen?: string) {
        if (fen) {
            this.position = fen.split(' ')[0]
            this.rawRows = this.position.split('/')

            this.board = this.rawRows.flatMap((rr: string, i: number) => {
                const rank = iToRank(Math.abs(i - 7))
                return rr.split('').flatMap((c: string) => {
                    const parsed = parseInt(c, 10)
                    if (isNaN(parsed)) {
                        return [c]
                    }
                    return Array.from({length: parsed})
                })
                    .map((p, ii) => ({piece: p, rank, file: iToFile(ii)}))
            })
        } else {
            this.board = Array.from({length: 64})
        }
    }

    [Symbol.iterator]() {
        return this.board.values()
    }
}


export default class ChessBoard extends HTMLElement {
    moveSquare: string | null
    boardElement: HTMLDivElement
    private squares: Map<string, ChessSquare> = new Map()
    private board: Board | undefined

    constructor() {
        super()
        this.moveSquare = null
        this.attachShadow({mode: 'open'})

        const board = document.createElement('div')
        this.boardElement = board
        board.className = 'chessBoard'


        const style = document.createElement('style')

        style.textContent = `.chessBoard {
    border-box: true;
    width: 80vmin;
    height: 80vmin;
    background-color: red;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    box-sizing: border-box;
          }
`

        window.customElements.define('chess-square', ChessSquare)
        window.customElements.define('chess-piece', ChessPiece)
        this.shadowRoot?.append(board, style)
    }

    highlight(square: string, color: string) {
        const s = this.squares.get(square)
        s?.highlight(color)
    }

    resetHighlight(square: string) {
        const s = this.squares.get(square)
        s?.resetHighlight()
    }

    move(from: string, to: string) {
        const f = this.squares.get(from)
        const t = this.squares.get(to)
        const piece = f?.removePiece()
        if (piece) {
            t?.setPiece(piece)
        }
    }

    connectedCallback() {
        const fen = this.getAttribute('fen');
        this.board = fen ? new Board(fen): new Board()
        this.squares = new Map()
        for (let {rank, file, piece} of this.board) {
            const square = new ChessSquare()
            const dark = '#666';
            const light = '#DDD';

            const color = isDark(rank, file) ? dark : light
            square.setAttribute('color', color)
            square.setAttribute('rank', rank)
            square.setAttribute('file', file)
            if (piece) {
                square.setAttribute('piece', piece)
            }

            this.squares.set(file + rank, square)
            this.boardElement.appendChild(square)
        }

        this.shadowRoot?.addEventListener(squareClickEventName, (e) => {
            const customEvent = new CustomEvent(squareClickEventName, e)
            this.dispatchEvent(customEvent);
        })

        this.shadowRoot?.addEventListener(moveEventName, (e) => {
            const customEvent = new CustomEvent(moveEventName, e)
            this.dispatchEvent(customEvent);
        })

        this.shadowRoot?.addEventListener('point', (e) => {
            const customEvent = new CustomEvent('point', e)
            this.dispatchEvent(customEvent);
        })
    }
}