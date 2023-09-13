import {
  Card,
  CardBody,
  Chip,
  Button,
  Listbox,
  ListboxItem,
  Tabs,
  Tab,
  Image,
  ScrollShadow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { Chessboard as Board } from "react-chessboard";
import { useEffect, useState, useMemo } from "react";
import light from "../../assets/light.jpg";
import green from "../../assets/green.jpg";
import { Chess } from "chess.js";
import useSound from "use-sound";
import Engine from "../../engine";
import { toast } from "react-hot-toast";

const Chessboard = () => {
  // ESTADOS

  const [width, setWidth] = useState(0);
  const [heigth, setHeight] = useState(0);

  // CONSTANTES JUEGO

  const levels = {
    "Easy 🤓": 2,
    "Medium 🧐": 8,
    "Hard 😵": 16,
  };
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [game, setGame] = useState(new Chess());
  const [isCPU, setIsCPU] = useState(true);
  const [nextToMove, setNextToMove] = useState("w");
  const [history, setHistory] = useState(game.history());
  const engine = useMemo(() => new Engine(), []);
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const [play] = useSound("/sounds/move.mp3");
  const [capture] = useSound("/sounds/capture.mp3");
  const [notify] = useSound("/sounds/notify.mp3");
  const [style, setStyle] = useState("green");

  // EFECTOS

  useEffect(() => {
    if (game.game_over()) {
      onOpen();
    }
    setNextToMove(game.turn());
    setHistory(game.history());
  }, [game, onOpen]);

  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);

    window.addEventListener(
      "resize",
      () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      },
      true
    );
  }, []);

  // FUNCIONES JUEGO

  function findBestMove() {
    console.log("corriendo funcion");
    if (!isCPU) return;
    console.log("corriendo funcion 2");

    if (stockfishLevel === 16) {
      toast.loading("StockFish is thinking", {
        position: "top-right",
      });
    }

    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove }) => {
      if (stockfishLevel === 16) {
        console.log("entering");
        toast.dismiss();
      }

      if (bestMove) {
        safeGameMutate((game) => {
          game.move({
            from: bestMove.substring(0, 2),
            to: bestMove.substring(2, 4),
            promotion: bestMove.substring(4, 5),
          });
        });
      }
    });
  }

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  const onSelectionChange = () => {
    setIsCPU((prev) => !prev);
    resetGame();
  };

  const tabSelectionChange = (e) => {
    notify();
    resetGame();
    e === "Easy 🤓"
      ? setStockfishLevel(2)
      : e === "Medium 🧐"
      ? setStockfishLevel(8)
      : setStockfishLevel(16);
  };

  function onSquareClick(square) {
    setRightClickedSquares({});
    console.log("running");

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    if (!moveTo) {
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }
      setMoveTo(square);

      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move.san.includes("x")) {
        capture();
      } else {
        play();
      }

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);

      setTimeout(findBestMove, 300);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});

      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    if (piece) {
      const gameCopy = { ...game };
      gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);
      setTimeout(findBestMove, 300);
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  const resetGame = () => {
    notify();
    safeGameMutate((game) => {
      game.reset();
    });
    setMoveSquares({});
    setOptionSquares({});
    setRightClickedSquares({});
    setHistory([]);
  };

  const arr = history.filter((elem, i) => {
    return i % 2 === 0;
  });

  const undoLastMove = () => {
    notify();
    safeGameMutate((game) => {
      if (isCPU) {
        game.undo();
        game.undo();
        setHistory(game.history());
      } else {
        game.undo();
        setHistory(game.history());
      }
    });
    setMoveSquares({});
    setOptionSquares({});
    setRightClickedSquares({});
  };

  // RENDER

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-132px)]">
      <div className="grid grid-cols-12 ">
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-start items-center p-2 mt-3">
          <Card className="max-w-full w-1/2 mb-5">
            <CardBody>
              <h3 className="font-bold text-center">
                {isCPU ? "Player 1 VS. Stockfish" : "Player 1 VS. Player 2"}
              </h3>
            </CardBody>
          </Card>
          <div className="mb-5 hover:cursor-pointer">
            <Board
              id="ClickToMove"
              animationDuration={200}
              arePiecesDraggable={false}
              position={game.fen()}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              onPromotionPieceSelect={onPromotionPieceSelect}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              customDarkSquareStyle={
                style === "green"
                  ? { backgroundColor: "#779952" }
                  : { backgroundColor: "#B58863" }
              }
              customLightSquareStyle={
                style === "green"
                  ? { backgroundColor: "#edeed1" }
                  : { backgroundColor: "#F0D9B5" }
              }
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares,
              }}
              promotionToSquare={moveTo}
              showPromotionDialog={showPromotionDialog}
              boardWidth={
                width < 450
                  ? 320
                  : width < 680 || heigth < 700
                  ? 385
                  : heigth < 900
                  ? 430
                  : 510
              }
            />
          </div>
          <div className="flex gap-6 ">
            <Button
              className="bg-gradient-to-tr from-blue-500 to-gray-500 text-white shadow-lg"
              onClick={resetGame}
            >
              Reset game
            </Button>
            <Button
              className="bg-gradient-to-tr from-blue-500 to-gray-500 text-white shadow-lg"
              onClick={undoLastMove}
            >
              Undo last move
            </Button>
          </div>
        </div>
        <div className="col-span-12  lg:col-span-6 xl:col-span-7 p-3 ">
          <h1 className="text-center mb-6">Game settings</h1>

          <div className=" grid grid-cols-12 gap-2 ">
            <div className="flex flex-col xl:col-span-6 col-span-12 items-center ">
              <h3 className="mb-5 font-bold">Select chessbot difficulty</h3>
              <Tooltip content="Greater difficulty implies a deeper level of analysis!">
                <div className="mb-5">
                  <Tabs
                    key="md"
                    size={"md"}
                    aria-label="Tabs sizes"
                    onSelectionChange={tabSelectionChange}
                  >
                    {Object.entries(levels).map(([level]) => {
                      return <Tab key={level} title={level} />;
                    })}
                  </Tabs>
                </div>
              </Tooltip>
              <h3 className="mb-5 font-bold">Select game mode</h3>
              <Tooltip content="Play against Stockfish chessbot or against a friend!">
                <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 mb-5">
                  <Listbox
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    defaultSelectedKeys={["text"]}
                    onSelectionChange={onSelectionChange}
                  >
                    <ListboxItem key="text">Player 1 VS. Stockfish</ListboxItem>
                    <ListboxItem key="number">
                      Player 1 VS. Player 2
                    </ListboxItem>
                  </Listbox>
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-col xl:col-span-6 col-span-12  justify-center items-center">
              <h3 className="font-bold mb-5 ">Select board style</h3>
              <div className="flex gap-4">
                <div
                  className={
                    style === "brown"
                      ? "border-3 border-primary rounded-lg"
                      : ""
                  }
                >
                  <Image
                    className="hover:cursor-pointer "
                    isZoomed
                    width={140}
                    src={light}
                    onClick={() => {
                      style === "green" ? setStyle("brown") : "";
                    }}
                  />
                </div>
                <div
                  className={
                    style === "green"
                      ? "border-3 border-primary rounded-lg"
                      : ""
                  }
                >
                  <Image
                    className="hover:cursor-pointer"
                    isZoomed
                    width={140}
                    height={140}
                    src={green}
                    onClick={() => {
                      style === "brown" ? setStyle("green") : "";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-center mb-1">Movements history</h1>
          <div className=" flex flex-col justify-center items-center">
            <ScrollShadow className="w-[350px] lg:w-[450px] h-[270px] flex flex-col items-center justify-center p-5">
              <Card className="w-[300px] lg:w-[400px] min-h-[220px] ">
                <CardBody>
                  <div className="flex justify-around mb-2 ml-4 border-b-1 pb-2 border-#f2f2f2">
                    <Chip color="primary">White</Chip>
                    <Chip color="primary">Black</Chip>
                  </div>
                  {history.map((elem, i, array) => {
                    return (
                      <div className="" key={i}>
                        {i % 2 === 0 && (
                          <div className="flex p-1 ">
                            <div className="font-bold">
                              {i % 2 === 0 &&
                                arr.indexOf(
                                  arr.filter((elemento) => elemento === elem)[0]
                                ) + 1}
                              .
                            </div>

                            <div className="flex justify-around flex-grow">
                              <h4>{elem}</h4>
                              <h4>{array[i + 1]}</h4>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardBody>
              </Card>
            </ScrollShadow>
          </div>
        </div>
      </div>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Game finished!
              </ModalHeader>
              <ModalBody>
                <h4>
                  {game.in_checkmate()
                    ? nextToMove === "w"
                      ? "Black won by checkmate!"
                      : "White won by checkmate!"
                    : game.insufficient_material()
                    ? "Game drawn due to insufficient material!"
                    : game.in_threefold_repetition()
                    ? "Game drawn due to three fold repetition!"
                    : "Its a draw"}
                </h4>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    resetGame();
                  }}
                >
                  Play again!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Chessboard;
