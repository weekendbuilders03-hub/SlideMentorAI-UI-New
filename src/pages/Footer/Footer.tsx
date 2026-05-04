import { LinkedinFilled, XOutlined } from "@ant-design/icons";
import "./Footer.scss";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer className="pp-footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <motion.div className="pp-footer__inner" initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        {/* Left */}
        <motion.div className="pp-footer__brand" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
          <div className="pp-footer__logo">■</div>
          <span>SlideMentor AI</span>
        </motion.div>

        {/* Center links */}
        <motion.div className="pp-footer__links" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </motion.div>

        {/* Right socials */}
        <motion.div className="pp-footer__social" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
          <motion.a href="#" aria-label="Twitter" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.18 }}>
            <XOutlined />
          </motion.a>
          <motion.a href="#" aria-label="LinkedIn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.18 }}>
            <LinkedinFilled />
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div className="pp-footer__copy" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
        © 2026 SlideMentor AI. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
