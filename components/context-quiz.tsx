'use client';
import {useState} from 'react';
export function ContextQuiz({quiz}:{quiz:{question:string;answers:string[];correct:number;explanation:string}}){
 const [answer,setAnswer]=useState<number|null>(null);
 return <section className="ch-quiz"><p className="ch-kicker">CHECK YOUR INTUITION</p><h2>{quiz.question}</h2><div className="ch-controls">{quiz.answers.map((a,i)=><button key={a} aria-pressed={answer===i} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{a}</button>)}</div>{answer!==null?<p role="status" className="ch-feedback"><strong>{answer===quiz.correct?'Exactly.':'Try another perspective.'}</strong> {quiz.explanation}</p>:<p className="ch-muted">Choose an answer to reveal the reasoning.</p>}</section>;
}
