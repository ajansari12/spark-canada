import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { BusinessIdea } from "@/types/idea";
import { Send, Bot, User, Loader2, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  idea: BusinessIdea | null;
}

const suggestedQuestions = [
  "How do I get started with this business?",
  "What are the main risks I should consider?",
  "What licenses do I need in my province?",
  "How can I find my first customers?",
  "What grants are available for this type of business?",
];

export const ChatDrawer = ({ isOpen, onClose, idea }: ChatDrawerProps) => {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    ideaContext: idea,
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear messages when idea changes
  useEffect(() => {
    clearMessages();
  }, [idea?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (!isLoading) {
      sendMessage(question);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-left">SPARK Assistant</SheetTitle>
                {idea && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Discussing: {idea.name}
                  </p>
                )}
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    Ask me anything!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    I can help you understand this business idea, plan next steps, or answer questions about starting a business in Canada.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Suggested questions
                  </p>
                  <div className="grid gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-2 px-3 text-left text-sm whitespace-normal"
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isLoading}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="px-4 py-4 border-t border-border bg-background"
        >
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="btn-gradient shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-primary" : "bg-accent"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-accent-foreground" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
