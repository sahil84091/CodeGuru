import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { 
  ArrowRight, 
  Clock, 
  RotateCcw, 
  Play, 
  Check, 
  AlertCircle, 
  Code2, 
  Sun, 
  Maximize2, 
  HelpCircle,
  FileCode,
  Terminal
} from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import { activeChallengeData } from '../data/mockData'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import challengeLandscape from '../assets/world_map_clean.png'

export default function ChallengePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editorPanelRef = useRef(null)
  const { completeMission, missions, selectedLanguage } = useCodeGuruStore()
  const mission = missions.find((item) => item.id === id)
  const codeLanguage = selectedLanguage === 'DSA' ? 'python' : selectedLanguage === 'C++' ? 'cpp' : selectedLanguage.toLowerCase()
  const additionalChallenges = {
    '1.3': {
      id: '1.3', mission: 'Mission 1.3', missionName: 'Input Terminal',
      challengeName: 'Convert Input Before Adding', type: 'Debugging',
      description: 'The age arrives as text. Convert it to a number before adding one so the program prints 20.', expectedOutput: '20',
      initialCode: codeLanguage === 'cpp'
        ? '#include <iostream>\n#include <string>\n\nstd::string rawAge = "19";\nstd::cout << rawAge + 1 << std::endl;'
        : codeLanguage === 'java' ? 'String rawAge = "19";\nSystem.out.println(rawAge + 1);' : 'raw_age = input("Age: ")\nprint(raw_age + 1)',
      solutionCode: codeLanguage === 'cpp'
        ? '#include <iostream>\n#include <string>\n\nint age = std::stoi("19");\nstd::cout << age + 1 << std::endl;'
        : codeLanguage === 'java' ? 'int age = Integer.parseInt("19");\nSystem.out.println(age + 1);' : 'age = int(input("Age: "))\nprint(age + 1)',
      hints: ['Input values arrive as text.', 'Convert the value before doing arithmetic.'],
    },
    '1.4': {
      id: '1.4', mission: 'Mission 1.4', missionName: 'Swap the Values',
      challengeName: 'Swap Without Losing a Value', type: 'Complete the Code',
      description: 'Swap left and right so the output is south, then north. Preserve both original values.', expectedOutput: 'south\nnorth',
      initialCode: codeLanguage === 'cpp'
        ? '#include <iostream>\n#include <string>\n\nstd::string left = "north";\nstd::string right = "south";\nleft = right;'
        : codeLanguage === 'java' ? 'String left = "north";\nString right = "south";\nleft = right;' : 'left = "north"\nright = "south"\nleft = right\nright = left',
      solutionCode: codeLanguage === 'cpp'
        ? '#include <iostream>\n#include <string>\n\nstd::string left = "north";\nstd::string right = "south";\nstd::string temp = left;\nleft = right;\nright = temp;\nstd::cout << left << "\\n" << right;'
        : codeLanguage === 'java' ? 'String left = "north";\nString right = "south";\nString temp = left;\nleft = right;\nright = temp;\nSystem.out.println(left + "\\n" + right);' : 'left = "north"\nright = "south"\ntemp = left\nleft = right\nright = temp\nprint(left)\nprint(right)',
      hints: ['Keep a copy of the first value before replacing it.', 'Use a temporary variable, then finish the swap.'],
    },
    '1.5': {
      id: '1.5', mission: 'Mission 1.5', missionName: 'Mini Project',
      challengeName: 'Make the Total Add Up', type: 'Debugging',
      description: 'This tiny calculator should add 8 and 4. Repair the operation so the output is 12.', expectedOutput: '12',
      initialCode: codeLanguage === 'cpp'
        ? '#include <iostream>\n\nint first = 8;\nint second = 4;\nstd::cout << first - second;'
        : codeLanguage === 'java' ? 'int first = 8;\nint second = 4;\nSystem.out.println(first - second);' : 'first = 8\nsecond = 4\nprint(first - second)',
      solutionCode: codeLanguage === 'cpp'
        ? '#include <iostream>\n\nint first = 8;\nint second = 4;\nstd::cout << first + second;'
        : codeLanguage === 'java' ? 'int first = 8;\nint second = 4;\nSystem.out.println(first + second);' : 'first = 8\nsecond = 4\nprint(first + second)',
      hints: ['Check which arithmetic operation the calculator uses.', 'The goal is a sum, not a difference.'],
    },
  }
  const baseChallenge = id === '1.2'
    ? {
        ...activeChallengeData,
        id: '1.2',
        mission: 'Mission 1.2',
        missionName: 'Type Quest',
        challengeName: 'Convert Before You Combine',
        type: 'Debugging',
        description: 'This code should add one to the age and print 20. Convert the text value before doing the math.',
        expectedOutput: '20',
        initialCode: codeLanguage === 'cpp'
          ? '#include <iostream>\n#include <string>\n\nstd::string age = "19";\nstd::cout << age + 1 << std::endl;'
          : codeLanguage === 'java'
            ? 'String age = "19";\nSystem.out.println(age + 1);'
            : 'age = "19"\nprint(age + 1)',
        solutionCode: codeLanguage === 'cpp'
          ? '#include <iostream>\n#include <string>\n\nint age = std::stoi("19");\nstd::cout << age + 1 << std::endl;'
          : codeLanguage === 'java'
            ? 'int age = Integer.parseInt("19");\nSystem.out.println(age + 1);'
            : 'age = int("19")\nprint(age + 1)',
        hints: codeLanguage === 'cpp'
          ? ['The value starts as text.', 'Convert it with std::stoi() before adding 1.']
          : codeLanguage === 'java'
            ? ['The value starts as text.', 'Convert it with Integer.parseInt() before adding 1.']
            : ['The value starts as text.', 'Convert it to an integer with int() before adding 1.'],
        examples: [{ input: '"19"', output: '20', explanation: 'Convert the text to a number before adding.' }],
        testCases: [1, 2, 3].map((number) => ({
          id: number,
          name: `Test Case ${number}`,
          description: 'Checks that text input is converted before arithmetic.',
          input: '19',
          expected: '20',
        })),
      }
    : additionalChallenges[id]
      ? { ...activeChallengeData, ...additionalChallenges[id] }
      : {
        ...activeChallengeData,
        initialCode: codeLanguage === 'cpp'
          ? '#include <iostream>\n\nfor (int i = 0; i > 5; ++i) {\n    std::cout << i << std::endl;\n}'
          : codeLanguage === 'java'
            ? 'for (int i = 0; i > 5; i++) {\n    System.out.println(i);\n}'
            : activeChallengeData.initialCode,
        solutionCode: codeLanguage === 'cpp'
          ? '#include <iostream>\n\nfor (int i = 0; i < 5; ++i) {\n    std::cout << i << std::endl;\n}'
          : codeLanguage === 'java'
            ? 'for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}'
            : activeChallengeData.solutionCode,
      }
  const challenge = {
    ...baseChallenge,
    id: id || baseChallenge.id,
    mission: `Mission ${id || baseChallenge.id}`,
    missionName: mission?.title || baseChallenge.missionName,
    language: codeLanguage,
    ...(id && id !== '1.1' ? {
      examples: [{ input: 'Sample values', output: baseChallenge.expectedOutput, explanation: 'Compare the expected result with the corrected code.' }],
      testCases: activeChallengeData.testCases.map((testCase) => ({ ...testCase, description: 'Checks that the corrected code returns the expected result.', expected: baseChallenge.expectedOutput })),
    } : {}),
  }
  const initialDuration = 14 * 60 + 27

  const [code, setCode] = useState(challenge.initialCode)
  const [activeTab, setActiveTab] = useState('problem') // 'problem' | 'examples' | 'hints'
  const [rightTab, setRightTab] = useState('testcases') // 'testcases' | 'output'
  const [editorTheme, setEditorTheme] = useState('vs-dark')
  const [timeLeft, setTimeLeft] = useState(initialDuration)
  
  // Test case execution status
  const [testResults, setTestResults] = useState({
    1: 'failed', // starts failed as in screenshot
    2: 'not_run',
    3: 'not_run',
  })
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState(id === '1.2'
    ? 'TypeError: can only concatenate str (not "int") to str'
    : 'NameError: name \'rage\' is not defined. Did you mean: \'range\'?')

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isSolutionCorrect = (source) => {
    if (id === '1.2' || id === '1.3') {
      if (codeLanguage === 'cpp') return /int\s+age\s*=\s*std::stoi\(\s*["']19["']\s*\)/.test(source)
      if (codeLanguage === 'java') return /int\s+age\s*=\s*Integer\.parseInt\(\s*["']19["']\s*\)/.test(source)
      return /age\s*=\s*int\(/.test(source) && /print\(\s*age\s*\+\s*1\s*\)/.test(source)
    }
    if (id === '1.4') return /temp\s*=\s*left/.test(source) && /left\s*=\s*right/.test(source) && /right\s*=\s*temp/.test(source)
    if (id === '1.5') return /first\s*\+\s*second/.test(source)
    if (codeLanguage === 'cpp' || codeLanguage === 'java') return /i\s*<\s*5/.test(source)
    return /for\s+i\s+in\s+range\s*\(\s*5\s*\)\s*:\s*\n\s*print\(\s*i\s*\)/.test(source)
  }

  // Run Code logic
  const handleRunCode = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      const isFixed = isSolutionCorrect(code)

      if (isFixed) {
        setTestResults({
          1: 'passed',
          2: 'passed',
          3: 'passed',
        })
        setConsoleOutput(`${challenge.expectedOutput}\n\n[All test cases passed]`)
      } else {
        setTestResults({
          1: 'failed',
          2: 'not_run',
          3: 'not_run',
        })
        setConsoleOutput(
          'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\nNameError: name \'rage\' is not defined. Did you mean: \'range\'?'
        )
      }
    }, 400)
  }

  // Submit Solution logic
  const handleSubmit = () => {
    const isFixed = isSolutionCorrect(code)

    if (isFixed) {
      completeMission(challenge.id, {
        accuracy: 100,
        timeTaken: formatTimer(initialDuration - timeLeft),
        xpEarned: mission?.xpReward ?? 80,
        testCasesPassed: 3,
        totalTestCases: 3,
      })
      navigate(`/result/${challenge.id}`)
    } else {
      // Trigger execution to show failure
      handleRunCode()
      setRightTab('output')
    }
  }

  const handleResetCode = () => {
    setCode(challenge.initialCode)
    setTestResults({
      1: 'failed',
      2: 'not_run',
      3: 'not_run',
    })
    setConsoleOutput(id === '1.2'
      ? 'TypeError: can only concatenate str (not "int") to str'
      : 'NameError: name \'rage\' is not defined. Did you mean: \'range\'?')
  }

  return (
    <div className="min-h-screen md:h-screen w-full flex flex-col bg-[#060807] text-neutral-100 select-none overflow-x-hidden md:overflow-hidden">
      {/* Top Header Bar matching Reference Image 1 */}
      <header className="relative h-20 md:h-[116px] px-4 md:px-6 bg-[#090D0B] border-b border-[#152019] flex items-center justify-between flex-shrink-0 z-20 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(90deg,rgba(5,11,13,.94),rgba(5,11,13,.62),rgba(5,11,13,.92)),url(${challengeLandscape})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#060807]/70 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-6">
          <CodeGuruLogo size="sm" linkTo="/home" />

          {/* Breadcrumb Info */}
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-neutral-200">
              {challenge.chapter}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <span>{challenge.mission}</span>
              <span>&gt;</span>
              <span className="text-primary">{challenge.missionName}</span>
            </div>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="relative z-10 hidden lg:flex items-center gap-3">
          {/* Step 1: Read */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132319] border border-primary/30 text-primary text-xs font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Read</span>
          </div>
          <div className="w-4 h-0.5 bg-primary/40" />

          {/* Step 2: Solve (Active) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#16271D] border-2 border-primary text-primary text-xs font-mono font-bold shadow-[0_0_12px_#00FF66]">
            <span className="w-4 h-4 rounded-full bg-primary text-[#040D07] flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Solve</span>
          </div>
          <div className="w-4 h-0.5 bg-neutral-800" />

          {/* Step 3: Test */}
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono">
            <span className="w-4 h-4 rounded-full border border-neutral-700 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Test</span>
          </div>
          <div className="w-4 h-0.5 bg-neutral-800" />

          {/* Step 4: Complete */}
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono">
            <span className="w-4 h-4 rounded-full border border-neutral-700 flex items-center justify-center text-[10px]">
              4
            </span>
            <span>Complete</span>
          </div>
        </div>

        {/* Right Timer & Exit Challenge */}
        <div className="relative z-10 flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block text-right pr-2">
            <p className="text-[11px] italic font-sans text-neutral-400">
              "Small steps build big coders."
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111A14] border border-[#1D2B22] text-xs font-mono">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-bold text-white tracking-wider">{formatTimer(timeLeft)}</span>
            <span className="text-[10px] text-neutral-400">Left</span>
          </div>

          <button
            onClick={() => navigate(`/mission/${challenge.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111613] hover:bg-[#18201B] border border-[#202C24] hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            <span>Exit Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main 3-Column IDE Workspace */}
      <div className="flex-none md:flex-1 grid grid-cols-1 md:grid-cols-12 md:min-h-0 bg-[#080B0A] p-3 gap-3 md:overflow-hidden">
        {/* Left Column: Problem Details / Hints (3.5 cols) */}
        <div className="min-h-[340px] md:min-h-0 md:col-span-4 lg:col-span-3 rounded-2xl bg-[#0D1310] border border-[#17231B] flex flex-col overflow-hidden shadow-lg">
          {/* Problem Tabs */}
          <div className="flex items-center border-b border-[#162119] px-3 pt-2 bg-[#0A0F0C]">
            {[
              { id: 'problem', label: 'Problem' },
              { id: 'examples', label: 'Examples' },
              { id: 'hints', label: 'Hints' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-mono font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Problem Content */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between gap-4">
            {activeTab === 'problem' && (
              <div className="flex flex-col gap-4">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#14231A] text-primary border border-primary/30 text-[11px] font-mono flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    <span>{challenge.type}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#121A15] text-primary border border-[#23352A] text-[11px] font-mono">
                    Easy
                  </span>
                </div>

                <h2 className="text-xl font-heading font-extrabold text-white">
                  {challenge.challengeName}
                </h2>

                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {challenge.description}
                </p>

                {/* Expected Output Card */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono text-neutral-400">
                    Expected Output:
                  </span>
                  <div className="p-3 rounded-xl bg-[#090E0B] border border-[#19241C] font-mono text-xs text-primary leading-tight">
                    <pre className="whitespace-pre-wrap">{challenge.expectedOutput}</pre>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1 text-[11px] text-neutral-400 font-sans">
                  <span className="font-semibold text-neutral-300">Note:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Use the provided editor to correct the code.</li>
                    <li>Edit the code, run it to check your output, then submit when it passes.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-neutral-200">
                  Code Examples
                </span>
                {challenge.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#090E0B] border border-[#19241C] flex flex-col gap-1.5 text-xs font-mono">
                    <span className="text-neutral-400">Input: <span className="text-white">{ex.input}</span></span>
                    <span className="text-neutral-400">Output: <span className="text-primary">{ex.output}</span></span>
                    <span className="text-[11px] text-neutral-500 font-sans">{ex.explanation}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono font-bold text-neutral-200">
                  Hints & Tips
                </span>
                {challenge.hints.map((hint, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#121B16] border border-[#202E25] text-xs text-neutral-300 font-sans flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Motivational Quote at bottom of left panel */}
            <div className="p-3 rounded-xl bg-[#0B100D] border border-[#16211A] text-[11px] italic text-neutral-400 font-sans">
              "Debugging is not a setback, it's a step forward."
            </div>
          </div>
        </div>

        {/* Center Column: Monaco Code Editor (5.5 cols) */}
        <div ref={editorPanelRef} aria-label="Code editor" className="min-h-[520px] md:min-h-0 md:col-span-8 lg:col-span-6 rounded-2xl bg-[#0A0E0C] border border-[#17221A] flex flex-col overflow-hidden shadow-lg [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:p-4">
          {/* File Header Bar */}
          <div className="h-10 px-3 bg-[#080D0B] border-b border-[#141E17] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2 px-3 py-1 rounded-t-lg bg-[#0F1612] border-t border-x border-[#1E2B22] text-xs font-mono text-neutral-200">
                <FileCode className="w-3.5 h-3.5 text-primary" />
                <span>{codeLanguage === 'cpp' ? 'main.cpp' : codeLanguage === 'java' ? 'Main.java' : 'main.py'}</span>
              </div>
            </div>

            {/* Language & Editor Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111713] border border-[#1E2821] text-xs font-mono text-neutral-300">
                <span className="text-[10px] text-primary">&lt;/&gt;</span>
                <span>{codeLanguage === 'cpp' ? 'C++' : codeLanguage === 'java' ? 'Java' : 'Python 3'}</span>
              </div>
              <button 
                title={editorTheme === 'vs-dark' ? 'Switch editor to light theme' : 'Switch editor to dark theme'}
                aria-label={editorTheme === 'vs-dark' ? 'Switch editor to light theme' : 'Switch editor to dark theme'}
                onClick={() => setEditorTheme((theme) => theme === 'vs-dark' ? 'vs' : 'vs-dark')}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#131B16] transition-colors"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button 
                title="Fullscreen"
                aria-label="Toggle fullscreen editor"
                onClick={() => document.fullscreenElement === editorPanelRef.current ? document.exitFullscreen() : editorPanelRef.current?.requestFullscreen?.()}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#131B16] transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage={codeLanguage}
              language={codeLanguage}
              theme={editorTheme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                backgroundColor: '#0A0E0C',
                cursorBlinking: 'smooth',
                tabSize: 4,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Right Column: Test Cases & Output (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 rounded-2xl bg-[#0D1310] border border-[#17231B] flex-col overflow-hidden shadow-lg">
          {/* Header Tabs */}
          <div className="flex items-center border-b border-[#162119] px-3 pt-2 bg-[#0A0F0C]">
            {[
              { id: 'testcases', label: 'Test Cases' },
              { id: 'output', label: 'Output' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id)}
                className={`px-3 py-2 text-xs font-mono font-medium transition-colors border-b-2 cursor-pointer ${
                  rightTab === tab.id
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Test Cases / Output Area */}
          <div className="flex-1 p-3.5 overflow-y-auto flex flex-col justify-between gap-3">
            {rightTab === 'testcases' ? (
              <div className="flex flex-col gap-3">
                {challenge.testCases.map((tc) => {
                  const status = testResults[tc.id]

                  return (
                    <div
                      key={tc.id}
                      className="p-3 rounded-xl bg-[#0A0F0C] border border-[#17221A] flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-white">
                          {tc.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleRunCode}
                            className="p-1 rounded-md bg-[#131D17] hover:bg-[#1A261F] text-neutral-300 hover:text-primary transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>

                          {status === 'passed' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                              Passed
                            </span>
                          )}
                          {status === 'failed' && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono font-bold">
                              Failed
                            </span>
                          )}
                          {status === 'not_run' && (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-500 text-[10px] font-mono">
                              Not Run
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-400 font-sans">
                        {tc.description}
                      </p>
                    </div>
                  )
                })}

                {/* Helpful Instruction Alert */}
                <div className="p-3 rounded-xl bg-[#111A15] border border-[#1D2B22] flex items-center gap-2.5 text-xs text-neutral-300 font-sans">
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Fix the error and run again.</span>
                </div>
              </div>
            ) : (
              /* Terminal Output View */
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span>Execution Terminal</span>
                </span>
                <div className="flex-1 p-3 rounded-xl bg-[#060907] border border-[#141C16] font-mono text-xs text-neutral-300 overflow-y-auto whitespace-pre-wrap">
                  {consoleOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="lg:hidden mx-3 mb-3 rounded-2xl border border-[#17231B] bg-[#0D1310] p-3" aria-label="Test results">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-neutral-300">Test cases</span>
          <span className={`text-xs font-mono ${testResults[1] === 'passed' ? 'text-primary' : 'text-amber-300'}`}>
            {testResults[1] === 'passed' ? 'All checks passed' : 'Run your code to check it'}
          </span>
          <button onClick={() => setRightTab((tab) => tab === 'testcases' ? 'output' : 'testcases')} className="text-xs text-primary underline underline-offset-2">
            {rightTab === 'testcases' ? 'Show output' : 'Show tests'}
          </button>
        </div>
        {rightTab === 'output' && <pre className="mt-3 max-h-28 overflow-auto whitespace-pre-wrap text-xs text-neutral-300">{consoleOutput}</pre>}
      </section>

      {/* Bottom Action Bar matching Reference Image 1 */}
      <footer className="min-h-16 px-3 py-3 sm:px-6 bg-[#090D0B] border-t border-[#152019] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between flex-shrink-0 z-20">
        {/* Reset Code */}
        <button
          onClick={handleResetCode}
          className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl bg-[#101713] hover:bg-[#16211A] border border-[#1F2C24] hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Code</span>
        </button>

        {/* Run Code & Submit Solution */}
        <div className="grid w-full grid-cols-2 items-center gap-2 sm:w-auto sm:flex sm:gap-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 rounded-xl bg-[#121A15] hover:bg-[#19241D] border border-[#223027] hover:border-primary/50 text-neutral-200 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 text-primary fill-primary" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-6 rounded-xl bg-primary hover:bg-primary-hover text-[#040D07] text-xs font-mono font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] hover:shadow-[0_0_28px_rgba(0,255,102,0.5)] cursor-pointer active:scale-95"
          >
            <span>Submit Solution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  )
}
