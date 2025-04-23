import { motion } from "framer-motion";

export function LightPullThemeSwitcher() {
    const toggleDarkMode = () => {
        const root = document.documentElement;
        root.classList.toggle("dark");
    };

    return (
      <div className="relative py-6 p-2 overflow-hidden">
        <motion.div
          drag="y"
          dragDirectionLock
          onDragEnd={(event: any, info: { offset: { y: number; }; }) => {
            if (info.offset.y > 0) {
              toggleDarkMode();
            }
          }}
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          dragElastic={0.075}
          whileDrag={{ cursor: "grabbing" }}
          className="relative bottom-0 w-6 h-6 rounded-full 
               bg-[radial-gradient(circle_at_center,_#facc15,_#fcd34d,_#fef9c3)] 
               dark:bg-[radial-gradient(circle_at_center,_#4b5563,_#1f2937,_#000)] 
               shadow-[0_0_10px_4px_rgba(250,204,21,0.5)] 
               dark:shadow-[0_0_10px_3px_rgba(31,41,55,0.7)]
               cursor-pointer"
        >
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-neutral-200 dark:bg-neutral-700"></div>
        </motion.div>
      </div>
    );
}