const socket = io();

const chess = new Chess();

const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = ""; // Clear the board
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "sqaure",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      ); // ye line of code for the color of the square 

      squareElement.dataset.row = rowindex;
      squareElement.dataset.col = squareindex; // Add data attributes for row and column

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square); // ye line of code for the piece unicode
        pieceElement.draggable = playerRole === square.color;
        // ye line of code for the piece color 

        pieceElement.addEventListener("dragstart", () => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowindex, col: sqaureindex };
            e.dataTransfer.setData("text/plain", ""); // Required for dragstart
          }
        }); // ye line of code for the dragstart event
        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        }); // ye line of code for the dragend event

        squareElement.appendChild(pieceElement);
      }
      squareElement.addEventListener("dragover", function (e) {
        e.preventDefault;
      });

      squareElement.addEventListener("drop", function (e) {
        e.preventDefault();
        if (draggedPiece) {
          const targetSource = {
            row: parseInt(e.target.dataset.row),
            col: parseInt(e.target.dataset.col),
          };
          handleMove(sourceSquare, targetSource);
        }
      }); // ye line of code for the drop event 
      boardElement.appendChild(squareElement);
    });
  });
  if(playerRole === 'b'){
    boardElement.classList.add("flipped");
  }
  else{
    boardElement.classList.remove("flipped");
  }
};
const handleMove = (source,target) => {
  const move = {
    from:`${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to:`${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q", // always promote to a queen for simplicity
  };
  socket.emit("move", move); // Emit the move to the server
};
const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
  };
  return unicodePieces[piece.type] || ""; // Return an empty string if the piece type is not found
};

socket.on("platerRole" , function(role){
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole" , function(){
  playerRole = null;
  renderBoard();
});

socket.on("boardState" , function(fen){
  chess.load(fen);
  renderBoard();
});

socket.on("move" , function(move){
  chess.move(move);
  renderBoard();
});
 

renderBoard();
