import Breads from "./Breads";
import MenuToggler from "./MenuToggler";
import Time from "./Time";
import Fullscreen from "./Fullscreen";
import Notification from "./Notification";
import About from "./About";
import Avatar from "./Avatar";

function Header() {
  return (
    <>
      <div className="flex items-center">
        <MenuToggler />
        <Breads />
      </div>
      <div className="flex items-center justify-between w-420px">
        <Time />
        <Fullscreen />
        <Notification />
        <About />
        <Avatar />
      </div>
    </>
  );
}

export default Header;
