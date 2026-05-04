
import { Layout, Drawer, Grid } from "antd";
import Button from '../../components/Button/Button';
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./NavBar.scss";

const { Header } = Layout;
const { useBreakpoint } = Grid;


const NAV_LINKS = [
  { label: "Features", path: "/#features" },
  { label: "Pricing", path: "/pricing" },
  { label: "Testimonials", path: "/#testimonials" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isDesktop = screens.lg;
  const [open, setOpen] = useState(false);

  const handleNav = (path: string) => {
    if (path.startsWith("/#")) {
      // For anchor links, scroll to section
      const id = path.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
    setOpen(false);
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <>
      <Header className="pp-navbar" role="navigation" aria-label="Main Navigation">
        <div className="pp-navbar__inner">
          {/* LEFT */}
          <motion.div
            className="pp-navbar__left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pp-navbar__icon" aria-label="Logo" tabIndex={0}>
              <span />
            </div>
            <span className="pp-navbar__brand">SlideMentor AI</span>
          </motion.div>

          {/* CENTER (DESKTOP ONLY) */}
          {isDesktop && (
            <motion.nav
              className="pp-navbar__center"
              aria-label="Main Links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  tabIndex={0}
                  onClick={() => handleNav(link.path)}
                  role="link"
                  style={{ cursor: "pointer" }}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05, color: "#1890ff" }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
          )}

          {/* RIGHT */}
          <div className="pp-navbar__right">
            {isDesktop ? (
              <>
                <Button className="pp-navbar__login" onClick={() => handleNav("/authentication")}>Log In</Button>
                <Button type="primary" className="pp-navbar__cta" onClick={() => handleNav("/upload")}>Get Started</Button>
              </>
            ) : (
              <Button
                type="text"
                icon={<MenuOutlined />}
                className="pp-navbar__menu"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        </div>
      </Header>

      {/* MOBILE DRAWER */}
      <Drawer
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        className="pp-navbar__drawer"
        aria-label="Mobile Navigation"
      >
        <nav className="pp-navbar__drawerMenu">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              tabIndex={0}
              onClick={() => handleNav(link.path)}
              role="link"
              style={{ cursor: "pointer" }}
            >
              {link.label}
            </a>
          ))}
          <a tabIndex={0} onClick={() => handleNav("/authentication")} role="link" style={{ cursor: "pointer" }}>Login</a>
          <Button type="primary" block onClick={() => handleNav("/upload")}>Get Started</Button>
        </nav>
      </Drawer>
    </>
  );
};

export default Navbar;
