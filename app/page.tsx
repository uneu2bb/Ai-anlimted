"use client";
import { useEffect, useRef, useState } from "react";
import { Activity, ArrowUp, Bot, Menu, MessageSquare, Plus, ShieldCheck, Sparkles, Zap } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; provider?: string };
type Chat = { id: string; title: string; messages: Message[] };
const starters = ["اكتب لي خطة مشروع احترافية","اشرح لي موضوعاً معقداً ببساطة","ساعدني في كتابة كود أو إصلاح خطأ","لخص هذا النص بطريقة منظمة"];

export default function Home() {
  const [chats,setChats] = useState<Chat[]>([]);
  const [activeId,setActiveId] = useState("new");
  const [input,setInput] = useState("");
  const [busy,setBusy] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const active = chats.find(c=>c.id===activeId);
  const messages = active?.messages ?? [];

  useEffect(()=>{ try { const s=localStorage.getItem("ai-unlimited-chats"); if(s) setChats(JSON.parse(s)); } catch {} },[]);
  useEffect(()=>{ localStorage.setItem("ai-unlimited-chats",JSON.stringify(chats)); bottom.current?.scrollIntoView({behavior:"smooth"}); },[chats]);

  function update(id:string, next:Message[]) {
    setChats(prev=>prev.some(c=>c.id===id)?prev.map(c=>c.id===id?{...c,messages:next}:c):[{id,title:next.find(m=>m.role==="user")?.content.slice(0,32)||"محادثة جديدة",messages:next},...prev]);
  }
  async function send(text=input) {
    const prompt=text.trim(); if(!prompt||busy) return;
    const id=activeId==="new"?crypto.randomUUID():activeId; setActiveId(id); setInput(""); setBusy(true);
    const next=[...messages,{role:"user" as const,content:prompt},{role:"assistant" as const,content:"جاري التفكير..."}];
    update(id,next);
    try {
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:next.slice(0,-1).map(({role,content})=>({role,content}))})});
      const data=await r.json(); if(!r.ok) throw new Error(data.error||"تعذر الاتصال");
      update(id,[...next.slice(0,-1),{role:"assistant",content:data.content,provider:data.provider}]);
    } catch(e) { update(id,[...next.slice(0,-1),{role:"assistant",content:"حدث خطأ: "+(e as Error).message+"\nتأكد من إعداد مفاتيح المزودين في Vercel."}]); }
    finally { setBusy(false); }
  }
  return <main className="shell">
    <aside className={`sidebar ${menuOpen?"open":""}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={21}/></div><div><b>AI <span>UNLIMITED</span></b><small>INTELLIGENCE HUB</small></div></div>
      <button className="new-chat" onClick={()=>{setActiveId("new");setInput("");setMenuOpen(false)}}><Plus size={17}/> محادثة جديدة</button>
      <div className="side-label">محادثاتك السابقة</div>
      <div className="history">{chats.map(c=><button key={c.id} className={`history-item ${activeId===c.id?"active":""}`} onClick={()=>{setActiveId(c.id);setMenuOpen(false)}}><MessageSquare size={15}/><span>{c.title}</span></button>)}</div>
      <div className="sidebar-bottom"><ShieldCheck size={16}/> مفاتيحك تبقى على الخادم</div>
    </aside>
    <section className="main">
      <header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}><Menu size={20}/></button><div className="crumb">مساحة العمل <span>/</span> <b>المساعد الذكي</b></div><div className="status"><i/> جاهز للعمل</div></header>
      <div className="content">
        {messages.length===0?<div className="welcome"><div className="eyebrow"><i/> UNIFIED AI WORKSPACE</div><div className="hero-icon"><Sparkles size={30}/></div><h1>ذكاء اصطناعي<br/><em>بلا حدود لإبداعك.</em></h1><p className="subtitle">منصة واحدة تجمع عدة مزودين للذكاء الاصطناعي، وتنتقل تلقائياً إلى مزود آخر عند تعذر الخدمة أو بلوغ حدود الاستخدام.</p><div className="starter-grid">{starters.map(s=><button className="starter" key={s} onClick={()=>send(s)}><Sparkles size={17}/>{s}</button>)}</div></div>:<div className="conversation"><h2>{active?.title||"محادثة جديدة"}</h2>{messages.map((m,i)=><article key={i} className={`message ${m.role}`}><div className="avatar">{m.role==="user"?"أ":<Bot size={17}/>}</div><div className="message-body"><div className="message-meta">{m.role==="user"?"أنت":"AI UNLIMITED"} {m.provider&&<span className="tag">{m.provider}</span>}</div><p>{m.content}</p></div></article>)}<div ref={bottom}/></div>}
      </div>
      <div className="composer-wrap"><div className="composer"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="اكتب سؤالك أو ابدأ محادثة جديدة..." rows={1}/><div className="composer-foot"><span><i/> التبديل التلقائي بين المزودين</span><button className="send-btn" disabled={!input.trim()||busy} onClick={()=>send()}>{busy?<span className="spinner"/>:<ArrowUp size={19}/>}</button></div></div><div className="disclaimer">قد تختلف حدود الاستخدام حسب مزود الخدمة وخطته. لا يمكن تجاوز حصص الشركات المجانية.</div></div>
    </section>
  </main>;
}