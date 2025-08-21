import { motion, AnimatePresence } from 'framer-motion';

const IFrameModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-xl p-4 w-[90%] max-w-[800px] h-[80vh] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <iframe
                        src="https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/14/20/20241214203234-PDJ8GLY8.json"
                        className="w-full h-full rounded-lg"
                        title="Chat Interface"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IFrameModal;