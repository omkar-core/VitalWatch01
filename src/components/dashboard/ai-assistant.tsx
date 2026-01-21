"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generatePatientSummaryAction, suggestInitialDiagnosesAction } from "@/app/actions";
import { Bot, Loader2 } from "lucide-react";
import type { Patient } from "@/lib/types";

export function AiAssistant({ patient }: { patient: Patient }) {
  const { toast } = useToast();
  const [isSummaryPending, startSummaryTransition] = useTransition();
  const [isDiagnosisPending, startDiagnosisTransition] = useTransition();
  
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isSummaryStreaming, setIsSummaryStreaming] = useState(false);

  const [diagnosis, setDiagnosis] = useState<{ diagnoses: string[], reasoning: string } | null>(null);
  const [displayedReasoning, setDisplayedReasoning] = useState("");
  const [isDiagnosisStreaming, setIsDiagnosisStreaming] = useState(false);

  useEffect(() => {
    if (summary) {
      setDisplayedSummary("");
      const words = summary.split(/(\s+)/);
      let i = 0;
      setIsSummaryStreaming(true);
      const intervalId = setInterval(() => {
        if (i < words.length) {
          setDisplayedSummary((prev) => prev + words[i]);
          i++;
        } else {
          clearInterval(intervalId);
          setIsSummaryStreaming(false);
        }
      }, 50);
      return () => {
          clearInterval(intervalId);
          setIsSummaryStreaming(false);
      };
    } else {
      setDisplayedSummary("");
    }
  }, [summary]);

  useEffect(() => {
    if (diagnosis?.reasoning) {
      setDisplayedReasoning("");
      const words = diagnosis.reasoning.split(/(\s+)/);
      let i = 0;
      setIsDiagnosisStreaming(true);
      const intervalId = setInterval(() => {
        if (i < words.length) {
          setDisplayedReasoning((prev) => prev + words[i]);
          i++;
        } else {
          clearInterval(intervalId);
          setIsDiagnosisStreaming(false);
        }
      }, 50);
      return () => {
          clearInterval(intervalId);
          setIsDiagnosisStreaming(false);
      };
    } else {
        setDisplayedReasoning("");
    }
  }, [diagnosis]);

  const handleGenerateSummary = async () => {
    setSummary("");
    startSummaryTransition(async () => {
      const latestVitals = patient.vitals[patient.vitals.length - 1];
      const result = await generatePatientSummaryAction({
        medicalHistory: patient.medicalHistory,
        currentHealthStatus: `Current symptoms: ${patient.symptoms}. Latest vitals are heart rate: ${latestVitals['Heart Rate']}, blood pressure: ${latestVitals['Systolic']}/${latestVitals['Diastolic']}, SPO2: ${latestVitals['SPO2']}%.`
      });
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error Generating Summary",
          description: result.error,
        });
      } else if (result.data) {
        setSummary(result.data.summary);
      }
    });
  };

  const handleSuggestDiagnosis = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDiagnosis(null);
    const formData = new FormData(event.currentTarget);
    const symptoms = formData.get("symptoms") as string;
    const medicalHistory = formData.get("medicalHistory") as string;

    startDiagnosisTransition(async () => {
        const result = await suggestInitialDiagnosesAction({ symptoms, medicalHistory });
        if(result.error) {
            toast({
                variant: "destructive",
                title: "Error Suggesting Diagnoses",
                description: result.error,
            });
        } else if (result.data) {
            setDiagnosis(result.data);
        }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Bot className="w-6 h-6" />
            <CardTitle>AI Assistant</CardTitle>
        </div>
        <CardDescription>Leverage AI to get quick insights about the patient.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Patient Summary</h3>
          <Button onClick={handleGenerateSummary} disabled={isSummaryPending}>
            {isSummaryPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Summary
          </Button>
          {isSummaryPending && !displayedSummary && <p className="text-sm text-muted-foreground mt-2">Generating summary...</p>}
          { (displayedSummary || isSummaryStreaming) && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm min-h-[120px]">
              {displayedSummary}
              {isSummaryStreaming && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1" />}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Suggest Initial Diagnoses</h3>
          <form onSubmit={handleSuggestDiagnosis} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea id="symptoms" name="symptoms" defaultValue={patient.symptoms} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Relevant Medical History</Label>
              <Textarea id="medicalHistory" name="medicalHistory" defaultValue={patient.medicalHistory} required />
            </div>
            <Button type="submit" disabled={isDiagnosisPending}>
              {isDiagnosisPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Diagnoses
            </Button>
          </form>
          {isDiagnosisPending && !diagnosis && <p className="text-sm text-muted-foreground mt-2">Analyzing data...</p>}
          { (diagnosis || isDiagnosisStreaming) && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4 min-h-[240px]">
                {diagnosis && (
                    <div>
                        <h4 className="font-semibold">Potential Diagnoses:</h4>
                        <ul className="list-disc list-inside">
                            {diagnosis.diagnoses.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>
                )}
                 {(displayedReasoning || isDiagnosisStreaming) && (
                     <div>
                        <h4 className="font-semibold">Reasoning:</h4>
                        <p className="text-sm">
                            {displayedReasoning}
                            {isDiagnosisStreaming && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1" />}
                        </p>
                    </div>
                 )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
