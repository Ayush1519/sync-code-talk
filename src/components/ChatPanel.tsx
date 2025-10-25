import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isSent: boolean;
}

interface ChatPanelProps {
  isDarkMode: boolean;
}

export default function ChatPanel({ isDarkMode }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! Welcome to the coding workspace 👋",
      sender: "Alex",
      timestamp: new Date(Date.now() - 300000),
      isSent: false,
    },
    {
      id: "2",
      text: "Ready to code together?",
      sender: "You",
      timestamp: new Date(Date.now() - 240000),
      isSent: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [onlineUsers] = useState(3);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "You",
      timestamp: new Date(),
      isSent: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great point! Let me check the code...",
        sender: "Alex",
        timestamp: new Date(),
        isSent: false,
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-chat-header text-white">
        <div>
          <h2 className="font-semibold text-lg">Live Chat</h2>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {onlineUsers} online
          </p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 chat-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.isSent ? "flex-row-reverse" : ""
              }`}
            >
              {!message.isSent && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {message.sender[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`flex flex-col max-w-[75%] ${
                  message.isSent ? "items-end" : "items-start"
                }`}
              >
                {!message.isSent && (
                  <span className="text-xs text-muted-foreground mb-1 px-1">
                    {message.sender}
                  </span>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl transition-all duration-300 ${
                    message.isSent
                      ? "bg-message-sent text-message-text-sent rounded-tr-sm"
                      : "bg-message-received text-message-text-received rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/30">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-background/50 border-border/50 focus:bg-background"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-chat-header hover:bg-chat-header/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
