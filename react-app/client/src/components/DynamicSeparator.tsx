import { motion } from "framer-motion";

const DynamicSeparator = () => {
  return (
    <div className="relative py-8 overflow-hidden">
      {/* Main separator line */}
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="relative h-px bg-gradient-to-r from-transparent via-primary to-transparent">
          {/* Animated signal waves */}
          <motion.div
            className="absolute left-0 top-0 h-px bg-gradient-to-r from-primary to-transparent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Signal nodes/dots along the line */}
        <div className="absolute inset-0 flex justify-between items-center">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: i * 0.2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 3
              }}
            >
              {/* Main dot */}
              <div className="w-2 h-2 bg-primary rounded-full" />
              
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 w-2 h-2 border-2 border-primary rounded-full"
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
              
              {/* Signal waves */}
              <div className="absolute -top-8 -left-8 w-16 h-16 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {/* Radio wave lines */}
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      className={`absolute border border-primary/20 rounded-full`}
                      style={{
                        width: `${ring * 16}px`,
                        height: `${ring * 16}px`,
                        top: `${50 - (ring * 8)}%`,
                        left: `${50 - (ring * 8)}%`,
                      }}
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 0.1, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: ring * 0.5 + i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Central icon - telecommunications symbol */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative w-12 h-12 bg-background border-2 border-primary rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 10px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            {/* Radio tower icon */}
            <svg 
              className="w-6 h-6 text-primary" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <motion.path 
                d="M12 2v20"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.path 
                d="M8 8l4-4 4 4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.3
                }}
              />
              <motion.path 
                d="M16 12l-4-4-4 4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.6
                }}
              />
            </svg>
          </motion.div>
          
          {/* Signal emanating from center */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/30 rounded-full"
            animate={{
              scale: [1, 3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
          />
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 20">
          <motion.path
            d="M0,10 Q25,5 50,10 T100,10"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M0,15 Q25,10 50,15 T100,15"
            stroke="currentColor"
            strokeWidth="0.3"
            fill="none"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default DynamicSeparator;