'use client';
import {useState} from 'react';
import styles from '../auth.module.css';

export default function LoginPage(){
  const[email,setEmail]=useState('');
  const[sent,setSent]=useState(false);
  function submit(event){
    event.preventDefault();
    window.localStorage.setItem('replyrocket-user',JSON.stringify({email,mode:'demo'}));
    setSent(true);
  }
  return <main className={styles.page}>
    <a className={styles.brand} href="/"><span>↗</span>ReplyRocket</a>
    <section className={styles.card}>
      <p className={styles.eyebrow}>WELCOME BACK</p>
      <h1>Sign in to ReplyRocket</h1>
      <p>Use your work email to open your review workspace.</p>
      {sent?<div className={styles.success}><strong>Demo account ready</strong><p>Authentication is running in demo mode until Supabase is connected.</p><a className={styles.button} href="/onboarding">Continue</a></div>:<form onSubmit={submit} className={styles.card} style={{padding:0,border:0,boxShadow:'none'}}><label className={styles.label}>Email address<input className={styles.input} type="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@business.co.uk"/></label><button className={styles.button}>Continue with email</button><button type="button" className={styles.secondary} onClick={()=>{window.localStorage.setItem('replyrocket-user',JSON.stringify({email:'google-demo@replyrocket.app',mode:'demo'}));window.location.assign('/onboarding')}}>Continue with Google</button></form>}
    </section>
  </main>;
}
