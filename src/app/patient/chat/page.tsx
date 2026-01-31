'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Bot, User, AlertCircle } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import useSWR from 'swr';
import { getHealthChatResponse } from '@/app/actions';
import type { HealthVital } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PatientChatPage() {
  const { user, userProfile } = useUser();
  const { data: vitals, isLoading: vitalsLoading } = useSWR<HealthVital[]>(
    user?.uid ? `/api/vitals/history/${user.uid}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create context from the last 5 vitals
      const vitalsContext = JSON.stringify(vitals?.slice(-5) || [], null, 2);

      const result = await getHealthChatResponse(input, vitalsContext);

      if (result.error) {
        throw new Error(result.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: result.data || 'Sorry, I could not generate a response.',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content:
          error.message ||
          'There was an error communicating with the AI assistant.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col p-4 lg:p-6 h-[calc(100vh-140px)]">
      <Card className="flex flex-1 flex-col h-full">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="w-12 h-12 mb-2" />
                <h3 className="text-lg font-semibold">AI Health Assistant</h3>
                <p className="text-sm">
                  Ask a question about your health data below. For example: "Is
                  my recent heart rate normal?"
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                   {message.role === 'user' && userProfile && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarImage src={userProfile?.avatar_url || ''}/>
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                        <Bot className="w-5 h-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                   <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
             {vitalsLoading ? (
                 <Skeleton className="h-10 w-full" />
             ) : !vitals || vitals.length === 0 ? (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <AlertCircle className="w-4 h-4"/>
                    <p>No health data available to provide context. Answers may be generic.</p>
                 </div>
             ) : (
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2"
                >
                    <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a question about your health..."
                    className="flex-1 min-h-0 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                    </Button>
                </form>
             )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
