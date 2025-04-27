import { useEffect, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Step } from '../utils/codeParser'

interface EditorProps {
  value: string
  currentStep: Step | null
  language: 'javascript' | 'python' | 'cpp'
  height?: string
}

const LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp'
} as const

const Editor: React.FC<EditorProps> = ({ value, currentStep, language, height = '400px' }) => {
  const editorRef = useRef<any>(null)
  const decorationsRef = useRef<string[]>([])
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [editorError, setEditorError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleEditorDidMount = (editor: any) => {
    console.log("Monaco editor mounted successfully");
    editorRef.current = editor
    setEditorLoaded(true)
    setIsLoading(false)
  }

  // Log any errors we catch to the console
  useEffect(() => {
    try {
      console.log("Monaco editor setup", { language, value });
    } catch (error) {
      console.error("Monaco editor setup error:", error);
      setEditorError("Failed to setup editor");
    }
  }, [language, value]);

  useEffect(() => {
    if (editorRef.current && currentStep?.lineNumber) {
      try {
        const lineNumber = currentStep.lineNumber
        const decorations = [{
          range: {
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: 1
          },
          options: {
            isWholeLine: true,
            className: 'highlighted-line',
            glyphMarginClassName: 'highlighted-glyph'
          }
        }]
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          decorations
        )
      } catch (error) {
        console.error("Error applying editor decorations:", error);
      }
    } else if (editorRef.current) {
      try {
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          []
        )
      } catch (error) {
        console.error("Error clearing editor decorations:", error);
      }
    }
  }, [currentStep, editorLoaded])

  if (editorError) {
    return (
      <div style={{ 
        height, 
        backgroundColor: '#1e1e1e', 
        color: '#ff4444', 
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px'
      }}>
        Failed to load editor: {editorError}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#1e1e1e', 
        color: '#fff' 
      }}>
        Loading editor...
      </div>
    )
  }

  return (
    <MonacoEditor
      height={height}
      defaultLanguage={LANGUAGE_MAP[language]}
      defaultValue={value}
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
      onMount={handleEditorDidMount}
    />
  )
}

export default Editor 