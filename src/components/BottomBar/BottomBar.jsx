import { BsGithub, BsCodeSlash } from "react-icons/bs";

const BottomBar = () => {
  return (
    <div className="flex justify-center h-[66px] items-center ">
      <a
        href="https://github.com/DavidPalacio99"
        target={"_blanck"}
        // className="border"
      >
        <BsGithub className="text-primary hover-scale font-bold transform transition-transform hover:scale-150" />
      </a>
      <h3 className=" mx-3 font-bold">Developed by David Palacio</h3>
      <a
        href="https://github.com/DavidPalacio99/Chessbot"
        target={"_blanck"}
        // className="border"
      >
        <BsCodeSlash className="text-primary hover-scale font-bold transform transition-transform hover:scale-150" />
      </a>
    </div>
  );
};

export default BottomBar;
