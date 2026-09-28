import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Lock } from 'lucide-react'
import worldMap from '../../assets/world_map_clean.png'

export default function LearningMap() {
  const navigate = useNavigate()
  const [activeTooltip, setActiveTooltip] = useState(null)

  // The matching CodeGuru map artwork contains the region labels and controls.
  const nodes = [
    {
      id: 'foundations',
      num: '1',
      title: 'Foundations',
      subtitle: 'Variables, Loops, Basics',
      status: 'active',
      lessons: '3 / 12 Lessons',
      x: 21,
      y: 20,
      path: '/mission/1.1',
      accent: '#00FF66',
    },
    {
      id: 'data-structures',
      num: '2',
      title: 'Data Structures',
      subtitle: 'Arrays, Stacks, Trees',
      status: 'locked',
      requirement: 'Complete Chapter 1: Foundations to unlock',
      x: 50,
      y: 17,
      accent: '#64B5F6',
    },
    {
      id: 'algorithms',
      num: '3',
      title: 'Algorithms',
      subtitle: 'Sorting, DP, Greedy',
      status: 'locked',
      requirement: 'Complete Chapter 2: Data Structures to unlock',
      x: 77,
      y: 21,
      accent: '#FFD54F',
    },
    {
      id: 'problem-solving',
      num: '4',
      title: 'Problem Solving',
      subtitle: 'Real World Problems',
      status: 'locked',
      requirement: 'Complete Chapter 3: Algorithms to unlock',
      x: 76,
      y: 65,
      accent: '#00E5FF',
    },
    {
      id: 'projects',
      num: '5',
      title: 'Projects',
      subtitle: 'Build & Showcase',
      status: 'locked',
      requirement: 'Complete Chapter 4: Problem Solving to unlock',
      x: 51,
      y: 72,
      accent: '#BA68C8',
    },
    {
      id: 'compete',
      num: '6',
      title: 'Compete',
      subtitle: 'Contests & Leaderboards',
      status: 'locked',
      requirement: 'Complete Chapter 5: Projects to unlock',
      x: 22,
      y: 64,
      accent: '#FF7043',
    },
  ]

  const handleNodeClick = (node) => {
    if (node.status === 'active') {
      navigate(node.path)
    } else {
      setActiveTooltip(node)
      setTimeout(() => setActiveTooltip(null), 3500)
    }
  }

  return (
    <div className="relative w-full rounded-3xl bg-[#070B09] border border-[#17251C] overflow-hidden shadow-2xl group select-none">
      <div className="relative aspect-[946/625] min-h-[220px] w-full overflow-hidden sm:min-h-[360px]">
        <img src={worldMap} alt="Illustrated CodeGuru learning world with six connected regions" className="absolute inset-0 h-full w-full object-cover" />
        {nodes.map((node) => <button key={node.id} type="button" aria-label={`${node.title}${node.status === 'active' ? ', continue learning' : ', locked'}`} onClick={() => handleNodeClick(node)} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-primary" style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.id === 'foundations' ? '23%' : '20%', height: '35%' }} />)}

        {/* 6. Dynamic Floating Lock Notification Tooltip */}
        <AnimatePresence>
          {activeTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-[#0F1713]/95 border border-primary/40 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs text-neutral-200"
            >
              <div className="w-7 h-7 rounded-xl bg-[#17251D] border border-primary/30 flex items-center justify-center text-primary">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-white">
                  Chapter: {activeTooltip.title}
                </span>
                <span className="text-[11px] text-primary font-mono">
                  {activeTooltip.requirement}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
