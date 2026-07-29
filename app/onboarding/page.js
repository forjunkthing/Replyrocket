'use client';
import {useEffect,useState} from 'react';
import styles from '../auth.module.css';

export default function OnboardingPage(){
  const[step,setStep]=useState(1);
  const[business,setBusiness]=useState('');
  const[connected,setConnected]=useState(false);
  useEffect(()=>{
    try{
      const saved=JSON.parse(window.localStorage.getItem('replyrocket-workspace')||'{}');
      if(saved.business)setBusiness(saved.business);
    }catch{}
  },[]);
  function saveBusiness(){
    let saved={};
    try{saved=JSON.parse(window.localStorage.getItem('replyrocket-workspace')||'{}')}catch{}
    window.localStorage.setItem('replyrocket-workspace',JSON.stringify({...saved,business:business.trim()}));
    setStep(2);
  }
  function connectGoogle(){
    window.localStorage.setItem('replyrocket-google-demo','connected');
    setConnected(true);
    setStep(3);
  }
  return <main className={styles.page}>
    <a className={styles.brand} href="/"><span>↗</span>ReplyRocket</a>
    <section className={styles.card}>
      <div className={styles.progress}><span className={styles.done}/><span className={step>=2?styles.done:''}/><span className={step>=3?styles.done:''}/></div>
      {step===1&&<><p className={styles.eyebrow}>STEP 1 OF 3</p><h1>Set up your business</h1><p>This name is used in your generated replies.</p><label className={styles.label}>Business name<input className={styles.input} value={business} onChange={event=>setBusiness(event.target.value)} placeholder="North Street Barbers"/></label><button className={styles.button} disabled={!business.trim()} onClick={saveBusiness}>Save and continue</button></>}
      {step===2&&<><p className={styles.eyebrow}>STEP 2 OF 3</p><h1>Connect Google Business Profile</h1><p>The live API connection will import reviews and publish approved replies. This setup currently records a demo connection.</p><div className={styles.panel}><strong>Google Business Profile</strong><p>Reviews, business locations and public responses</p></div><button className={styles.button} onClick={connectGoogle}>Connect Google account</button><button className={styles.secondary} onClick={()=>setStep(3)}>Skip for now</button></>}
      {step===3&&<><p className={styles.eyebrow}>SETUP COMPLETE</p><h1>Your workspace is ready</h1><div className={styles.checklist}><p>✓ Business details saved</p><p>✓ AI reply workspace enabled</p><p>{connected?'✓ Google connected in demo mode':'○ Google not connected'}</p></div><a className={styles.button} href="/dashboard">Open dashboard</a></>}
    </section>
  </main>;
}
