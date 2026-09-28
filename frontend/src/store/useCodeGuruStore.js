import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialPlayerData, chapterMissions, mapNodes } from '../data/mockData'

export const useCodeGuruStore = create()(
  persist(
    (set, get) => ({
      player: initialPlayerData,
      missions: chapterMissions,
      mapNodes: mapNodes,
      authPhone: '+91 98765 43210',
      otpCode: '742918',
      enteredOtp: ['', '', '', '', '', ''],
      activeDigitIndex: 0,
      selectedLanguage: 'Python',
      interfaceLanguage: 'English',
      lastCompletedMission: null,

      setAuthPhone: (phone) => set({ authPhone: phone }),
      
      setEnteredOtp: (otp) => set({ enteredOtp: otp }),
      
      addOtpDigit: (digit, targetIndex = null) => {
        const { enteredOtp } = get()
        const newOtp = [...enteredOtp]
        let slot = targetIndex
        if (slot === null || slot === undefined) {
          slot = newOtp.findIndex((d) => d === '')
        }
        if (slot !== -1 && slot < 6) {
          newOtp[slot] = String(digit)
          set({ enteredOtp: newOtp })
        }
      },

      clearOtp: () => set({ enteredOtp: ['', '', '', '', '', ''] }),

      setSelectedLanguage: (lang) => {
        set((state) => ({
          selectedLanguage: lang,
          player: { ...state.player, selectedLanguage: lang },
        }))
      },

      setInterfaceLanguage: (lang) => set({ interfaceLanguage: lang }),

      completeMission: (missionId, stats = {}) => {
        set((state) => {
          const missionIndex = state.missions.findIndex((mission) => mission.id === missionId)
          const mission = state.missions[missionIndex]
          if (!mission) return state

          const alreadyCompleted = state.player.completedMissions.includes(missionId)
          const nextMission = state.missions[missionIndex + 1]
          const xpEarned = stats.xpEarned ?? mission.xpReward ?? 80
          const updatedMissions = state.missions.map((item, index) => ({
            ...item,
            isCompleted: item.id === missionId ? true : item.isCompleted,
            isLocked: index === missionIndex + 1 ? false : item.isLocked,
            stars: item.id === missionId ? 3 : item.stars,
          }))

          const newCompleted = Array.from(new Set([...state.player.completedMissions, missionId]))
          const newUnlocked = nextMission
            ? Array.from(new Set([...state.player.unlockedMissions, nextMission.id]))
            : state.player.unlockedMissions

          return {
            missions: updatedMissions,
            lastCompletedMission: {
              id: missionId,
              title: mission.title,
              nextMissionId: nextMission?.id ?? null,
              nextMissionTitle: nextMission?.title ?? null,
              accuracy: stats.accuracy ?? 100,
              timeTaken: stats.timeTaken ?? '00:00',
              xpEarned,
              testCasesPassed: stats.testCasesPassed ?? 3,
              totalTestCases: stats.totalTestCases ?? 3,
            },
            player: {
              ...state.player,
              xp: state.player.xp + (alreadyCompleted ? 0 : xpEarned),
              solvedCount: state.player.solvedCount + (alreadyCompleted ? 0 : 1),
              completedMissions: newCompleted,
              unlockedMissions: newUnlocked,
            },
          }
        })
      },

      resetPlayerProgress: () => {
        set({
          player: initialPlayerData,
          missions: chapterMissions,
          mapNodes: mapNodes,
          enteredOtp: ['', '', '', '', '', ''],
        })
      },
    }),
    {
      name: 'codeguru-storage-v1',
    }
  )
)
