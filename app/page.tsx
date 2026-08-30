"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {AiPrompt} from "../components/AiPrompt";
import {DifficultySelector} from "../components/DifficultySelector";
import {LatinSquareGrid} from "../components/LatinSquareGrid";
import {SymbolPicker} from "../components/SymbolPicker";
import {Timer} from "../components/Timer";
import {generateLatinSquarePuzzle} from "../lib/latin-square/generator";
import {validateTarget} from "../lib/latin-square/validator";
import type {Difficulty,LatinSquarePuzzle,SymbolValue} from "../lib/latin-square/types";

export default function Home(){
 const [difficulty,setDifficulty]=useState<Difficulty>("easy");
 const [puzzle,setPuzzle]=useState<LatinSquarePuzzle|null>(null);
 const [answer,setAnswer]=useState<SymbolValue|null>(null);
 const [startedAt,setStartedAt]=useState<number|null>(null);
 const [finishedAt,setFinishedAt]=useState<number|null>(null);
 const [now,setNow]=useState(Date.now());
 const [result,setResult]=useState<"correct"|"incorrect"|null>(null);
 const [generating,setGenerating]=useState(false);

 const generate=useCallback(()=>{setGenerating(true);requestAnimationFrame(()=>{try{const next=generateLatinSquarePuzzle(difficulty);setPuzzle(next);setAnswer(null);setResult(null);const start=Date.now();setStartedAt(start);setFinishedAt(null);setNow(start)}finally{setGenerating(false)}})},[difficulty]);
 useEffect(()=>{
   if(!startedAt||finishedAt)return;
   const id=window.setInterval(()=>setNow(Date.now()),200);
   return()=>window.clearInterval(id);
 },[startedAt,finishedAt]);
 const submitted=result!==null;
 useEffect(()=>{
   if(!puzzle||submitted)return;
   function onKeyDown(event:KeyboardEvent){
     const key=event.key.toUpperCase();
     if(puzzle?.symbols.includes(key)) setAnswer(key);
     if(event.key==="Enter" && answer) submit();
   }
   window.addEventListener("keydown",onKeyDown);
   return()=>window.removeEventListener("keydown",onKeyDown);
 },[puzzle,submitted,answer]);
 const elapsed=startedAt?((finishedAt??now)-startedAt):0;
 const difficultyDescription=useMemo(()=>({easy:"The highlighted cell can be reached with short, direct deductions.",medium:"The highlighted cell requires a few linked deductions.",hard:"The highlighted cell requires a longer chain of deductions."}[difficulty]),[difficulty]);
 function submit(){if(!puzzle||!answer)return;const end=Date.now();setFinishedAt(end);setNow(end);setResult(validateTarget(puzzle,answer)?"correct":"incorrect")}
 return <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10"><div className="mx-auto max-w-4xl">
   <header className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Latin Square Trainer</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Find the symbol that belongs in the highlighted cell. The number of clues stays similar across levels; difficulty comes from the reasoning required.</p></div></header>
   <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end"><DifficultySelector value={difficulty} onChange={v=>{setDifficulty(v);setPuzzle(null);setAnswer(null);setResult(null);setStartedAt(null);setFinishedAt(null)}} disabled={false}/><button type="button" onClick={generate} disabled={generating} className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 sm:min-w-44">{generating?"Generating…":puzzle?"Generate New Problem":"Generate Problem"}</button></div>
   </section>
   {puzzle&&<section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{puzzle.difficulty} problem</p></div><div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold"><Timer elapsedMs={elapsed}/></div></div>
      <div className="flex flex-col items-center gap-5"><LatinSquareGrid puzzle={puzzle} answer={answer} result={result}/><SymbolPicker symbols={puzzle.symbols} value={answer} onChange={setAnswer}/><button type="button" onClick={submit} disabled={!answer||submitted} className="w-full max-w-[520px] rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Submit Answer</button></div>
      {result&&<div className={`mt-6 rounded-2xl border p-4 ${result==="correct"?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`}><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div><p className={`font-bold ${result==="correct"?"text-green-800":"text-red-800"}`}>{result==="correct"?"Correct":"Incorrect"}</p><p className="mt-1 text-sm text-slate-600">Your answer: <strong>{answer}</strong> · Correct answer: <strong>{puzzle.targetValue}</strong></p></div><p className="text-sm font-bold text-slate-700">Time: <Timer elapsedMs={elapsed}/></p></div></div>}
   </section>}
   {puzzle&&result&&<section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6"><div className="mb-4"><h2 className="text-xl font-black">Correctly filled Latin square</h2><p className="mt-1 text-sm text-slate-500">The complete valid square is shown after submission.</p></div><div className="flex justify-center"><div className="latin-grid">{puzzle.solution.map((row,r)=>row.map((value,c)=><div key={`${r}-${c}`} className="latin-cell given" role="gridcell">{value}</div>))}</div></div></section>}
   {puzzle&&result&&<section className="mt-5"><AiPrompt puzzle={puzzle}/></section>}
   {!puzzle&&<section className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center sm:p-12"><h2 className="text-lg font-bold">Ready when you are</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Choose a difficulty and generate a problem. The timer starts as soon as the problem appears.</p></section>}
 </div></main>
}
