import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BsShare } from "react-icons/bs";
import useSession from "../hooks/useSession";
import IconButton from "./IconButton";

export default function ShareButton() {
  const { session } = useSession();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  return (
    <IconButton
      tabIndex={2}
      className="relative"
      onClick={() => {
        setIsPopoverVisible(true);
        navigator.clipboard.writeText(window.location.origin + "/?session_id=" + session?.id);
      }}
    >
      <BsShare />
      <AnimatePresence>
        {isPopoverVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2.5 }}
            transition={{ duration: 0.35 }}
            onAnimationComplete={() => {
              setIsPopoverVisible(false);
            }}
            className="absolute p-2 top-full -right-12"
          >
            <div className="task-modal w-24 text-sm">Link copied</div>
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
}
