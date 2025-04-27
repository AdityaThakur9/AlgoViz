declare module '@monaco-editor/react' {
  import * as React from 'react';

  export interface EditorProps {
    height?: string | number;
    defaultLanguage?: string;
    defaultValue?: string;
    value?: string;
    theme?: string;
    options?: Record<string, any>;
    onChange?: (value: string | undefined) => void;
    onMount?: (editor: any, monaco: any) => void;
  }

  const Editor: React.FC<EditorProps>;
  export default Editor;
} 