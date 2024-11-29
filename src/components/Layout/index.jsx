import Footer from "../Footer";
import Header from "../Header/Header";
import HorizontalDivider from "../HorizontalDivider";
import "./index.scss";

// ================================================

const Layout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <HorizontalDivider /> */}
      <Footer />
    </>
  );
};

export default Layout;
