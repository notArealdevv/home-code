import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { HOUSEMATES } from '../constants';

interface DishTrackerPageProps {
  dishes: Record<string, string[]>;
  addDishViolation: (person: string) => void;
  removeDishViolation: (person: string, index: number) => void;
}

export const DishTrackerPage = ({ dishes, addDishViolation, removeDishViolation }: DishTrackerPageProps): JSX.Element => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-xl p-6 border border-ash/30"
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-teal to-mutedTeal bg-clip-text text-transparent mb-6"
        >
          Dish Violation Tracker
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {HOUSEMATES.map((person, index) => (
            <motion.div
              key={person}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-card-hover rounded-xl p-5 border border-ash/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-lg text-cream">{person}</span>
                  {dishes[person]?.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-3 text-teal font-semibold"
                    >
                      {dishes[person].length} violation{dishes[person].length > 1 ? 's' : ''} (${dishes[person].length * 5})
                    </motion.span>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#77ACA2' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addDishViolation(person)}
                    className="flex items-center gap-2 bg-teal hover:bg-mutedTeal text-ink px-6 py-2 rounded-lg font-medium transition shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Violation
                  </motion.button>
                  {dishes[person]?.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeDishViolation(person, dishes[person].length - 1)}
                      className="flex items-center gap-2 bg-ash/50 hover:bg-ash/70 text-ink px-6 py-2 rounded-lg font-medium transition"
                    >
                      <X className="w-4 h-4" />
                      Undo Last
                    </motion.button>
                  )}
                </div>
              </div>
              {dishes[person]?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {dishes[person].map((date, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-card px-3 py-1 rounded-full text-sm text-cream border border-ash/30 shadow-sm"
                    >
                      {date}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
