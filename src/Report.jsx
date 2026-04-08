import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───
const COMPANY = "thyssenkrupp AG";
const TOTAL_OPEN = 100;

const ROLES = [
  { rank:1, title:"HR Working Student / Werkstudent HR Administration", score:67, tier:"High", hours:12,
    jd:"Manage employee onboarding documentation and verification processes. Schedule and coordinate interview panels across multiple departments. Process leave requests and maintain attendance records in SAP SuccessFactors. Prepare monthly HR reports and headcount dashboards. Screen incoming applications and route to hiring managers. Maintain personnel files and ensure GDPR compliance.",
    tasks:[
      {name:"Resume screening & routing", score:92, auto:true},
      {name:"Interview scheduling", score:88, auto:true},
      {name:"Leave request processing", score:85, auto:true},
      {name:"Onboarding doc verification", score:78, auto:true},
      {name:"Monthly HR reporting", score:72, auto:true},
      {name:"GDPR compliance checks", score:45, auto:false},
    ]},
  { rank:2, title:"HR Intern - Restructuring Support", score:57, tier:"Medium", hours:12,
    jd:"Support organizational restructuring by consolidating employee data across business units. Generate headcount impact reports for leadership review. Update org charts and reporting structures in Visio and SAP. Draft internal communications for affected teams. Coordinate with works council on consultation timelines.",
    tasks:[
      {name:"Data consolidation across BUs", score:82, auto:true},
      {name:"Headcount impact reporting", score:75, auto:true},
      {name:"Org chart updates", score:70, auto:true},
      {name:"Draft internal comms", score:55, auto:false},
      {name:"Works council coordination", score:20, auto:false},
    ]},
  { rank:3, title:"Werkstudent HR Business Partner Support", score:57, tier:"Medium", hours:10,
    jd:"Maintain and update employee master data in SAP HCM. Analyze pulse survey results and create summary presentations. Update HR policy documents and ensure version control. Support HRBP team with ad-hoc data pulls and analytics. Coordinate employee engagement initiatives across sites.",
    tasks:[
      {name:"Employee data management", score:90, auto:true},
      {name:"Survey analysis & summaries", score:74, auto:true},
      {name:"Policy document updates", score:68, auto:true},
      {name:"Ad-hoc data pulls", score:60, auto:false},
      {name:"Engagement initiative coordination", score:25, auto:false},
    ]},
  { rank:4, title:"Speditioneller Disponent / Fleet Dispatcher", score:45, tier:"Medium", hours:8,
    jd:"Plan and optimize daily delivery routes across regional distribution network. Assign drivers to loads based on availability, certification, and proximity. Monitor fleet GPS and flag delays or deviations in real-time. Ensure compliance with EU driving time regulations. Manage load scheduling and dock appointment booking.",
    tasks:[
      {name:"Route optimization", score:88, auto:true},
      {name:"Load scheduling", score:72, auto:true},
      {name:"Compliance monitoring", score:55, auto:false},
      {name:"Driver assignment", score:48, auto:false},
      {name:"Delay escalation", score:30, auto:false},
    ]},
  { rank:5, title:"IT Support Analyst - SAP Basis", score:42, tier:"Medium", hours:7,
    jd:"Triage incoming support tickets and categorize by severity and module. Monitor SAP system health dashboards and respond to alerts. Document patch deployment procedures and maintain runbooks. Perform user access provisioning and role assignment. Coordinate with SAP vendors on escalated issues.",
    tasks:[
      {name:"Ticket triage & categorization", score:85, auto:true},
      {name:"System health monitoring", score:78, auto:true},
      {name:"Patch documentation", score:52, auto:false},
      {name:"User access provisioning", score:45, auto:false},
      {name:"Vendor escalation", score:15, auto:false},
    ]},
  { rank:6, title:"Financial Controller - Plant Ops", score:38, tier:"Low", hours:6,
    jd:"Perform monthly variance analysis on plant operating costs. Prepare journal entries and reconciliations for month-end close. Generate cost center reports for plant managers. Review and approve purchase requisitions against budget. Support annual budgeting and forecasting cycles.",
    tasks:[
      {name:"Variance analysis", score:65, auto:true},
      {name:"Journal entries", score:60, auto:true},
      {name:"Cost center reporting", score:55, auto:false},
      {name:"PO approval workflow", score:40, auto:false},
      {name:"Budget forecasting support", score:20, auto:false},
    ]},
  { rank:7, title:"Quality Inspector - Steel Division", score:35, tier:"Low", hours:5,
    jd:"Log quality defects and non-conformances in MES system. Update SPC charts and flag out-of-spec trends. Prepare documentation for internal and external quality audits. Perform incoming material inspection and sampling. Coordinate corrective action requests with production teams.",
    tasks:[
      {name:"Defect logging in MES", score:72, auto:true},
      {name:"SPC chart updates", score:65, auto:true},
      {name:"Audit documentation prep", score:40, auto:false},
      {name:"Incoming material inspection", score:18, auto:false},
      {name:"Corrective action coordination", score:12, auto:false},
    ]},
  { rank:8, title:"Procurement Specialist - Indirect", score:33, tier:"Low", hours:5,
    jd:"Create and manage purchase orders for indirect categories. Onboard new vendors and maintain supplier master data. Perform three-way invoice matching and resolve discrepancies. Track contract renewals and flag upcoming expirations. Negotiate spot-buy pricing for non-contracted items.",
    tasks:[
      {name:"PO creation & management", score:70, auto:true},
      {name:"Vendor onboarding", score:55, auto:false},
      {name:"Invoice matching", score:68, auto:true},
      {name:"Contract renewal tracking", score:42, auto:false},
      {name:"Spot-buy negotiation", score:8, auto:false},
    ]},
  { rank:9, title:"Marketing Coordinator - Events", score:28, tier:"Low", hours:4,
    jd:"Manage event RSVP tracking and attendee communications. Coordinate with venues, caterers, and AV vendors. Build and send post-event survey campaigns. Maintain event calendar and budget tracker. Create event brief documents for stakeholder alignment.",
    tasks:[
      {name:"RSVP tracking & comms", score:75, auto:true},
      {name:"Vendor coordination", score:30, auto:false},
      {name:"Post-event surveys", score:68, auto:true},
      {name:"Budget tracking", score:35, auto:false},
      {name:"Event brief creation", score:15, auto:false},
    ]},
  { rank:10, title:"Legal Counsel - Compliance", score:22, tier:"Low", hours:3,
    jd:"Review standard contracts and flag non-standard clauses. Track regulatory changes across EU jurisdictions. Maintain NDA and contract template library. Prepare compliance training materials and track completion. Support internal investigations with document review.",
    tasks:[
      {name:"Contract clause flagging", score:58, auto:true},
      {name:"Regulatory change tracking", score:52, auto:false},
      {name:"Template library maintenance", score:40, auto:false},
      {name:"Training material prep", score:22, auto:false},
      {name:"Investigation doc review", score:10, auto:false},
    ]},
];

// ─── SCANNER ───
function LiveScanner({ role, onClose }) {
  const [phase, setPhase] = useState("loading"); // loading → scanning → tasks → done
  const [visibleChars, setVisibleChars] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState(0);
  const [taskScoreAnims, setTaskScoreAnims] = useState({});
  const scrollRef = useRef(null);

  const AUTO_KEYWORDS = ["screen","schedule","coordinate","process","maintain","prepare","report","monitor","track","update","generate","manage","consolidate","automat","route","triage","categorize","log","flag","reconcil","matching","RSVP","survey"];

  useEffect(() => {
    if (phase === "loading") {
      const t = setTimeout(() => setPhase("scanning"), 1800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "scanning") return;
    if (visibleChars >= role.jd.length) {
      setTimeout(() => setPhase("tasks"), 600);
      return;
    }
    const speed = 12 + Math.random() * 8;
    const t = setTimeout(() => {
      const next = Math.min(visibleChars + 2, role.jd.length);
      setVisibleChars(next);
      const text = role.jd.substring(0, next);
      const found = [];
      AUTO_KEYWORDS.forEach(kw => {
        let idx = 0;
        const lower = text.toLowerCase();
        while ((idx = lower.indexOf(kw.toLowerCase(), idx)) !== -1) {
          found.push({ start: idx, end: idx + kw.length });
          idx += kw.length;
        }
      });
      setHighlights(found);
    }, speed);
    return () => clearTimeout(t);
  }, [phase, visibleChars, role.jd]);

  useEffect(() => {
    if (phase !== "tasks") return;
    if (visibleTasks >= role.tasks.length) {
      setTimeout(() => setPhase("done"), 500);
      return;
    }
    const t = setTimeout(() => {
      const idx = visibleTasks;
      setVisibleTasks(idx + 1);
      // animate score
      let frame = 0;
      const target = role.tasks[idx].score;
      const iv = setInterval(() => {
        frame += 4;
        if (frame >= target) { setTaskScoreAnims(p => ({...p, [idx]: target})); clearInterval(iv); }
        else setTaskScoreAnims(p => ({...p, [idx]: frame}));
      }, 20);
    }, 450);
    return () => clearTimeout(t);
  }, [phase, visibleTasks, role.tasks]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleChars, visibleTasks]);

  const renderJD = () => {
    const text = role.jd.substring(0, visibleChars);
    if (highlights.length === 0) return <>{text}<span className="cursor-blink">▌</span></>;
    let parts = [];
    let last = 0;
    const sorted = [...highlights].sort((a,b) => a.start - b.start);
    const merged = [];
    sorted.forEach(h => {
      if (merged.length && h.start <= merged[merged.length-1].end) {
        merged[merged.length-1].end = Math.max(merged[merged.length-1].end, h.end);
      } else merged.push({...h});
    });
    merged.forEach((h, i) => {
      if (h.start > last) parts.push(<span key={`t${i}`}>{text.substring(last, h.start)}</span>);
      parts.push(<span key={`h${i}`} style={{background:"rgba(255,103,0,0.25)",color:"#ff8c3a",borderRadius:3,padding:"1px 2px",borderBottom:"2px solid #ff6700"}}>{text.substring(h.start, Math.min(h.end, text.length))}</span>);
      last = h.end;
    });
    if (last < text.length) parts.push(<span key="rest">{text.substring(last)}</span>);
    if (visibleChars < role.jd.length) parts.push(<span key="cur" className="cursor-blink">▌</span>);
    return parts;
  };

  return (
    <div style={{background:"#0c0a14",border:"1px solid rgba(255,103,0,0.15)",borderRadius:16,overflow:"hidden"}}>
      <style>{`
        @keyframes blink { 0%,50% {opacity:1} 51%,100% {opacity:0} }
        .cursor-blink { animation: blink 0.8s infinite; color: #ff6700; }
        @keyframes slideUp { from {opacity:0;transform:translateY(12px)} to {opacity:1;transform:translateY(0)} }
        .task-row { animation: slideUp 0.3s ease-out forwards; }
        @keyframes pulse { 0%,100% {opacity:0.4} 50% {opacity:1} }
        .scan-pulse { animation: pulse 1.2s ease-in-out infinite; }
        @keyframes barGrow { from {width:0} }
        .score-bar { animation: barGrow 0.6s ease-out forwards; }
      `}</style>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,103,0,0.03)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:phase==="done"?"#4ade80":"#ff6700"}} className={phase!=="done"?"scan-pulse":""} />
          <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1,fontFamily:"'DM Mono',monospace"}}>
            {phase==="loading"?"INITIALIZING AI ENGINE...":phase==="scanning"?"SCANNING JOB DESCRIPTION...":phase==="tasks"?"EXTRACTING AUTOMATABLE TASKS...":"ANALYSIS COMPLETE"}
          </span>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
      </div>

      <div ref={scrollRef} style={{maxHeight:420,overflowY:"auto",padding:20}}>
        {/* Role Title */}
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:4}}>{role.title}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
          <span style={{padding:"3px 10px",borderRadius:20,background:role.tier==="High"?"rgba(255,103,0,0.15)":role.tier==="Medium"?"rgba(255,179,71,0.15)":"rgba(255,255,255,0.06)",color:role.tier==="High"?"#ff6700":role.tier==="Medium"?"#ffb347":"#888",fontSize:11,fontWeight:700}}>{role.tier}</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>Score: {role.score}/100</span>
        </div>

        {/* Loading */}
        {phase==="loading" && (
          <div style={{padding:"32px 0",textAlign:"center"}}>
            <div style={{width:40,height:40,margin:"0 auto 16px",border:"3px solid rgba(255,103,0,0.15)",borderTopColor:"#ff6700",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>Connecting to iMocha AI Engine...</div>
          </div>
        )}

        {/* JD Scan */}
        {(phase==="scanning"||phase==="tasks"||phase==="done") && (
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1,marginBottom:10}}>JOB DESCRIPTION SCAN</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,fontFamily:"'DM Mono',monospace",whiteSpace:"pre-wrap"}}>{renderJD()}</div>
            {highlights.length > 0 && (
              <div style={{marginTop:10,fontSize:11,color:"#ff6700",fontWeight:600}}>{highlights.length} automatable keywords detected</div>
            )}
          </div>
        )}

        {/* Tasks */}
        {(phase==="tasks"||phase==="done") && visibleTasks > 0 && (
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1,marginBottom:12}}>EXTRACTED TASKS</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {role.tasks.slice(0, visibleTasks).map((task, i) => {
                const sc = taskScoreAnims[i] ?? 0;
                return (
                  <div key={i} className="task-row" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10}}>
                    <div style={{width:20,textAlign:"center"}}>
                      {task.auto ? <span style={{fontSize:14}}>⚡</span> : <span style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>—</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:task.auto?"#fff":"rgba(255,255,255,0.4)",marginBottom:4}}>{task.name}</div>
                      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                        <div className="score-bar" style={{height:"100%",borderRadius:2,width:`${sc}%`,background:sc>=70?"#ff6700":sc>=50?"#ffb347":"#555"}} />
                      </div>
                    </div>
                    <div style={{fontSize:16,fontWeight:800,color:sc>=70?"#ff6700":sc>=50?"#ffb347":"rgba(255,255,255,0.3)",minWidth:36,textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{Math.round(sc)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Done Summary */}
        {phase==="done" && (
          <div style={{marginTop:16,padding:16,borderRadius:12,background:"linear-gradient(135deg,rgba(255,103,0,0.08),rgba(255,140,58,0.04))",border:"1px solid rgba(255,103,0,0.12)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>
                  {role.tasks.filter(t=>t.auto).length} of {role.tasks.length} tasks automatable
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>
                  Potential savings: <span style={{color:"#ff6700",fontWeight:700}}>{role.hours}h / week</span>
                </div>
              </div>
              <div style={{fontSize:28,fontWeight:900,color:"#ff6700"}}>{role.score}<span style={{fontSize:14,color:"rgba(255,255,255,0.3)"}}>/100</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROADMAP BUILDER ───
function RoadmapBuilder({ roles, onGate }) {
  const [quarters, setQuarters] = useState({ Q1: [], Q2: [], Q3: [], Q4: [] });
  const [dragRole, setDragRole] = useState(null);

  const assigned = new Set(Object.values(quarters).flat().map(r => r.rank));
  const unassigned = roles.filter(r => !assigned.has(r.rank));

  const totalHrs = Object.values(quarters).flat().reduce((a, r) => a + r.hours, 0);
  const totalRoles = Object.values(quarters).flat().length;
  const annualSavings = totalHrs * 52;

  const handleDrop = (q) => {
    if (!dragRole) return;
    if (quarters[q].find(r => r.rank === dragRole.rank)) return;
    setQuarters(prev => {
      const cleaned = {};
      for (const k in prev) cleaned[k] = prev[k].filter(r => r.rank !== dragRole.rank);
      cleaned[q] = [...cleaned[q], dragRole];
      return cleaned;
    });
    setDragRole(null);
  };

  const removeFromQuarter = (q, rank) => {
    setQuarters(prev => ({...prev, [q]: prev[q].filter(r => r.rank !== rank)}));
  };

  return (
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#ff6700",marginBottom:4}}>BUILD YOUR AUTOMATION ROADMAP</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>Drag roles into quarters to plan your rollout</div>
        </div>
        {totalRoles > 0 && (
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#ff6700"}}>{totalRoles}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1}}>ROLES</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#ffb347"}}>{totalHrs}h</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1}}>WEEKLY</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#4ade80"}}>{annualSavings.toLocaleString()}h</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1}}>ANNUAL</div></div>
          </div>
        )}
      </div>

      {/* Unassigned Pool */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1,marginBottom:8}}>AVAILABLE ROLES ({unassigned.length})</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,minHeight:36}}>
          {unassigned.map(r => (
            <div key={r.rank} draggable onDragStart={() => setDragRole(r)}
              style={{padding:"6px 12px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                fontSize:11,color:"rgba(255,255,255,0.5)",cursor:"grab",userSelect:"none",display:"flex",alignItems:"center",gap:6,
                whiteSpace:"nowrap",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis"}}>
              <span style={{color:r.tier==="High"?"#ff6700":r.tier==="Medium"?"#ffb347":"#666",fontWeight:700}}>{r.score}</span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{r.title.length > 28 ? r.title.substring(0, 28) + "…" : r.title}</span>
            </div>
          ))}
          {unassigned.length === 0 && <div style={{fontSize:12,color:"rgba(255,255,255,0.15)",fontStyle:"italic"}}>All roles assigned ✓</div>}
        </div>
      </div>

      {/* Quarters */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
        {["Q1","Q2","Q3","Q4"].map(q => {
          const qhrs = quarters[q].reduce((a,r) => a+r.hours, 0);
          return (
            <div key={q}
              onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(q)}
              style={{border:"1px dashed rgba(255,255,255,0.1)",borderRadius:12,padding:14,minHeight:120,
                background:quarters[q].length?"rgba(255,103,0,0.02)":"transparent",transition:"background 0.2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.5)"}}>{q} 2026</span>
                {qhrs > 0 && <span style={{fontSize:11,fontWeight:700,color:"#ff6700"}}>{qhrs}h/wk</span>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {quarters[q].map(r => (
                  <div key={r.rank} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,background:"rgba(255,103,0,0.06)",border:"1px solid rgba(255,103,0,0.12)"}}>
                    <div style={{flex:1,fontSize:11,color:"rgba(255,255,255,0.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title.length > 22 ? r.title.substring(0,22)+"…" : r.title}</div>
                    <button onClick={() => removeFromQuarter(q, r.rank)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>×</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gate CTA */}
      {totalRoles >= 2 && (
        <div style={{marginTop:20,textAlign:"center"}}>
          <button onClick={onGate} style={{
            padding:"14px 32px",borderRadius:12,border:"none",
            background:"linear-gradient(135deg,#ff6700,#ff8c3a)",
            color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",
            boxShadow:"0 4px 24px rgba(255,103,0,0.3)"
          }}>Download My Automation Roadmap →</button>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:8}}>Includes full analysis for all {TOTAL_OPEN} roles</div>
        </div>
      )}
    </div>
  );
}

// ─── LEAD GATE ───
function LeadGate({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24,backdropFilter:"blur(8px)"}}>
      <div style={{background:"#12101a",border:"1px solid rgba(255,103,0,0.15)",borderRadius:20,padding:32,maxWidth:420,width:"100%"}}>
        <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#ff6700,#ff8c3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",margin:"0 auto 20px"}}>iM</div>
        <div style={{textAlign:"center",fontSize:20,fontWeight:800,color:"#fff",marginBottom:6}}>Your roadmap is ready</div>
        <div style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24}}>Get the full automation analysis for all {TOTAL_OPEN} roles at {COMPANY}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
            style={{padding:"14px 18px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:14,outline:"none"}} />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Work email" type="email"
            style={{padding:"14px 18px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:14,outline:"none"}} />
          <button onClick={() => email && name && onSubmit(email, name)} disabled={!email||!name}
            style={{padding:"14px",borderRadius:12,border:"none",background:email&&name?"linear-gradient(135deg,#ff6700,#ff8c3a)":"rgba(255,255,255,0.06)",
              color:email&&name?"#fff":"rgba(255,255,255,0.2)",fontSize:14,fontWeight:700,cursor:email&&name?"pointer":"default",marginTop:4}}>
            Send Me the Full Report →
          </button>
        </div>
        <div style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:14}}>An iMocha expert will follow up within 1 business day</div>
      </div>
    </div>
  );
}

// ─── POST-GATE: CALENDLY ───
function CalendlyStep() {
  return (
    <div style={{textAlign:"center",padding:"32px 20px",background:"linear-gradient(135deg,rgba(74,222,128,0.06),rgba(74,222,128,0.02))",border:"1px solid rgba(74,222,128,0.12)",borderRadius:16}}>
      <div style={{fontSize:28,marginBottom:8}}>✓</div>
      <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}}>Report sent to your inbox!</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Want to discuss your automation roadmap with an expert?</div>
      <button onClick={() => window.open("https://calendly.com/imocha","_blank")} style={{
        padding:"14px 28px",borderRadius:12,border:"2px solid #ff6700",background:"transparent",
        color:"#ff6700",fontSize:14,fontWeight:700,cursor:"pointer"
      }}>Book a 15-min Call →</button>
    </div>
  );
}

// ─── SCORE GAUGE ───
function ScoreGauge({score,size=64}){
  const r=size/2-5;const c=2*Math.PI*r;
  const col=score>=60?"#ff6700":score>=40?"#ffb347":"#666";
  return(
    <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={4} strokeDasharray={c} strokeDashoffset={c*(1-score/100)} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
    <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={size*0.28} fontWeight={800} fontFamily="'DM Sans',sans-serif">{score}</text></svg>
  );
}

// ─── MAIN ───
export default function Report() {
  const [scanRole, setScanRole] = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [gated, setGated] = useState(false);
  const [filter, setFilter] = useState("All");

  const avgScore = Math.round(ROLES.reduce((a,r)=>a+r.score,0)/ROLES.length);
  const totalHours = ROLES.reduce((a,r)=>a+r.hours,0);
  const highCount = ROLES.filter(r=>r.tier==="High").length;
  const filtered = filter==="All"?ROLES:ROLES.filter(r=>r.tier===filter);

  return (
    <div style={{minHeight:"100vh",background:"#0a0810",color:"#fff",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:#ff6700;color:#fff}
        input::placeholder{color:rgba(255,255,255,0.25)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      {showGate && <LeadGate onSubmit={(email,name) => { setShowGate(false); setGated(true); }} />}

      {/* NAV */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#ff6700,#ff8c3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff"}}>iM</div>
          <span style={{fontSize:14,fontWeight:700}}>iMocha</span>
          <span style={{width:1,height:14,background:"rgba(255,255,255,0.1)",margin:"0 4px"}}/>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>AI Automation Index</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80"}}/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>Powered by Claude</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:"linear-gradient(135deg,#1a0e2e,#120a1e)",padding:"44px 28px 36px",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-100,right:-100,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,103,0,0.06),transparent 70%)"}}/>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2.5,color:"#ff6700",marginBottom:14}}>FULL ANALYSIS AVAILABLE</div>
        <div style={{fontSize:34,fontWeight:900,lineHeight:1.15,maxWidth:580}}>
          <span style={{color:"#ff6700"}}>{TOTAL_OPEN}</span> open roles at <span style={{color:"#ff6700"}}>{COMPANY}</span> are ready for AI automation analysis.
        </div>
        <div style={{marginTop:12,fontSize:13,color:"rgba(255,255,255,0.4)",maxWidth:500,lineHeight:1.6}}>
          You're viewing {ROLES.length} roles. {TOTAL_OPEN - ROLES.length} more haven't been analyzed yet.
        </div>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"28px 20px 64px"}}>
        {/* STATS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:28}}>
          {[
            {v:ROLES.length,l:"Roles Analyzed"},
            {v:avgScore+"%",l:"Avg Score",c:"#ff6700"},
            {v:totalHours+"h",l:"Hrs Saved / Week",c:"#ffb347"},
            {v:highCount,l:"High Potential",c:"#4ade80"},
          ].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"16px 14px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:800,color:s.c||"#fff",lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1,marginTop:5,textTransform:"uppercase"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* SCANNER SECTION */}
        <div style={{marginBottom:28}}>
          {!scanRole ? (
            <div style={{background:"linear-gradient(135deg,rgba(255,103,0,0.06),rgba(255,103,0,0.02))",border:"1px solid rgba(255,103,0,0.1)",borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#ff6700",marginBottom:8}}>🔬 LIVE AI ROLE SCANNER</div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Watch AI analyze a role in real-time</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:18}}>Pick any role below — see how iMocha's AI reads the JD, finds automatable tasks, and scores them live.</div>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8}}>
                {ROLES.slice(0,5).map(r => (
                  <button key={r.rank} onClick={() => setScanRole(r)} style={{
                    padding:"8px 16px",borderRadius:10,border:"1px solid rgba(255,103,0,0.2)",
                    background:"rgba(255,103,0,0.06)",color:"#ff8c3a",fontSize:12,fontWeight:600,cursor:"pointer",
                    maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                  }}>Scan: {r.title.split("/")[0].trim()}</button>
                ))}
              </div>
            </div>
          ) : (
            <LiveScanner role={scanRole} onClose={() => setScanRole(null)} />
          )}
        </div>

        {/* FILTER + ROLES */}
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {["All","High","Medium","Low"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"7px 16px",borderRadius:10,border:"1px solid",
              borderColor:filter===f?"#ff6700":"rgba(255,255,255,0.08)",
              background:filter===f?"rgba(255,103,0,0.1)":"transparent",
              color:filter===f?"#ff6700":"rgba(255,255,255,0.35)",
              fontSize:11,fontWeight:600,cursor:"pointer"
            }}>{f}</button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
          {filtered.map(role => (
            <div key={role.rank} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",
              background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,
              cursor:"pointer",transition:"border-color 0.2s"}}
              onClick={() => setScanRole(role)}>
              <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:700}}>{role.rank}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{role.title}</div>
                <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center"}}>
                  <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,
                    background:role.tier==="High"?"rgba(255,103,0,0.12)":role.tier==="Medium"?"rgba(255,179,71,0.12)":"rgba(255,255,255,0.05)",
                    color:role.tier==="High"?"#ff6700":role.tier==="Medium"?"#ffb347":"#666"}}>{role.tier}</span>
                  <span style={{color:"#ff6700",fontSize:12,fontWeight:700}}>{role.hours}h</span>
                  <span style={{color:"rgba(255,255,255,0.2)",fontSize:10}}>saved/wk</span>
                </div>
              </div>
              <ScoreGauge score={role.score} size={52} />
              <div style={{fontSize:11,color:"rgba(255,103,0,0.6)",fontWeight:600,whiteSpace:"nowrap"}}>Scan →</div>
            </div>
          ))}
        </div>

        {/* ROADMAP BUILDER */}
        <RoadmapBuilder roles={ROLES} onGate={() => setShowGate(true)} />

        {/* POST-GATE CALENDLY */}
        {gated && <div style={{marginTop:24}}><CalendlyStep /></div>}

        {/* FOOTER */}
        <div style={{marginTop:48,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>© 2026 iMocha · AI Automation Index · Confidential</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:20,height:20,borderRadius:5,background:"linear-gradient(135deg,#ff6700,#ff8c3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"#fff"}}>iM</div>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",fontWeight:600}}>imocha.io</span>
          </div>
        </div>
      </div>
    </div>
  );
}
