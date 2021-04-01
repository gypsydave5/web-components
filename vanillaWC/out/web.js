function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
}
var squareClickEventName = 'square-click';
var moveEventName = 'move';
var chessPieceMimeType = 'text/chess-piece';
var ChessSquare = function(HTMLElement1) {
    "use strict";
    _inherits(ChessSquare, HTMLElement1);
    function ChessSquare() {
        _classCallCheck(this, ChessSquare);
        var _this;
        var ref;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(ChessSquare).call(this));
        _this.selected = false;
        _this.rank = null;
        _this.file = null;
        _this.algebraic = null;
        _this.color = null;
        _this.piece = null;
        _this.attachShadow({
            mode: 'open'
        });
        _this.square = document.createElement('div');
        _this.square.classList.add('square');
        _this.square.style.width = '100%';
        _this.square.style.height = '100%';
        //this.square.setAttribute("draggable", 'true')
        _this.highlightSquare = document.createElement('div');
        _this.highlightSquare.classList.add('highlight');
        _this.square.appendChild(_this.highlightSquare);
        var style = document.createElement('style');
        style.textContent = "        \n.square {\n    box-sizing: border-box;\n    position: relative;\n}\n\n.highlight {\n    position: absolute;\n    top: 0;\n    left: 0;\n    opacity: 0.4;\n    background-color: red;\n    width: 100%;\n    height: 100%;\n    display: none;\n}\n        \n.chessPiece {\n    box-sizing: border-box;\n    width: 100%;\n    height: auto;\n}\n\n.selected {\n    border: 2px solid yellow;\n}\n          \n.chess-piece-hover {\n    border: 2px solid red;\n    background-color: yellow;        \n}";
        // this.square.addEventListener('dragstart', this.dragSquareStartListener.bind(this))
        _this.addEventListener('dragenter', function(e) {
            if (_this.isChessPiece(e)) {
                e.preventDefault();
                _this.square.classList.add('chess-piece-hover');
            }
        });
        _this.addEventListener('dragover', function(e) {
            if (_this.isChessPiece(e)) {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
            }
        });
        _this.addEventListener('drop', function(e) {
            if (_this.isChessPiece(e)) {
                e.preventDefault();
                _this.square.classList.remove('chess-piece-hover');
                if (e.dataTransfer) {
                    var piece = e.dataTransfer.getData(chessPieceMimeType);
                    var file = e.dataTransfer.getData('text/file');
                    var rank = e.dataTransfer.getData('text/rank');
                    var algebraic = e.dataTransfer.getData('text/algebraic');
                    _this.dispatchEvent(_this.moveEvent({
                        from: {
                            file: file,
                            rank: rank,
                            algebraic: algebraic
                        },
                        to: {
                            file: _this.file,
                            rank: _this.rank,
                            algebraic: _this.algebraic
                        },
                        piece: piece
                    }));
                }
                // console.log('drop', this.file, this.rank, piece);
                return;
            }
            if (e.dataTransfer) {
                var algebraic = e.dataTransfer.getData('text/algebraic');
                if (algebraic) _this.dispatchEvent(new CustomEvent('point', {
                    detail: {
                        origin: algebraic,
                        target: _this.algebraic
                    }
                }));
            }
        });
        _this.addEventListener('dragexit', function(e) {
            if (e instanceof DragEvent && _this.isChessPiece(e)) {
                e.preventDefault();
                _this.square.classList.remove('chess-piece-hover');
            }
        });
        (ref = _this.shadowRoot) === null || ref === void 0 ? void 0 : ref.append(_this.square, style);
        return _this;
    }
    _createClass(ChessSquare, [
        {
            key: "isSelected",
            value: function isSelected() {
                return this.square.classList.contains('selected');
            }
        },
        {
            key: "highlight",
            value: function highlight(color) {
                this.highlightSquare.style.backgroundColor = color;
                this.highlightSquare.style.display = 'block';
            }
        },
        {
            key: "resetHighlight",
            value: function resetHighlight() {
                this.highlightSquare.style.display = 'none';
            }
        },
        {
            key: "connectedCallback",
            value: function connectedCallback() {
                this.rank = this.getAttribute('rank');
                this.file = this.getAttribute('file');
                this.color = this.getAttribute('color');
                this.algebraic = this.file && this.rank ? this.file + this.rank : '';
                var p = this.getAttribute('piece');
                if (p) {
                    var piece = this.newPiece(p);
                    this.piece = piece;
                    this.square.appendChild(piece);
                }
                if (typeof this.color === "string") this.square.style.backgroundColor = this.color;
                this.square.onclick = (function(e) {
                    this.dispatchEvent(this.clickEvent());
                }).bind(this);
            }
        },
        {
            key: "clickEvent",
            value: function clickEvent() {
                var ref;
                return new CustomEvent(squareClickEventName, {
                    bubbles: true,
                    detail: {
                        rank: this.rank,
                        file: this.file,
                        algebraic: this.algebraic,
                        piece: (ref = this.piece) === null || ref === void 0 ? void 0 : ref.name
                    }
                });
            }
        },
        {
            key: "moveEvent",
            value: function moveEvent(detail) {
                return new CustomEvent(moveEventName, {
                    bubbles: true,
                    detail: detail
                });
            }
        },
        {
            key: "removePiece",
            value: function removePiece() {
                var ref;
                (ref = this.piece) === null || ref === void 0 ? void 0 : ref.removeEventListener('dragstart', this.dragPieceStartListener.bind(this));
                var piece = this.piece;
                this.piece && this.square.removeChild(this.piece);
                this.piece = null;
                this.removeAttribute('piece');
                return piece;
            }
        },
        {
            key: "setPiece",
            value: function setPiece(piece) {
                this.piece = piece;
                this.piece.addEventListener('dragstart', this.dragPieceStartListener.bind(this));
                this.square.appendChild(this.piece);
                this.setAttribute('piece', piece.name);
            }
        },
        {
            key: "newPiece",
            value: function newPiece(p) {
                var colour = p.toLowerCase() === p ? 'd' : 'l';
                var piece = document.createElement('chess-piece');
                piece.setAttribute('src', "public/Chess_".concat(p.toLowerCase()).concat(colour, "t45.svg"));
                piece.setAttribute('name', p);
                piece.setAttribute('draggable', 'true');
                piece.setAttribute('src', "public/Chess_".concat(p.toLowerCase()).concat(colour, "t45.svg"));
                piece.setAttribute('class', 'chessPiece');
                piece.addEventListener('dragstart', this.dragPieceStartListener.bind(this));
                return piece;
            }
        },
        {
            key: "dragPieceStartListener",
            value: function dragPieceStartListener(e) {
                if (e.dataTransfer) {
                    var ref;
                    var ref1;
                    e.dataTransfer.setData(chessPieceMimeType, (ref1 = (ref = this.piece) === null || ref === void 0 ? void 0 : ref.name) !== null && ref1 !== void 0 ? ref1 : '');
                    var _file;
                    e.dataTransfer.setData('text/file', (_file = this.file) !== null && _file !== void 0 ? _file : '');
                    var _rank;
                    e.dataTransfer.setData('text/rank', (_rank = this.rank) !== null && _rank !== void 0 ? _rank : '');
                    var _algebraic;
                    e.dataTransfer.setData('text/algebraic', (_algebraic = this.algebraic) !== null && _algebraic !== void 0 ? _algebraic : '');
                    var _algebraic1;
                    e.dataTransfer.setData('text/square', (_algebraic1 = this.algebraic) !== null && _algebraic1 !== void 0 ? _algebraic1 : '');
                    e.dataTransfer.effectAllowed = "move";
                }
            }
        },
        {
            key: "isChessPiece",
            value: function isChessPiece(e) {
                var ref5;
                return (ref5 = e.dataTransfer) === null || ref5 === void 0 ? void 0 : ref5.types.includes(chessPieceMimeType);
            }
        }
    ]);
    return ChessSquare;
}(_wrapNativeSuper(HTMLElement));
var ChessPiece = function(HTMLElement1) {
    "use strict";
    _inherits(ChessPiece, HTMLElement1);
    function ChessPiece() {
        _classCallCheck(this, ChessPiece);
        var _this;
        var ref5;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(ChessPiece).call(this));
        _this.name = '';
        _this.img = document.createElement('img');
        _this.attachShadow({
            mode: 'open'
        });
        _this.img.style.width = "100%";
        _this.img.style.height = "auto";
        (ref5 = _this.shadowRoot) === null || ref5 === void 0 ? void 0 : ref5.append(_this.img);
        return _this;
    }
    _createClass(ChessPiece, [
        {
            key: "connectedCallback",
            value: function connectedCallback() {
                var ref5;
                this.name = (ref5 = this.getAttribute('name')) !== null && ref5 !== void 0 ? ref5 : '';
                var src = this.getAttribute('src');
                console.log(src);
                if (src) this.img.src = src;
            }
        }
    ]);
    return ChessPiece;
}(_wrapNativeSuper(HTMLElement));
var squareClickEventName1 = 'square-click';
var moveEventName1 = 'move';
var iToFile = function(n) {
    return String.fromCharCode(97 + n);
};
var iToRank = function(n) {
    return String(n + 1);
};
var isDark = function(rank, file) {
    var f = file.charCodeAt(0) - 97;
    var r = rank.charCodeAt(0) - 49;
    return (f + r) % 2 === 0;
};
var tmp = Symbol.iterator;
var Board = function() {
    "use strict";
    function Board(fen) {
        _classCallCheck(this, Board);
        this.fen = fen;
        if (fen) {
            this.position = fen.split(' ')[0];
            this.rawRows = this.position.split('/');
            this.board = this.rawRows.flatMap(function(rr, i) {
                var rank = iToRank(Math.abs(i - 7));
                return rr.split('').flatMap(function(c) {
                    var parsed = parseInt(c, 10);
                    if (isNaN(parsed)) return [
                        c
                    ];
                    return Array.from({
                        length: parsed
                    });
                }).map(function(p, ii) {
                    return {
                        piece: p,
                        rank: rank,
                        file: iToFile(ii)
                    };
                });
            });
        } else this.board = Array.from({
            length: 64
        });
    }
    _createClass(Board, [
        {
            key: tmp,
            value: function value() {
                return this.board.values();
            }
        }
    ]);
    return Board;
}();
var ChessBoard = function(HTMLElement1) {
    "use strict";
    _inherits(ChessBoard, HTMLElement1);
    function ChessBoard() {
        _classCallCheck(this, ChessBoard);
        var _this;
        var ref;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(ChessBoard).call(this));
        _this.squares = new Map();
        _this.moveSquare = null;
        _this.attachShadow({
            mode: 'open'
        });
        var board = document.createElement('div');
        _this.boardElement = board;
        board.className = 'chessBoard';
        var style = document.createElement('style');
        style.textContent = ".chessBoard {\n    border-box: true;\n    width: 80vmin;\n    height: 80vmin;\n    background-color: red;\n    display: grid;\n    grid-template-columns: repeat(8, 1fr);\n    grid-template-rows: repeat(8, 1fr);\n    box-sizing: border-box;\n          }\n";
        window.customElements.define('chess-square', ChessSquare);
        window.customElements.define('chess-piece', ChessPiece);
        (ref = _this.shadowRoot) === null || ref === void 0 ? void 0 : ref.append(board, style);
        return _this;
    }
    _createClass(ChessBoard, [
        {
            key: "highlight",
            value: function highlight(square, color) {
                var s = this.squares.get(square);
                s === null || s === void 0 ? void 0 : s.highlight(color);
            }
        },
        {
            key: "resetHighlight",
            value: function resetHighlight(square) {
                var s = this.squares.get(square);
                s === null || s === void 0 ? void 0 : s.resetHighlight();
            }
        },
        {
            key: "move",
            value: function move(from, to) {
                var f = this.squares.get(from);
                var t = this.squares.get(to);
                var piece = f === null || f === void 0 ? void 0 : f.removePiece();
                if (piece) t === null || t === void 0 ? void 0 : t.setPiece(piece);
            }
        },
        {
            key: "connectedCallback",
            value: function connectedCallback() {
                var ref, ref1, ref2;
                var fen = this.getAttribute('fen');
                this.board = fen ? new Board(fen) : new Board();
                this.squares = new Map();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.board[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var _value = _step.value, rank = _value.rank, file = _value.file, piece = _value.piece;
                        var square = new ChessSquare();
                        var dark = '#666';
                        var light = '#DDD';
                        var color = isDark(rank, file) ? dark : light;
                        square.setAttribute('color', color);
                        square.setAttribute('rank', rank);
                        square.setAttribute('file', file);
                        if (piece) square.setAttribute('piece', piece);
                        this.squares.set(file + rank, square);
                        this.boardElement.appendChild(square);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                (ref = this.shadowRoot) === null || ref === void 0 ? void 0 : ref.addEventListener(squareClickEventName1, (function(e) {
                    var customEvent = new CustomEvent(squareClickEventName1, e);
                    this.dispatchEvent(customEvent);
                }).bind(this));
                (ref1 = this.shadowRoot) === null || ref1 === void 0 ? void 0 : ref1.addEventListener(moveEventName1, (function(e) {
                    var customEvent = new CustomEvent(moveEventName1, e);
                    this.dispatchEvent(customEvent);
                }).bind(this));
                (ref2 = this.shadowRoot) === null || ref2 === void 0 ? void 0 : ref2.addEventListener('point', (function(e) {
                    var customEvent = new CustomEvent('point', e);
                    this.dispatchEvent(customEvent);
                }).bind(this));
            }
        }
    ]);
    return ChessBoard;
}(_wrapNativeSuper(HTMLElement));
export { ChessBoard as default };
