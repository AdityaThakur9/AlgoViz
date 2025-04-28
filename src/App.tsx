import React, { useState, useRef, useEffect } from 'react'
import { Box, Container, Typography, Paper, Modal, Grid } from '@mui/material'
import { Algorithm, Language, ALGORITHM_CODE } from './types'
import { Step, CodeParser } from './utils/codeParser'
import Visualizer from './components/Visualizer'
import AlgorithmControls from './components/AlgorithmControls'
import './App.css'
import { ALGORITHM_EXPLANATIONS } from './constants'
import MonacoEditor from '@monaco-editor/react'
import Controls from './components/Controls'

const STEP_INTERVAL = 500; // ms

const App: React.FC = () => {
  // Main state for visualization
  const [array, setArray] = useState('64,34,25,12,22,11,90')
  const [algorithm1, setAlgorithm1] = useState<Algorithm>('bubbleSort')
  const [language1, setLanguage1] = useState<Language>('javascript')
  const [algorithm2, setAlgorithm2] = useState<Algorithm>('quickSort')
  const [language2, setLanguage2] = useState<Language>('javascript')
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [steps1, setSteps1] = useState<Step[]>([])
  const [steps2, setSteps2] = useState<Step[]>([])
  const [currentStep1, setCurrentStep1] = useState(0)
  const [currentStep2, setCurrentStep2] = useState(0)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const playIntervalRef2 = useRef<NodeJS.Timeout | null>(null)

  // Local state for pending changes
  const [pendingArray, setPendingArray] = useState(array)
  const [pendingAlgorithm1, setPendingAlgorithm1] = useState<Algorithm>(algorithm1)
  const [pendingLanguage1, setPendingLanguage1] = useState<Language>(language1)
  const [pendingAlgorithm2, setPendingAlgorithm2] = useState<Algorithm>(algorithm2)
  const [pendingLanguage2, setPendingLanguage2] = useState<Language>(language2)

  const [explainOpen, setExplainOpen] = useState(false)
  const [explainContent, setExplainContent] = useState<{title: string, content: any, steps: Step[]} | null>(null)

  const [speed, setSpeed] = useState(1)
  const [speed2, setSpeed2] = useState(1)
  const [swapCount1, setSwapCount1] = useState(0)
  const [swapCount2, setSwapCount2] = useState(0)

  const languages: Record<string, string> = {
    javascript: 'JavaScript',
    python: 'Python',
    cpp: 'C++',
  }
  const algorithms: Record<string, string> = {
    bubbleSort: 'Bubble Sort',
    quickSort: 'Quick Sort',
    mergeSort: 'Merge Sort',
    insertionSort: 'Insertion Sort',
  }

  const monacoEditorRef = useRef<any>(null);
  const monacoInstanceRef = useRef<any>(null);

  // Input handlers update pending state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingArray(e.target.value)
    setError('')
  }
  const handleAlgorithm1Change = (value: string) => setPendingAlgorithm1(value as Algorithm)
  const handleLanguage1Change = (value: string) => setPendingLanguage1(value as Language)
  const handleAlgorithm2Change = (value: string) => setPendingAlgorithm2(value as Algorithm)
  const handleLanguage2Change = (value: string) => setPendingLanguage2(value as Language)

  // Run button handler
  const handleRun = () => {
    if (pendingArray.trim() === '') {
      setError('Please enter numbers separated by commas')
      return
    }
    const numbers = pendingArray.split(',').map(n => n.trim())
    const isValid = numbers.every(n => !isNaN(Number(n)))
    if (!isValid) {
      setError('Please enter valid numbers separated by commas')
      return
    }
    setError('')
    setArray(pendingArray)
    setAlgorithm1(pendingAlgorithm1)
    setLanguage1(pendingLanguage1)
    setAlgorithm2(pendingAlgorithm2)
    setLanguage2(pendingLanguage2)
    const parsedNumbers = numbers.map(n => parseInt(n)).filter(n => !isNaN(n))
    if (parsedNumbers.length > 0) {
      const code1 = ALGORITHM_CODE[pendingLanguage1][pendingAlgorithm1]
      const parser1 = new CodeParser(code1)
      parser1.setArray(parsedNumbers)
      const steps1 = parser1.parse()
      setSteps1(steps1)
      setCurrentStep1(0)
      let steps2: Step[] = []
      if (isComparisonMode) {
        const code2 = ALGORITHM_CODE[pendingLanguage2][pendingAlgorithm2]
        const parser2 = new CodeParser(code2)
        parser2.setArray(parsedNumbers)
        steps2 = parser2.parse()
        setSteps2(steps2)
        setCurrentStep2(0)
      } else {
        setSteps2([])
        setCurrentStep2(0)
      }
      setIsPlaying(true)
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
      playIntervalRef.current = setInterval(() => {
        setCurrentStep1(prev => {
          if (prev < steps1.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            if (playIntervalRef.current) clearInterval(playIntervalRef.current)
            return prev
          }
        })
        if (isComparisonMode && steps2.length > 0) {
          setCurrentStep2(prev => {
            if (prev < steps2.length - 1) {
              return prev + 1
            } else {
              return prev
            }
          })
        }
      }, STEP_INTERVAL)
    }
  }

  // Pause button handler
  const handlePause = () => {
    setIsPlaying(false)
    if (playIntervalRef.current) clearInterval(playIntervalRef.current)
  }

  // Manual step handlers should pause animation
  const handleStepChange1 = (step: number) => {
    setCurrentStep1(step)
    setIsPlaying(false)
    if (playIntervalRef.current) clearInterval(playIntervalRef.current)
  }
  const handleStepChange2 = (step: number) => {
    setCurrentStep2(step)
    setIsPlaying(false)
    if (playIntervalRef.current) clearInterval(playIntervalRef.current)
  }

  // Always show the initial array as a single step for the visualizer
  const getInitialStep = (arr: string): Step[] => {
    const numbers = arr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    return [{
      array: numbers,
      comparing: [],
      swapping: [],
      description: 'Initial array',
      code: '',
      lineNumber: 0,
      variables: {},
      timestamp: Date.now(),
      explanation: ''
    }];
  };

  // Handler for Explain button
  const handleExplain = (algorithm: Algorithm, array: string) => {
    const explanation = ALGORITHM_EXPLANATIONS[algorithm];
    const numbers = array.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const code = ALGORITHM_CODE['javascript'][algorithm];
    const parser = new CodeParser(code);
    parser.setArray(numbers);
    const steps = parser.parse();
    setExplainContent({
      title: algorithms[algorithm],
      content: explanation,
      steps: steps
    });
    setExplainOpen(true);
  };

  // Update swap count on step change
  useEffect(() => {
    if (steps1.length > 0 && currentStep1 < steps1.length) {
      setSwapCount1(
        steps1.slice(0, currentStep1 + 1).reduce((acc, step) => acc + (step.swapping && step.swapping.length > 0 ? 1 : 0), 0)
      );
    } else {
      setSwapCount1(0);
    }
  }, [steps1, currentStep1]);
  useEffect(() => {
    if (steps2.length > 0 && currentStep2 < steps2.length) {
      setSwapCount2(
        steps2.slice(0, currentStep2 + 1).reduce((acc, step) => acc + (step.swapping && step.swapping.length > 0 ? 1 : 0), 0)
      );
    } else {
      setSwapCount2(0);
    }
  }, [steps2, currentStep2]);

  // Controls for visualizer
  const renderControls = (
    onRun: () => void, 
    onPause: () => void, 
    onPrev: () => void, 
    onNext: () => void, 
    disableRun: boolean, 
    disablePause: boolean, 
    disablePrev: boolean, 
    disableNext: boolean,
    speed: number,
    setSpeed: (speed: number) => void
  ) => (
    <Controls
      onRun={onRun}
      onPause={onPause}
      onPrev={onPrev}
      onNext={onNext}
      disableRun={disableRun}
      disablePause={disablePause}
      disablePrev={disablePrev}
      disableNext={disableNext}
      speed={speed}
      setSpeed={setSpeed}
    />
  );

  useEffect(() => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
      
      // Create separate intervals for each algorithm in comparison mode
      if (isComparisonMode) {
        // Interval for algorithm 1
        const interval1 = setInterval(() => {
          setCurrentStep1(prev => {
            if (prev < (steps1.length || 1) - 1) {
              return prev + 1
            } else {
              return prev
            }
          })
        }, STEP_INTERVAL / speed)
        
        // Interval for algorithm 2
        const interval2 = setInterval(() => {
          setCurrentStep2(prev => {
            if (prev < (steps2.length || 1) - 1) {
              return prev + 1
            } else {
              return prev
            }
          })
        }, STEP_INTERVAL / speed2)
        
        // Store both intervals in the ref
        playIntervalRef.current = interval1
        
        // Clean up both intervals
        return () => {
          clearInterval(interval1)
          clearInterval(interval2)
        }
      } else {
        // Single algorithm mode - use original logic
        playIntervalRef.current = setInterval(() => {
          setCurrentStep1(prev => {
            if (prev < (steps1.length || 1) - 1) {
              return prev + 1
            } else {
              setIsPlaying(false)
              if (playIntervalRef.current) clearInterval(playIntervalRef.current)
              return prev
            }
          })
        }, STEP_INTERVAL / speed)
      }
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    }
  }, [isPlaying, speed, speed2, steps1.length, steps2.length, isComparisonMode])

  // Auto-pause on any change except speed/speed2
  useEffect(() => {
    if (isPlaying) {
      setIsPlaying(false)
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    }
  }, [
    pendingAlgorithm1,
    pendingAlgorithm2,
    pendingArray,
    isComparisonMode
  ])

  // Helper to randomize array
  const randomizeArray = () => {
    const size = Math.floor(Math.random() * 11) + 5; // 5 to 15
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
    setPendingArray(arr.join(','))
    setError('')
  }

  // Reset all state
  const handleReset = () => {
    setPendingArray('64,34,25,12,22,11,90')
    setArray('64,34,25,12,22,11,90')
    setAlgorithm1('bubbleSort')
    setLanguage1('javascript')
    setAlgorithm2('quickSort')
    setLanguage2('javascript')
    setSteps1([])
    setSteps2([])
    setCurrentStep1(0)
    setCurrentStep2(0)
    setIsPlaying(false)
    setSpeed(1)
    setSpeed2(1)
    setError('')
    if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    if (playIntervalRef2.current) clearInterval(playIntervalRef2.current)
  }

  // Reset arrays and steps on mode switch
  const handleModeSwitch = () => {
    setIsComparisonMode((prev) => !prev)
    setSteps1([])
    setSteps2([])
    setCurrentStep1(0)
    setCurrentStep2(0)
    setArray('64,34,25,12,22,11,90')
    setPendingArray('64,34,25,12,22,11,90')
    setIsPlaying(false)
    setError('')
    if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    if (playIntervalRef2.current) clearInterval(playIntervalRef2.current)
  }

  // Add a useEffect to update code highlight on currentStep1 change
  useEffect(() => {
    const editor = monacoEditorRef.current;
    const monaco = monacoInstanceRef.current;
    if (editor && monaco && steps1[currentStep1]?.lineNumber) {
      if (editor.__highlightDeco) {
        editor.deltaDecorations(editor.__highlightDeco, []);
      }
      editor.__highlightDeco = editor.deltaDecorations([], [
        {
          range: new monaco.Range(steps1[currentStep1].lineNumber, 1, steps1[currentStep1].lineNumber, 1),
          options: {
            isWholeLine: true,
            className: 'highlighted-line',
          },
        },
      ]);
      editor.revealLineInCenter(steps1[currentStep1].lineNumber);
    }
  }, [currentStep1, steps1]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Modal open={explainOpen} onClose={() => setExplainOpen(false)}>
        <Paper sx={{ maxWidth: 600, mx: 'auto', my: 8, p: 4, outline: 'none' }}>
          {explainContent && (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>{explainContent.title} - Explanation</Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>{explainContent.content.overview}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Time Complexity:</b> {explainContent.content.timeComplexity}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Space Complexity:</b> {explainContent.content.spaceComplexity}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Key Steps:</b> {explainContent.content.keySteps.join(', ')}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><b>Use Cases:</b> {explainContent.content.useCases.join(', ')}</Typography>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Step-by-step:</Typography>
              <ul style={{ maxHeight: 200, overflowY: 'auto', paddingLeft: 0, listStyle: 'none' }}>
                {explainContent.steps && explainContent.steps.map((step: Step, idx: number) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Step {idx + 1}:</span> <br />
                    <span style={{ fontWeight: 500 }}>Array:</span> [{step.array.join(', ')}] <br />
                    <span style={{ fontStyle: 'italic', color: '#1976d2' }}>{step.description}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Paper>
      </Modal>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 600, textAlign: 'center', letterSpacing: '0.5px' }}>
          Algorithm Visualizer
        </Typography>
        <Paper sx={{ p: 3, bgcolor: '#1e1e1e', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
          {/* Controls and visualizer on the right */}
          <Box sx={{ flex: 2, minWidth: 350, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
              {/* Only show the main AlgorithmControls in single mode, or for array input in comparison mode */}
              {(!isComparisonMode) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlgorithmControls
                    algorithm={pendingAlgorithm1}
                    language={pendingLanguage1}
                    languages={languages}
                    algorithms={algorithms}
                    onLanguageChange={handleLanguage1Change}
                    onAlgorithmChange={handleAlgorithm1Change}
                    isComparisonMode={isComparisonMode}
                    showArrayInput={true}
                    inputArray={pendingArray}
                    onInputArrayChange={handleInputChange}
                    inputError={error}
                    onExplainClick={() => handleExplain(pendingAlgorithm1, pendingArray)}
                    explainButtonRight
                  />
                </Box>
              )}
              {/* In comparison mode, show only the array input field */}
              {isComparisonMode && (
                <Box sx={{ mt: 2 }}>
                  <label htmlFor="array-input" style={{ color: '#fff', marginBottom: 4, display: 'block', fontWeight: 500 }}>Input Array</label>
                  <input
                    id="array-input"
                    className="array-input"
                    value={pendingArray}
                    onChange={handleInputChange}
                    placeholder="Enter array (e.g., 64,34,25,12,22,11,90)"
                    style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
                  />
                  {error && <div className="error-message">{error}</div>}
                </Box>
              )}
              {/* Run, Pause, Reset, Randomize buttons below input */}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <button className="mode-toggle" style={{ backgroundColor: '#1976d2' }} onClick={handleRun} disabled={isPlaying}>
                  Start Visualization
                </button>
                <button className="mode-toggle" style={{ backgroundColor: '#b71c1c' }} onClick={handlePause} disabled={!isPlaying}>
                  Pause
                </button>
                <button className="mode-toggle" style={{ backgroundColor: '#757575' }} onClick={handleReset}>
                  Reset
                </button>
                <button className="mode-toggle" style={{ backgroundColor: '#388e3c' }} onClick={randomizeArray}>
                  Randomize Array
                </button>
                <button className="mode-toggle" onClick={handleModeSwitch}>
                  {isComparisonMode ? 'Switch to Single Mode' : 'Switch to Comparison Mode'}
                </button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Only render the grid/visualizer section, not the editor, below */}
      {!isComparisonMode ? (
        <Grid container spacing={4} direction="row" alignItems="stretch">
          <Grid item xs={12} md={6} sx={{ minWidth: 0, minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <Box sx={{ width: '100%', height: 400, flex: 1 }}>
              <MonacoEditor
                height="100%"
                defaultLanguage={pendingLanguage1}
                defaultValue={ALGORITHM_CODE?.[pendingLanguage1]?.[pendingAlgorithm1] || '// No code available for this algorithm/language.'}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: true,
                  domReadOnly: true,
                }}
                key={pendingLanguage1 + pendingAlgorithm1}
                onMount={(editor, monaco) => {
                  monacoEditorRef.current = editor;
                  monacoInstanceRef.current = monaco;
                  if (steps1[currentStep1]?.lineNumber) {
                    editor.revealLineInCenter(steps1[currentStep1].lineNumber)
                    editor.__highlightDeco = editor.deltaDecorations([], [
                      {
                        range: new monaco.Range(steps1[currentStep1].lineNumber, 1, steps1[currentStep1].lineNumber, 1),
                        options: {
                          isWholeLine: true,
                          className: 'highlighted-line',
                        },
                      },
                    ])
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0, minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <Box sx={{ width: '100%', height: 400, flex: 1 }}>
              <Visualizer
                steps={steps1.length > 0 ? steps1 : getInitialStep(pendingArray)}
                currentStep={currentStep1}
                onStepChange={handleStepChange1}
                algorithmName={`${algorithms[pendingAlgorithm1]}`}
              />
            </Box>
            <Box sx={{ mt: 2, mb: 1, color: '#1976d2', fontWeight: 500, fontSize: 16 }}>
              {steps1[currentStep1]?.description}
            </Box>
            {renderControls(
              handleRun,
              handlePause,
              () => handleStepChange1(Math.max(0, currentStep1 - 1)),
              () => handleStepChange1(Math.min((steps1.length || 1) - 1, currentStep1 + 1)),
              isPlaying,
              !isPlaying,
              currentStep1 === 0,
              currentStep1 === (steps1.length || 1) - 1,
              speed,
              setSpeed
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={4} direction="row" alignItems="stretch">
          <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center" sx={{ minWidth: 0, minHeight: 400 }}>
            {/* Algorithm 1 Combo-box above the graph */}
            <Box sx={{ width: '100%', maxWidth: 900, minWidth: 400, mb: 2 }}>
              <AlgorithmControls
                title={undefined}
                algorithm={pendingAlgorithm1}
                language={pendingLanguage1}
                languages={languages}
                algorithms={algorithms}
                onLanguageChange={handleLanguage1Change}
                onAlgorithmChange={handleAlgorithm1Change}
                isComparisonMode={isComparisonMode}
                showArrayInput={false}
                onExplainClick={() => handleExplain(pendingAlgorithm1, pendingArray)}
                explainButtonRight
              />
            </Box>
            <Box sx={{ width: '100%', maxWidth: 900, minWidth: 400 }}>
              <Visualizer
                steps={steps1.length > 0 ? steps1 : getInitialStep(pendingArray)}
                currentStep={currentStep1}
                onStepChange={handleStepChange1}
                algorithmName={`${algorithms[pendingAlgorithm1]}`}
              />
            </Box>
            <Box sx={{ mt: 2, mb: 1, color: '#1976d2', fontWeight: 500, fontSize: 16 }}>
              {steps1[currentStep1]?.description}
            </Box>
            <Box sx={{ mb: 1, color: '#b71c1c', fontWeight: 600 }}>Swaps: {swapCount1}</Box>
            {renderControls(
              handleRun,
              handlePause,
              () => handleStepChange1(Math.max(0, currentStep1 - 1)),
              () => handleStepChange1(Math.min((steps1.length || 1) - 1, currentStep1 + 1)),
              isPlaying,
              !isPlaying,
              currentStep1 === 0,
              currentStep1 === (steps1.length || 1) - 1,
              speed,
              setSpeed
            )}
          </Grid>
          <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center" sx={{ minWidth: 0, minHeight: 400 }}>
            {/* Algorithm 2 Combo-box above the graph */}
            <Box sx={{ width: '100%', maxWidth: 900, minWidth: 400, mb: 2 }}>
              <AlgorithmControls
                title={undefined}
                algorithm={pendingAlgorithm2}
                language={pendingLanguage2}
                languages={languages}
                algorithms={algorithms}
                onLanguageChange={handleLanguage2Change}
                onAlgorithmChange={handleAlgorithm2Change}
                isComparisonMode={isComparisonMode}
                showArrayInput={false}
                onExplainClick={() => handleExplain(pendingAlgorithm2, pendingArray)}
                explainButtonRight
              />
            </Box>
            <Box sx={{ width: '100%', maxWidth: 900, minWidth: 400 }}>
              <Visualizer
                steps={steps2.length > 0 ? steps2 : getInitialStep(pendingArray)}
                currentStep={currentStep2}
                onStepChange={handleStepChange2}
                algorithmName={`${algorithms[pendingAlgorithm2]}`}
              />
            </Box>
            <Box sx={{ mt: 2, mb: 1, color: '#1976d2', fontWeight: 500, fontSize: 16 }}>
              {steps2[currentStep2]?.description}
            </Box>
            <Box sx={{ mb: 1, color: '#b71c1c', fontWeight: 600 }}>Swaps: {swapCount2}</Box>
            {renderControls(
              handleRun,
              handlePause,
              () => handleStepChange2(Math.max(0, currentStep2 - 1)),
              () => handleStepChange2(Math.min((steps2.length || 1) - 1, currentStep2 + 1)),
              isPlaying,
              !isPlaying,
              currentStep2 === 0,
              currentStep2 === (steps2.length || 1) - 1,
              speed2,
              setSpeed2
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default App 