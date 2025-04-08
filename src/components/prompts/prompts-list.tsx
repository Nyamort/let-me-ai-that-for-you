'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { History, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Prompt } from '@/lib/prompt-service';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PromptsListProps {
  onSelectPrompt: (prompt: Prompt) => void;
  onNewPrompt: () => void;
}

export function PromptsList({ onSelectPrompt, onNewPrompt }: PromptsListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      toast.error('Failed to load prompts');
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }
      setPrompts(prompts.filter(p => p.id !== promptId));
      toast.success('Prompt deleted');
    } catch (error) {
      toast.error('Failed to delete prompt');
      console.error('Error deleting prompt:', error);
    }
  };

  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Loading prompts...</SidebarGroupLabel>
      </SidebarGroup>
    );
  }

  if (prompts.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>No prompts yet</SidebarGroupLabel>
        <div className="px-2 py-2">
          <Button 
            onClick={onNewPrompt} 
            className="w-full" 
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your Prompts</SidebarGroupLabel>
      <div className="px-2 py-2">
        <Button 
          onClick={onNewPrompt} 
          className="w-full mb-2" 
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <SidebarGroupContent>
          <SidebarMenu>
            {prompts.map((prompt) => (
              <SidebarMenuItem key={prompt.id}>
                <SidebarMenuButton
                  onClick={() => onSelectPrompt(prompt)}
                  className="w-full"
                >
                  <History className="mr-2 h-4 w-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate w-[150px]">{prompt.originalText}</span>
                      </TooltipTrigger>
                      <TooltipContent side='right'>
                        <p className="max-w-[300px] break-words">{prompt.originalText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuButton>
                <button
                  onClick={() => handleDeletePrompt(prompt.id!)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-destructive/10 rounded-sm"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </ScrollArea>
    </SidebarGroup>
  );
} 