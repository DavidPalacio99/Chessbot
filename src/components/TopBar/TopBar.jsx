import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  useDisclosure,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
// import { BsSun, BsMoon } from "react-icons/bs";
// import { Switch } from "@nextui-org/react";
import logo from "../../assets/logo.jpg";
import Modal2 from "../Modal2/Modal2";

const TopBar = () => {
  const { onClose, isOpen, onOpen } = useDisclosure();

  const refreshPage = () => {
    window.location.reload(); // Recargar la página actual
  };

  return (
    <>
      <Navbar isBordered>
        <NavbarBrand onClick={refreshPage} className="cursor-pointer">
          <img src={logo} className="w-9 mr-3" />
          <p className="font-bold text-inherit">React Chessbot</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <h3 onClick={onOpen} className="cursor-pointer text-primary">
              How to play ?
            </h3>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <NavbarItem className="hidden md:block">Welcome, User</NavbarItem>
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">User@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="board">Board and Pieces</DropdownItem>
                <DropdownItem key="live">Live chess</DropdownItem>
                <DropdownItem key="daily">Daily chess</DropdownItem>
                <DropdownItem key="lessons">Chess lessons</DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          {/* <NavbarItem>
            <Switch
              defaultSelected
              size="lg"
              color="primary"
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <BsSun className={className} />
                ) : (
                  <BsMoon className={className} />
                )
              }
            ></Switch>
          </NavbarItem> */}
        </NavbarContent>
      </Navbar>
      <Modal2 onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default TopBar;
