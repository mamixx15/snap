import { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CodeEditor = ({ 
  code = '', 
  language = 'javascript', 
  onChange = () => {}, 
  readOnly = false,
  showLineNumbers = true,
  showCopyButton = true,
  height = '400px'
}) => {
  const [content, setContent] = useState(code);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [copied, setCopied] = useState(false);

  // Update the code when external props change
  useEffect(() => {
    setContent(code);
  }, [code]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Handle textarea changes
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setContent(newCode);
    onChange(newCode);
  };

  // Handle language changes
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Available language options
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'plaintext', label: 'Plain Text' },
  ];

  return (
    <div className="editor-container">
      {!readOnly && (
        <div className="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="select text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="relative" style={{ height: readOnly ? height : 'auto' }}>
        {readOnly ? (
          // Read-only mode with syntax highlighting
          <div className="relative">
            <SyntaxHighlighter
              language={selectedLanguage}
              style={atomOneDark}
              customStyle={{ 
                margin: 0, 
                borderRadius: 0,
                height: height,
                overflowY: 'auto' 
              }}
              showLineNumbers={showLineNumbers}
              lineNumberStyle={{ color: '#4B5563' }}
              wrapLines={true}
            >
              {content || '// Your code here'}
            </SyntaxHighlighter>
            
            {showCopyButton && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Copy code"
              >
                {copied ? <FiCheck className="text-green-500" /> : <FiCopy className="text-gray-300" />}
              </button>
            )}
          </div>
        ) : (
          // Editable textarea
          <textarea
            value={content}
            onChange={handleCodeChange}
            className="w-full h-full min-h-[400px] bg-gray-900 text-gray-100 p-4 font-mono text-sm focus:outline-none resize-y"
            placeholder="// Write or paste your code here"
            spellCheck="false"
          />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
