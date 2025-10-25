import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Code2, MessageSquare } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ChatPanel from "@/components/ChatPanel";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CodeChat
            </h1>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Real-time Coding Workspace
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="border-border/50"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop: Side by side */}
        <div className="hidden md:block h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60} minSize={30}>
              <CodeEditor isDarkMode={isDarkMode} />
            </ResizablePanel>
            
            <ResizableHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors" />
            
            <ResizablePanel defaultSize={40} minSize={25}>
              <ChatPanel isDarkMode={isDarkMode} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile: Stacked vertically */}
        <div className="md:hidden h-full">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={55} minSize={30}>
              <div className="h-full border-b border-border/50">
                <div className="flex items-center gap-2 p-2 bg-editor-panel border-b border-border/30">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Code Editor</span>
                </div>
                <div className="h-[calc(100%-40px)]">
                  <CodeEditor isDarkMode={isDarkMode} />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="h-1 bg-border/50 hover:bg-primary/50 transition-colors" />
            
            <ResizablePanel defaultSize={45} minSize={30}>
              <div className="h-full">
                <div className="flex items-center gap-2 p-2 bg-chat-header text-white border-b border-border/30">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Chat</span>
                </div>
                <div className="h-[calc(100%-40px)]">
                  <ChatPanel isDarkMode={isDarkMode} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Index;
