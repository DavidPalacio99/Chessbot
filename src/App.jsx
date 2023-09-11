import TopBar from "./components/TopBar/TopBar";
import Chessboard from "./components/Chessboard/Chessboard";
import { Toaster } from "react-hot-toast";
import BottomBar from "./components/BottomBar/BottomBar";

function App() {
  return (
    <div className="container">
      <Toaster />
      <TopBar />
      <Chessboard />
      <BottomBar />
    </div>
  );
}

export default App;
