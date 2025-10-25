import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript", default: "console.log('Hello World');" },
  { value: "typescript", label: "TypeScript", default: "console.log('Hello TypeScript');" },
  { value: "python", label: "Python", default: "print('Hello World')" },
  { value: "java", label: "Java", default: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World\");\n  }\n}" },
  { value: "cpp", label: "C++", default: "#include <iostream>\nint main() {\n  std::cout << \"Hello World\";\n  return 0;\n}" },
  { value: "c", label: "C", default: "#include <stdio.h>\nint main() {\n  printf(\"Hello World\");\n  return 0;\n}" },
  { value: "csharp", label: "C#", default: "using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"Hello World\");\n  }\n}" },
  { value: "go", label: "Go", default: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello World\")\n}" },
  { value: "swift", label: "Swift", default: "print(\"Hello World\")" },
  { value: "html", label: "HTML", default: "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>" },
  { value: "css", label: "CSS", default: "body {\n  background: #1a1a2e;\n  color: white;\n}" },
];

interface CodeEditorProps {
  isDarkMode: boolean;
}

export default function CodeEditor({ isDarkMode }: CodeEditorProps) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_OPTIONS[0].default);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    const savedCode = localStorage.getItem("savedCode");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      const langOption = LANGUAGE_OPTIONS.find(l => l.value === savedLanguage);
      setCode(savedCode || langOption?.default || "");
    }
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("selectedLanguage", newLanguage);
    const langOption = LANGUAGE_OPTIONS.find(l => l.value === newLanguage);
    const newCode = langOption?.default || "";
    setCode(newCode);
    localStorage.setItem("savedCode", newCode);
    setOutput("");
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    localStorage.setItem("savedCode", newCode);
  };

  const handleReset = () => {
    const langOption = LANGUAGE_OPTIONS.find(l => l.value === language);
    const defaultCode = langOption?.default || "";
    setCode(defaultCode);
    setOutput("");
    localStorage.setItem("savedCode", defaultCode);
    toast({
      title: "Code Reset",
      description: "Editor has been reset to default code.",
    });
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    // Simulate code execution
    setTimeout(() => {
      const mockOutput = `✓ Code executed successfully!\n\nLanguage: ${language}\nOutput:\n${
        language === "javascript" || language === "typescript" 
          ? "Hello World" 
          : language === "python" 
          ? "Hello World" 
          : "Hello World\n\nExecution time: 0.042s\nMemory: 2.1 MB"
      }`;
      
      setOutput(mockOutput);
      setIsRunning(false);
      toast({
        title: "Execution Complete",
        description: "Your code ran successfully!",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-editor-panel">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] bg-editor-bg border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-border/50 hover:bg-muted/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-[var(--glow-run)]"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme={isDarkMode ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Console Output */}
      <div className="h-48 bg-console-bg border-t border-border/30 p-4 overflow-auto">
        <div className="font-mono text-sm text-console-text whitespace-pre-wrap">
          {output || "// Output will appear here..."}
        </div>
      </div>
    </div>
  );
}
