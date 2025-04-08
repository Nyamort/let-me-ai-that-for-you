'use client';

import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Wand2, Copy, LogOut, ChevronDown, User } from "lucide-react";
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react";
import { LoginDialog } from "@/components/auth/login-dialog";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromptsList } from "@/components/prompts/prompts-list";
import { Prompt } from "@/lib/prompt-service";
import Image from "next/image";

function App() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectPrompt = (prompt: Prompt) => {
    setText(prompt.originalText);
    setEnhancedText(prompt.enhancedText);
  };

  const handleNewPrompt = () => {
    setText("");
    setEnhancedText("");
  };

  const enhanceText = async () => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    if (!text.trim()) {
      toast("No Text Provided",{
        description: "Please enter some text to enhance."
      });
      return;
    }

    setLoading(true);
    const response = await fetch("/api/enhance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });
    setLoading(false);
    if (!response.ok) {
      toast.error("Enhancement Failed", {
        description: "There was an error enhancing your text. Please try again."
      });
      return;
    }
    const { text: enhanced } = await response.json();
    if (!enhanced) {
      toast.error("Enhancement Failed", {
        description: "No enhanced text was returned. Please try again."
      });
      return;
    }

    setEnhancedText(enhanced);
    toast.success("Text Enhanced", {
      description: "Your text has been enhanced successfully."
    });
    
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex w-screen h-screen bg-gradient-to-b from-background to-secondary">
      <Sidebar>
        <div className="flex flex-col gap-4">
          {session && <PromptsList 
            onSelectPrompt={handleSelectPrompt} 
            onNewPrompt={handleNewPrompt} 
            key={refreshKey}
          />}
        </div>
        <div className="mt-auto border-t pt-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between px-2">
                  <div className="flex items-center gap-2">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <span className="font-medium truncate">{session.user?.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
          )}
        </div>
      </Sidebar>
      <SidebarTrigger size='lg'/>
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Let me AI that for you</h1>
            </div>
            <p className="text-muted-foreground">Transform your prompts into powerful tools</p>
          </div>

          <div className="grid gap-6">
            <Card className="p-6">
              <Textarea
                placeholder="Enter your text here..."
                className="min-h-[200px] mb-4 text-lg"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={enhanceText}
                  className="px-6"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  <Wand2 className="mr-2 h-5 w-5" />
                  Enhance
                </Button>
              </div>
            </Card>

            {enhancedText && (
              <Card className="p-6 border-primary/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Enhanced Prompt
                </h2>
                <div className="bg-secondary/50 p-4 rounded-lg relative group">
                  <p className="text-lg text-justify">{enhancedText}</p>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(enhancedText);
                      toast.success("Copied to clipboard!");
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-primary text-white hover:bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
