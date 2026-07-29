'use client';
import {useState} from 'react';
import {getSupabase} from '../../lib/supabase';
import styles from '../auth.module.css';

export default function LoginPage(){
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[mode,setMode]=useState('signin');
  const[loading,setLoading]=useState(false);
  const[message,setMessage]=useState('');

  async function submit(event){
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try{
      const supabase=getSupabase();
      const result=mode==='signup'
        ? await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${window.location.origin}/onboarding`}})
        : await supabase.auth.signInWithPassword({email,password});
      if(result.error)throw result.error;
      if(mode==='signup'&&!result.data.session){
        setMessage('Check your email to confirm your account, then sign in.');
      }else{
        window.location.assign('/onboarding');
      }
    }catch(error){
      setMessage(error.message||'Unable to authenticate.');
    }finally{
      setLoading(false);
    }
  }

  async function continueWithGoogle(){
    setLoading(true);
    setMessage('');
    try{
      const supabase=getSupabase();
      const{error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${window.location.origin}/onboarding`}});
      if(error)throw error;
    }catch(error){
      setMessage(error.message||'Unable to start Google sign-in.');
      setLoading(false);
    }
  }

  return <main className={styles.page}>
    <a className={styles.brand} href="/"><span>↗</span>ReplyRocket</a>
    <section className={styles.card}>
      <p className={styles.eyebrow}>{mode==='signin'?'WELCOME BACK':'CREATE YOUR ACCOUNT'}</p>
      <h1>{mode==='signin'?'Sign in to ReplyRocket':'Start using ReplyRocket'}</h1>
      <p>{mode==='signin'?'Use your email and password to open your workspace.':'Create an account to save your workspace securely.'}</p>
      <form onSubmit={submit} className={styles.card} style={{padding:0,border:0,boxShadow:'none'}}>
        <label className={styles.label}>Email address<input className={styles.input} type="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@business.co.uk"/></label>
        <label className={styles.label}>Password<input className={styles.input} type="password" minLength="8" required value={password} onChange={event=>setPassword(event.target.value)} placeholder="At least 8 characters"/></label>
        <button className={styles.button} disabled={loading}>{loading?'Please wait…':mode==='signin'?'Sign in':'Create account'}</button>
        <button type="button" className={styles.secondary} disabled={loading} onClick={continueWithGoogle}>Continue with Google</button>
        <button type="button" className={styles.secondary} onClick={()=>{setMode(mode==='signin'?'signup':'signin');setMessage('')}}>{mode==='signin'?'Need an account? Sign up':'Already registered? Sign in'}</button>
        {message&&<p>{message}</p>}
      </form>
    </section>
  </main>;
}
