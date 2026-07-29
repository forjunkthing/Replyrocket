'use client';
import {useEffect,useState} from 'react';
import {getSupabase} from '../../lib/supabase';

export default function DashboardLayout({children}){
  const[ready,setReady]=useState(false);
  const[user,setUser]=useState(null);
  const[error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    let subscription;
    try{
      const supabase=getSupabase();
      supabase.auth.getSession().then(({data,error:sessionError})=>{
        if(!active)return;
        if(sessionError){setError(sessionError.message);setReady(true);return;}
        if(!data.session){window.location.replace('/login');return;}
        setUser(data.session.user);
        setReady(true);
      });
      const listener=supabase.auth.onAuthStateChange((_event,session)=>{
        if(!active)return;
        if(!session){window.location.replace('/login');return;}
        setUser(session.user);
      });
      subscription=listener.data.subscription;
    }catch(authError){
      setError(authError.message);
      setReady(true);
    }
    return()=>{active=false;subscription?.unsubscribe();};
  },[]);

  async function signOut(){
    try{
      await getSupabase().auth.signOut();
    }finally{
      window.location.replace('/login');
    }
  }

  if(!ready)return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',fontFamily:'Arial,sans-serif'}}>Loading your workspace…</main>;
  if(error)return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,fontFamily:'Arial,sans-serif'}}><div><h1>Authentication setup required</h1><p>{error}</p></div></main>;

  return <>
    <div style={{position:'fixed',right:18,top:14,zIndex:50,display:'flex',alignItems:'center',gap:10,background:'white',border:'1px solid #dce4df',borderRadius:10,padding:'8px 10px',boxShadow:'0 8px 24px rgba(18,52,40,.12)'}}>
      <span style={{fontSize:12,color:'#64736e',maxWidth:190,overflow:'hidden',textOverflow:'ellipsis'}}>{user?.email}</span>
      <button onClick={signOut} style={{border:0,borderRadius:8,background:'#10231d',color:'white',fontWeight:800,padding:'8px 10px',cursor:'pointer'}}>Log out</button>
    </div>
    {children}
  </>;
}
