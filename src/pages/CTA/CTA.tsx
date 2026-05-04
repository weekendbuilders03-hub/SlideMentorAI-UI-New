import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./CTA.scss";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
    const navigate = useNavigate();
    const handleSignIn = () => {
        navigate("/authentication");
    };
    return (
        <section className="pp-cta">
            <motion.div
                className="pp-cta__card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <motion.h2
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Ready to perfect your pitch?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    Join thousands of professionals, startup founders, and
                    public speakers using AI to win their audience.
                </motion.p>

                <motion.div className="pp-cta__actions" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }} style={{ display: 'inline-block', marginRight: 12 }}>
                        <Button className="pp-btn pp-btn--primary" onClick={handleSignIn}>
                            <GoogleOutlined />
                            Sign in with Google
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }} style={{ display: 'inline-block' }}>
                        <Button className="pp-btn pp-btn--secondary">
                            Schedule a Demo
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default CTA;
