import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const Modal2 = ({ onClose, isOpen }) => {
  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              How to play ?
            </ModalHeader>
            <ModalBody>
              <p>
                Hello, challenger. Welcome to React Chessbot!.
                <br />
                <br />
                You are the white player, and your opponent is the black player
                (Stockfish chess engine or player 2). To play, click the piece
                you want to move, and then click on the desired destination.
                <br />
                <br />
                You can adjust the chessbot's difficulty by clicking on the
                difficulty buttons (easy, medium, and hard). Keep in mind that
                higher difficulty levels require more analysis from the chess
                engine, which can result in longer response times for the bot's
                move.
                <br />
                <br />
                You can undo a move by clicking on the previous move button and
                you can also reset the game.
              </p>
              <h2 className="font-bold">Chess rules</h2>
              <p>
                You can visit this{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Rules_of_chess"
                  target={"_blanck"}
                  className="text-primary"
                >
                  link
                </a>{" "}
                to learn chess rules. React Chessbot implements all of these
                rules, except for resigning, and time limits.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Got it!
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Modal2;
