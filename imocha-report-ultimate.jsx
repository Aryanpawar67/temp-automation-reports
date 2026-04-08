import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const COMPANY = "thyssenkrupp AG";
const TOTAL_OPEN = 100;
const AVG_COST_HR = 52; // EUR

const DEPARTMENTS = [
  { name: "Human Resources", shortName: "HR", roles: [0,1,2], benchmark: 72 },
  { name: "Logistics", shortName: "Logistics", roles: [3], benchmark: 65 },
  { name: "IT Operations", shortName: "IT Ops", roles: [4], benchmark: 68 },
  { name: "Finance", shortName: "Finance", roles: [5], benchmark: 58 },
  { name: "Quality", shortName: "Quality", roles: [6], benchmark: 55 },
  { name: "Procurement", shortName: "Procure.", roles: [7], benchmark: 52 },
  { name: "Marketing", shortName: "Marketing", roles: [8], benchmark: 48 },
  { name: "Legal", shortName: "Legal", roles: [9], benchmark: 40 },
];

const ROLES = [
  { rank:1, title:"HR Working Student / Werkstudent HR Administration", dept:"Human Resources", score:67, tier:"High", hours:12, weeklyHrs:40,
    jd:"Manage employee onboarding documentation and verification processes. Schedule and coordinate interview panels across multiple departments. Process leave requests and maintain attendance records in SAP SuccessFactors. Prepare monthly HR reports and headcount dashboards. Screen incoming applications and route to hiring managers. Maintain personnel files and ensure GDPR compliance.",
    tasks:[
      {name:"Resume screening & routing", score:92, auto:true},
      {name:"Interview scheduling", score:88, auto:true},
      {name:"Leave request processing", score:85, auto:true},
      {name:"Onboarding doc verification", score:78, auto:true},
      {name:"Monthly HR reporting", score:72, auto:true},
      {name:"GDPR compliance checks", score:45, auto:false},
    ],
    freed:["Strategic hiring initiatives","Employer branding projects","DEI program development","Candidate experience design"]},
  { rank:2, title:"HR Intern - Restructuring Support", dept:"Human Resources", score:57, tier:"Medium", hours:12, weeklyHrs:40,
    jd:"Support organizational restructuring by consolidating employee data across business units. Generate headcount impact reports for leadership review. Update org charts and reporting structures in Visio and SAP. Draft internal communications for affected teams. Coordinate with works council on consultation timelines.",
    tasks:[
      {name:"Data consolidation across BUs", score:82, auto:true},
      {name:"Headcount impact reporting", score:75, auto:true},
      {name:"Org chart updates", score:70, auto:true},
      {name:"Draft internal comms", score:55, auto:false},
      {name:"Works council coordination", score:20, auto:false},
    ],
    freed:["Change management strategy","Workforce planning models","Retention risk analysis"]},
  { rank:3, title:"Werkstudent HR Business Partner Support", dept:"Human Resources", score:57, tier:"Medium", hours:10, weeklyHrs:40,
    jd:"Maintain and update employee master data in SAP HCM. Analyze pulse survey results and create summary presentations. Update HR policy documents and ensure version control. Support HRBP team with ad-hoc data pulls and analytics. Coordinate employee engagement initiatives across sites.",
    tasks:[
      {name:"Employee data management", score:90, auto:true},
      {name:"Survey analysis & summaries", score:74, auto:true},
      {name:"Policy document updates", score:68, auto:true},
      {name:"Ad-hoc data pulls", score:60, auto:false},
      {name:"Engagement initiative coordination", score:25, auto:false},
    ],
    freed:["People analytics & insights","Talent development strategy","Strategic HRBP advisory"]},
  { rank:4, title:"Speditioneller Disponent / Fleet Dispatcher", dept:"Logistics", score:45, tier:"Medium", hours:8, weeklyHrs:40,
    jd:"Plan and optimize daily delivery routes across regional distribution network. Assign drivers to loads based on availability, certification, and proximity. Monitor fleet GPS and flag delays or deviations in real-time. Ensure compliance with EU driving time regulations. Manage load scheduling and dock appointment booking.",
    tasks:[
      {name:"Route optimization", score:88, auto:true},
      {name:"Load scheduling", score:72, auto:true},
      {name:"Compliance monitoring", score:55, auto:false},
      {name:"Driver assignment", score:48, auto:false},
      {name:"Delay escalation", score:30, auto:false},
    ],
    freed:["Fleet cost reduction strategy","Predictive maintenance planning","Carrier negotiation"]},
  { rank:5, title:"IT Support Analyst - SAP Basis", dept:"IT Operations", score:42, tier:"Medium", hours:7, weeklyHrs:40,
    jd:"Triage incoming support tickets and categorize by severity and module. Monitor SAP system health dashboards and respond to alerts. Document patch deployment procedures and maintain runbooks. Perform user access provisioning and role assignment. Coordinate with SAP vendors on escalated issues.",
    tasks:[
      {name:"Ticket triage & categorization", score:85, auto:true},
      {name:"System health monitoring", score:78, auto:true},
      {name:"Patch documentation", score:52, auto:false},
      {name:"User access provisioning", score:45, auto:false},
      {name:"Vendor escalation", score:15, auto:false},
    ],
    freed:["AIOps & proactive monitoring","Infrastructure automation","Architecture improvements"]},
  { rank:6, title:"Financial Controller - Plant Ops", dept:"Finance", score:38, tier:"Low", hours:6, weeklyHrs:40,
    jd:"Perform monthly variance analysis on plant operating costs. Prepare journal entries and reconciliations for month-end close. Generate cost center reports for plant managers. Review and approve purchase requisitions against budget. Support annual budgeting and forecasting cycles.",
    tasks:[
      {name:"Variance analysis", score:65, auto:true},
      {name:"Journal entries & reconciliation", score:60, auto:true},
      {name:"Cost center reporting", score:55, auto:false},
      {name:"PO approval workflow", score:40, auto:false},
      {name:"Budget forecasting support", score:20, auto:false},
    ],
    freed:["Strategic financial planning","Predictive cost modeling","Business case development"]},
  { rank:7, title:"Quality Inspector - Steel Division", dept:"Quality", score:35, tier:"Low", hours:5, weeklyHrs:40,
    jd:"Log quality defects and non-conformances in MES system. Update SPC charts and flag out-of-spec trends. Prepare documentation for internal and external quality audits. Perform incoming material inspection and sampling. Coordinate corrective action requests with production teams.",
    tasks:[
      {name:"Defect logging in MES", score:72, auto:true},
      {name:"SPC chart updates", score:65, auto:true},
      {name:"Audit documentation prep", score:40, auto:false},
      {name:"Incoming material inspection", score:18, auto:false},
      {name:"Corrective action coordination", score:12, auto:false},
    ],
    freed:["Predictive quality analytics","Root cause analysis","Process improvement"]},
  { rank:8, title:"Procurement Specialist - Indirect", dept:"Procurement", score:33, tier:"Low", hours:5, weeklyHrs:40,
    jd:"Create and manage purchase orders for indirect categories. Onboard new vendors and maintain supplier master data. Perform three-way invoice matching and resolve discrepancies. Track contract renewals and flag upcoming expirations. Negotiate spot-buy pricing for non-contracted items.",
    tasks:[
      {name:"PO creation & management", score:70, auto:true},
      {name:"Invoice matching", score:68, auto:true},
      {name:"Vendor onboarding", score:55, auto:false},
      {name:"Contract renewal tracking", score:42, auto:false},
      {name:"Spot-buy negotiation", score:8, auto:false},
    ],
    freed:["Strategic sourcing","Spend analytics & optimization","Supplier risk management"]},
  { rank:9, title:"Marketing Coordinator - Events", dept:"Marketing", score:28, tier:"Low", hours:4, weeklyHrs:40,
    jd:"Manage event RSVP tracking and attendee communications. Coordinate with venues, caterers, and AV vendors. Build and send post-event survey campaigns. Maintain event calendar and budget tracker. Create event brief documents for stakeholder alignment.",
    tasks:[
      {name:"RSVP tracking & comms", score:75, auto:true},
      {name:"Post-event surveys", score:68, auto:true},
      {name:"Vendor coordination", score:30, auto:false},
      {name:"Budget tracking", score:35, auto:false},
      {name:"Event brief creation", score:15, auto:false},
    ],
    freed:["Campaign strategy & ROI","Brand experience design","Demand generation"]},
  { rank:10, title:"Legal Counsel - Compliance", dept:"Legal", score:22, tier:"Low", hours:3, weeklyHrs:40,
    jd:"Review standard contracts and flag non-standard clauses. Track regulatory changes across EU jurisdictions. Maintain NDA and contract template library. Prepare compliance training materials and track completion. Support internal investigations with document review.",
    tasks:[
      {name:"Contract clause flagging", score:58, auto:true},
      {name:"Regulatory change tracking", score:52, auto:false},
      {name:"Template library maintenance", score:40, auto:false},
      {name:"Training material prep", score:22, auto:false},
      {name:"Investigation doc review", score:10, auto:false},
    ],
    freed:["Proactive risk advisory","Regulatory strategy","M&A due diligence"]},
];

const totalWeeklyHrs = ROLES.reduce((a,r)=>a+r.hours,0);
const avgScore = Math.round(ROLES.reduce((a,r)=>a+r.score,0)/ROLES.length);
const highCount = ROLES.filter(r=>r.tier==="High").length;
const annualHrs = totalWeeklyHrs * 52;
const annualCost = annualHrs * AVG_COST_HR;

const TIER_COLORS = { High:{bg:"rgba(255,103,0,0.12)",text:"#ff6700",border:"rgba(255,103,0,0.25)"}, Medium:{bg:"rgba(255,179,71,0.12)",text:"#ffb347",border:"rgba(255,179,71,0.25)"}, Low:{bg:"rgba(255,255,255,0.05)",text:"#777",border:"rgba(255,255,255,0.08)"} };

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════
const TierBadge = ({tier,small}) => {const c=TIER_COLORS[tier]||TIER_COLORS.Low;return <span style={{padding:small?"2px 7px":"3px 10px",borderRadius:20,background:c.bg,color:c.text,border:`1px solid ${c.border}`,fontSize:small?9:10,fontWeight:700,letterSpacing:0.5,whiteSpace:"nowrap"}}>{tier}</span>};

const SectionLabel = ({children,color="#ff6700",icon}) => <div style={{fontSize:10,fontWeight:700,letterSpacing:2.5,color,marginBottom:10,textTransform:"uppercase"}}>{icon&&<span style={{marginRight:6}}>{icon}</span>}{children}</div>;

// ═══════════════════════════════════════════
// RADAR CHART
// ═══════════════════════════════════════════
function RadarChart({ showBenchmark }) {
  const cx=160,cy=160,maxR=120;
  const n = DEPARTMENTS.length;
  const step = (2*Math.PI)/n;
  const pt = (i,v) => {const a=i*step-Math.PI/2;const r=(v/100)*maxR;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}};
  const path = (vals) => vals.map((v,i)=>{const p=pt(i,v);return `${i===0?"M":"L"} ${p.x} ${p.y}`}).join(" ")+" Z";

  const deptScores = DEPARTMENTS.map(d => {
    const roleScores = d.roles.map(ri => ROLES[ri].score);
    return Math.round(roleScores.reduce((a,s)=>a+s,0)/roleScores.length);
  });

  return (
    <svg viewBox="0 0 320 320" style={{width:"100%",maxWidth:320,margin:"0 auto",display:"block"}}>
      {[25,50,75,100].map(lv=><polygon key={lv} points={DEPARTMENTS.map((_,i)=>{const p=pt(i,lv);return`${p.x},${p.y}`}).join(" ")} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>)}
      {DEPARTMENTS.map((_,i)=>{const p=pt(i,100);return<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.03)" strokeWidth={1}/>})}
      {showBenchmark && <path d={path(DEPARTMENTS.map(d=>d.benchmark))} fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.3)" strokeWidth={1.5} strokeDasharray="4 3"/>}
      <path d={path(deptScores)} fill="rgba(255,103,0,0.1)" stroke="#ff6700" strokeWidth={2}/>
      {deptScores.map((s,i)=>{const p=pt(i,s);return<circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#ff6700" stroke="#0a0810" strokeWidth={2}/>})}
      {DEPARTMENTS.map((d,i)=>{const p=pt(i,112);const anch=p.x<cx-10?"end":p.x>cx+10?"start":"middle";return<text key={i} x={p.x} y={p.y} textAnchor={anch} dominantBaseline="central" fill="rgba(255,255,255,0.4)" fontSize={9} fontWeight={600} fontFamily="'DM Sans',sans-serif">{d.shortName}</text>})}
    </svg>
  );
}

// ═══════════════════════════════════════════
// LIVE COST TICKER
// ═══════════════════════════════════════════
function LiveTicker() {
  const [start] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 60); return () => clearInterval(iv); }, []);
  const secs = (now - start) / 1000;
  const costPerSec = (totalWeeklyHrs * AVG_COST_HR) / (40 * 3600);
  const burned = (secs * costPerSec).toFixed(2);
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderRadius:10,background:"rgba(255,50,0,0.06)",border:"1px solid rgba(255,50,0,0.1)"}}>
      <div style={{width:7,height:7,borderRadius:"50%",background:"#ff3333",animation:"pulse 1.5s infinite"}}/>
      <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Since you opened this report,</span>
      <span style={{fontSize:16,fontWeight:900,color:"#ff4444",fontFamily:"'DM Mono',monospace"}}>€{burned}</span>
      <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>spent on automatable tasks</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// CAPACITY BEFORE/AFTER TOGGLE
// ═══════════════════════════════════════════
function CapacityToggle({ toggled, setToggled }) {
  const topRoles = ROLES.slice(0, 5);
  return (
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:18}}>
        <div>
          <SectionLabel color={toggled?"#4ade80":"#ff6700"} icon={toggled?"✦":"⏳"}>{toggled?"WITH iMOCHA AUTOMATION":"CURRENT STATE — CAPACITY LOST"}</SectionLabel>
          <div style={{fontSize:16,fontWeight:800,lineHeight:1.3}}>
            {toggled
              ? <><span style={{color:"#4ade80"}}>{totalWeeklyHrs}h/week</span> redirected to strategic work</>
              : <><span style={{color:"#ff6700"}}>{totalWeeklyHrs}h/week</span> buried in manual tasks</>}
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:2}}>
            = {(totalWeeklyHrs/40).toFixed(1)} FTEs · €{Math.round(annualCost).toLocaleString("de-DE")}/year
          </div>
        </div>
        {/* Toggle */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:11,fontWeight:600,color:!toggled?"#ff6700":"rgba(255,255,255,0.2)"}}>Before</span>
          <div onClick={()=>setToggled(!toggled)} style={{width:52,height:26,borderRadius:13,cursor:"pointer",position:"relative",background:toggled?"rgba(74,222,128,0.25)":"rgba(255,103,0,0.25)",border:`1px solid ${toggled?"rgba(74,222,128,0.35)":"rgba(255,103,0,0.35)"}`,transition:"all 0.3s"}}>
            <div style={{width:20,height:20,borderRadius:"50%",position:"absolute",top:2,left:toggled?28:3,background:toggled?"#4ade80":"#ff6700",boxShadow:`0 0 10px ${toggled?"rgba(74,222,128,0.4)":"rgba(255,103,0,0.4)"}`,transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)"}}/>
          </div>
          <span style={{fontSize:11,fontWeight:600,color:toggled?"#4ade80":"rgba(255,255,255,0.2)"}}>After</span>
        </div>
      </div>

      {/* Role capacity bars */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {topRoles.map((role, i) => {
          const pct = (role.hours / role.weeklyHrs) * 100;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{role.title.split("/")[0].trim()}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,fontWeight:800,color:toggled?"#4ade80":"#ff6700",fontFamily:"'DM Mono',monospace"}}>{role.hours}h</span>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>{toggled?"unlocked":"wasted"}/wk</span>
                  </div>
                </div>
                {/* Bar */}
                <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.04)",overflow:"hidden",position:"relative"}}>
                  <div style={{height:"100%",borderRadius:4,width:`${100-pct}%`,background:"rgba(255,255,255,0.06)",transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                  <div style={{position:"absolute",right:0,top:0,height:"100%",borderRadius:4,width:`${pct}%`,
                    background:toggled?"linear-gradient(90deg,rgba(74,222,128,0.3),rgba(74,222,128,0.15))":"linear-gradient(90deg,rgba(255,103,0,0.3),rgba(255,103,0,0.15))",
                    transition:"all 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                </div>
                {/* Freed-up work preview */}
                {toggled && (
                  <div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:4}}>
                    {role.freed.slice(0,2).map((f,j)=>(
                      <span key={j} style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:"rgba(74,222,128,0.08)",color:"rgba(74,222,128,0.6)",border:"1px solid rgba(74,222,128,0.1)"}}>✦ {f}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"rgba(255,255,255,0.2)"}}>Showing top 5 of {ROLES.length} analyzed roles</div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LIVE AI SCANNER
// ═══════════════════════════════════════════
function LiveScanner({ role, onClose }) {
  const [phase, setPhase] = useState("loading");
  const [visibleChars, setVisibleChars] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState(0);
  const [taskAnims, setTaskAnims] = useState({});
  const scrollRef = useRef(null);
  const KW = ["screen","schedule","coordinate","process","maintain","prepare","report","monitor","track","update","generate","manage","consolidate","automat","route","triage","categorize","log","flag","reconcil","matching","RSVP","survey","review","create"];

  useEffect(()=>{if(phase==="loading"){const t=setTimeout(()=>setPhase("scanning"),1500);return()=>clearTimeout(t)}},[phase]);

  useEffect(()=>{
    if(phase!=="scanning")return;
    if(visibleChars>=role.jd.length){setTimeout(()=>setPhase("tasks"),500);return}
    const t=setTimeout(()=>{
      const next=Math.min(visibleChars+2,role.jd.length);
      setVisibleChars(next);
      const text=role.jd.substring(0,next).toLowerCase();
      const found=[];
      KW.forEach(kw=>{let idx=0;while((idx=text.indexOf(kw.toLowerCase(),idx))!==-1){found.push({start:idx,end:idx+kw.length});idx+=kw.length}});
      setHighlights(found);
    },12+Math.random()*8);
    return()=>clearTimeout(t);
  },[phase,visibleChars,role.jd]);

  useEffect(()=>{
    if(phase!=="tasks")return;
    if(visibleTasks>=role.tasks.length){setTimeout(()=>setPhase("done"),400);return}
    const t=setTimeout(()=>{
      const idx=visibleTasks;setVisibleTasks(idx+1);
      let f=0;const target=role.tasks[idx].score;
      const iv=setInterval(()=>{f+=4;if(f>=target){setTaskAnims(p=>({...p,[idx]:target}));clearInterval(iv)}else setTaskAnims(p=>({...p,[idx]:f}))},18);
    },400);
    return()=>clearTimeout(t);
  },[phase,visibleTasks,role.tasks]);

  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight},[visibleChars,visibleTasks]);

  const renderJD=()=>{
    const text=role.jd.substring(0,visibleChars);
    if(!highlights.length)return<>{text}<span className="cblink">▌</span></>;
    const merged=[];
    [...highlights].sort((a,b)=>a.start-b.start).forEach(h=>{if(merged.length&&h.start<=merged[merged.length-1].end)merged[merged.length-1].end=Math.max(merged[merged.length-1].end,h.end);else merged.push({...h})});
    let parts=[],last=0;
    merged.forEach((h,i)=>{
      if(h.start>last)parts.push(<span key={`t${i}`}>{text.substring(last,h.start)}</span>);
      parts.push(<span key={`h${i}`} style={{background:"rgba(255,103,0,0.25)",color:"#ff8c3a",borderRadius:3,padding:"1px 2px",borderBottom:"2px solid #ff6700"}}>{text.substring(h.start,Math.min(h.end,text.length))}</span>);
      last=h.end;
    });
    if(last<text.length)parts.push(<span key="r">{text.substring(last)}</span>);
    if(visibleChars<role.jd.length)parts.push(<span key="c" className="cblink">▌</span>);
    return parts;
  };

  return(
    <div style={{background:"#0c0a14",border:"1px solid rgba(255,103,0,0.15)",borderRadius:16,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,103,0,0.03)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:phase==="done"?"#4ade80":"#ff6700"}} className={phase!=="done"?"scan-pulse":""}/>
          <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:0.8,fontFamily:"'DM Mono',monospace"}}>
            {phase==="loading"?"INITIALIZING...":phase==="scanning"?"SCANNING JOB DESCRIPTION...":phase==="tasks"?"EXTRACTING TASKS...":"ANALYSIS COMPLETE"}
          </span>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:16,lineHeight:1,padding:"4px"}}>✕</button>
      </div>
      <div ref={scrollRef} style={{maxHeight:380,overflowY:"auto",padding:18}}>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>{role.title}</div>
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:14}}>
          <TierBadge tier={role.tier} small/><span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>Score: {role.score}/100</span>
        </div>
        {phase==="loading"&&<div style={{padding:"28px 0",textAlign:"center"}}><div style={{width:36,height:36,margin:"0 auto 12px",border:"3px solid rgba(255,103,0,0.15)",borderTopColor:"#ff6700",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><div style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>Connecting to iMocha AI Engine...</div></div>}
        {(phase==="scanning"||phase==="tasks"||phase==="done")&&(
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1,marginBottom:8}}>JOB DESCRIPTION SCAN</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.7,fontFamily:"'DM Mono',monospace"}}>{renderJD()}</div>
            {highlights.length>0&&<div style={{marginTop:8,fontSize:10,color:"#ff6700",fontWeight:600}}>{highlights.length} automatable keywords detected</div>}
          </div>
        )}
        {(phase==="tasks"||phase==="done")&&visibleTasks>0&&(
          <div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1,marginBottom:10}}>EXTRACTED TASKS</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {role.tasks.slice(0,visibleTasks).map((task,i)=>{
                const sc=taskAnims[i]??0;
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,animation:"slideUp 0.3s ease-out forwards"}}>
                    <div style={{width:18,textAlign:"center"}}>{task.auto?<span style={{fontSize:12}}>⚡</span>:<span style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>—</span>}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:task.auto?"#fff":"rgba(255,255,255,0.35)",marginBottom:3}}>{task.name}</div>
                      <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.05)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,width:`${sc}%`,background:sc>=70?"#ff6700":sc>=50?"#ffb347":"#555",transition:"width 0.1s"}}/></div>
                    </div>
                    <span style={{fontSize:14,fontWeight:800,color:sc>=70?"#ff6700":sc>=50?"#ffb347":"rgba(255,255,255,0.25)",fontFamily:"'DM Mono',monospace",minWidth:30,textAlign:"right"}}>{Math.round(sc)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {phase==="done"&&(
          <div style={{marginTop:14,padding:14,borderRadius:10,background:"linear-gradient(135deg,rgba(255,103,0,0.06),rgba(255,103,0,0.02))",border:"1px solid rgba(255,103,0,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{role.tasks.filter(t=>t.auto).length}/{role.tasks.length} tasks automatable</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Savings: <span style={{color:"#ff6700",fontWeight:700}}>{role.hours}h/week</span> · <span style={{color:"#ffb347",fontWeight:700}}>€{(role.hours*AVG_COST_HR*52).toLocaleString("de-DE")}/year</span></div>
            </div>
            <div style={{fontSize:26,fontWeight:900,color:"#ff6700"}}>{role.score}<span style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>/100</span></div>
          </div>
        )}
        {phase==="done"&&role.freed&&(
          <div style={{marginTop:10}}>
            <div style={{fontSize:9,color:"rgba(74,222,128,0.5)",fontWeight:600,letterSpacing:1,marginBottom:6}}>✦ UNLOCKED CAPACITY — WHAT THIS ROLE COULD DO INSTEAD</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {role.freed.map((f,j)=><span key={j} style={{padding:"4px 10px",borderRadius:6,background:"rgba(74,222,128,0.08)",color:"rgba(74,222,128,0.6)",border:"1px solid rgba(74,222,128,0.1)",fontSize:11}}>✦ {f}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ROADMAP BUILDER
// ═══════════════════════════════════════════
function RoadmapBuilder({ onGate }) {
  const [quarters,setQuarters]=useState({Q1:[],Q2:[],Q3:[],Q4:[]});
  const [dragRole,setDragRole]=useState(null);
  const assigned=new Set(Object.values(quarters).flat().map(r=>r.rank));
  const unassigned=ROLES.filter(r=>!assigned.has(r.rank));
  const totalHrs=Object.values(quarters).flat().reduce((a,r)=>a+r.hours,0);
  const totalRoles=Object.values(quarters).flat().length;

  const handleDrop=(q)=>{if(!dragRole)return;if(quarters[q].find(r=>r.rank===dragRole.rank))return;setQuarters(p=>{const c={};for(const k in p)c[k]=p[k].filter(r=>r.rank!==dragRole.rank);c[q]=[...c[q],dragRole];return c});setDragRole(null)};
  const remove=(q,rank)=>setQuarters(p=>({...p,[q]:p[q].filter(r=>r.rank!==rank)}));

  return(
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
        <div>
          <SectionLabel icon="🗺️">BUILD YOUR AUTOMATION ROADMAP</SectionLabel>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>Drag roles into quarters to plan your rollout</div>
        </div>
        {totalRoles>0&&(
          <div style={{display:"flex",gap:14}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#ff6700"}}>{totalRoles}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1}}>ROLES</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#ffb347"}}>{totalHrs}h</div><div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1}}>WEEKLY</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:"#4ade80"}}>€{(totalHrs*AVG_COST_HR*52).toLocaleString("de-DE")}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1}}>ANNUAL</div></div>
          </div>
        )}
      </div>
      {/* Pool */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:600,letterSpacing:1,marginBottom:6}}>AVAILABLE ({unassigned.length})</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,minHeight:32}}>
          {unassigned.map(r=>(
            <div key={r.rank} draggable onDragStart={()=>setDragRole(r)} style={{padding:"5px 10px",borderRadius:7,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",fontSize:10,color:"rgba(255,255,255,0.45)",cursor:"grab",userSelect:"none",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
              <span style={{color:TIER_COLORS[r.tier].text,fontWeight:700,fontSize:11}}>{r.score}</span>
              <span>{r.title.length>24?r.title.substring(0,24)+"…":r.title}</span>
            </div>
          ))}
          {unassigned.length===0&&<span style={{fontSize:10,color:"rgba(255,255,255,0.12)",fontStyle:"italic"}}>All roles assigned ✓</span>}
        </div>
      </div>
      {/* Quarters */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
        {["Q1","Q2","Q3","Q4"].map(q=>{
          const qh=quarters[q].reduce((a,r)=>a+r.hours,0);
          return(
            <div key={q} onDragOver={e=>e.preventDefault()} onDrop={()=>handleDrop(q)} style={{border:"1px dashed rgba(255,255,255,0.08)",borderRadius:12,padding:12,minHeight:100,background:quarters[q].length?"rgba(255,103,0,0.02)":"transparent",transition:"background 0.2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.45)"}}>{q}</span>
                {qh>0&&<span style={{fontSize:10,fontWeight:700,color:"#ff6700"}}>{qh}h/wk</span>}
              </div>
              {quarters[q].map(r=>(
                <div key={r.rank} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 8px",borderRadius:7,background:"rgba(255,103,0,0.06)",border:"1px solid rgba(255,103,0,0.1)",marginBottom:4}}>
                  <span style={{flex:1,fontSize:10,color:"rgba(255,255,255,0.5)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title.length>20?r.title.substring(0,20)+"…":r.title}</span>
                  <button onClick={()=>remove(q,r.rank)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:12,lineHeight:1,padding:0}}>×</button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {totalRoles>=2&&(
        <div style={{marginTop:18,textAlign:"center"}}>
          <button onClick={onGate} style={{padding:"14px 30px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ff6700,#ff8c3a)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 24px rgba(255,103,0,0.3)"}}>Download My Automation Roadmap →</button>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.15)",marginTop:6}}>Includes analysis for all {TOTAL_OPEN} roles</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// LEAD GATE MODAL
// ═══════════════════════════════════════════
function LeadGate({onSubmit,onClose}){
  const [email,setEmail]=useState("");const [name,setName]=useState("");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24,backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#12101a",border:"1px solid rgba(255,103,0,0.15)",borderRadius:20,padding:32,maxWidth:400,width:"100%"}}>
        <div style={{width:44,height:44,borderRadius:11,background:"linear-gradient(135deg,#ff6700,#ff8c3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#fff",margin:"0 auto 18px"}}>iM</div>
        <div style={{textAlign:"center",fontSize:18,fontWeight:800,marginBottom:4}}>Your automation roadmap is ready</div>
        <div style={{textAlign:"center",fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:22}}>Full analysis for all {TOTAL_OPEN} roles at {COMPANY}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{padding:"13px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:14,outline:"none"}}/>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Work email" type="email" style={{padding:"13px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:14,outline:"none"}}/>
          <button onClick={()=>email&&name&&onSubmit(email,name)} disabled={!email||!name} style={{padding:"13px",borderRadius:12,border:"none",background:email&&name?"linear-gradient(135deg,#ff6700,#ff8c3a)":"rgba(255,255,255,0.06)",color:email&&name?"#fff":"rgba(255,255,255,0.2)",fontSize:14,fontWeight:700,cursor:email&&name?"pointer":"default",marginTop:2}}>Send Me the Full Report →</button>
        </div>
        <div style={{textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.15)",marginTop:12}}>An iMocha expert will follow up within 1 business day</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN REPORT
// ═══════════════════════════════════════════
export default function Report() {
  const [scanRole,setScanRole]=useState(null);
  const [showGate,setShowGate]=useState(false);
  const [gated,setGated]=useState(false);
  const [filter,setFilter]=useState("All");
  const [showBenchmark,setShowBenchmark]=useState(false);
  const [capacityToggled,setCapacityToggled]=useState(false);
  const [expandedRole,setExpandedRole]=useState(null);

  const filtered=filter==="All"?ROLES:ROLES.filter(r=>r.tier===filter);

  const avgBenchmark = Math.round(DEPARTMENTS.reduce((a,d)=>a+d.benchmark,0)/DEPARTMENTS.length);
  const avgDeptScore = Math.round(DEPARTMENTS.reduce((a,d)=>{const rs=d.roles.map(ri=>ROLES[ri].score);return a+rs.reduce((x,y)=>x+y,0)/rs.length},0)/DEPARTMENTS.length);
  const gapPct = Math.round((avgBenchmark-avgDeptScore)/avgBenchmark*100);

  return(
    <div style={{minHeight:"100vh",background:"#0a0810",color:"#fff",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:#ff6700;color:#fff}
        input::placeholder{color:rgba(255,255,255,0.25)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .cblink{animation:blink 0.8s infinite}
        @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}
        .scan-pulse{animation:pulse 1.2s ease-in-out infinite}
      `}</style>

      {showGate&&<LeadGate onSubmit={()=>{setShowGate(false);setGated(true)}} onClose={()=>setShowGate(false)}/>}

      {/* ── NAV ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,background:"rgba(10,8,16,0.9)",backdropFilter:"blur(12px)",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#ff6700,#ff8c3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff"}}>iM</div>
          <span style={{fontSize:13,fontWeight:700}}>iMocha</span>
          <span style={{width:1,height:12,background:"rgba(255,255,255,0.1)",margin:"0 3px"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>AI Automation Index</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#4ade80"}}/>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>Powered by Claude</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{background:"linear-gradient(135deg,#1a0e2e,#120a1e)",padding:"40px 24px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-100,right:-100,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,103,0,0.06),transparent 70%)"}}/>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2.5,color:"#ff6700",marginBottom:12}}>PERSONALIZED AUTOMATION ANALYSIS</div>
        <div style={{fontSize:30,fontWeight:900,lineHeight:1.15,maxWidth:560}}>
          <span style={{color:"#ff6700"}}>{TOTAL_OPEN}</span> open roles at <span style={{color:"#ff6700"}}>{COMPANY}</span> are ready for AI automation.
        </div>
        <div style={{marginTop:10,fontSize:13,color:"rgba(255,255,255,0.35)",maxWidth:500,lineHeight:1.6}}>
          {ROLES.length} roles analyzed · {TOTAL_OPEN-ROLES.length} awaiting analysis · Scroll to explore your automation potential
        </div>
        <div style={{marginTop:20}}><LiveTicker/></div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"28px 20px 64px"}}>

        {/* ── STATS ROW ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(115px,1fr))",gap:8,marginBottom:28}}>
          {[
            {v:ROLES.length,l:"ROLES ANALYZED"},
            {v:avgScore+"%",l:"AVG SCORE",c:"#ff6700"},
            {v:totalWeeklyHrs+"h",l:"HRS SAVED / WK",c:"#ffb347"},
            {v:highCount,l:"HIGH POTENTIAL",c:"#4ade80"},
            {v:"€"+Math.round(annualCost/1000)+"K",l:"ANNUAL SAVINGS",c:"#ff4444"},
          ].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:s.c||"#fff",lineHeight:1,fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.25)",fontWeight:600,letterSpacing:1.2,marginTop:5}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── DEPARTMENT RADAR ── */}
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:20,marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:4}}>
            <div>
              <SectionLabel icon="📡">AUTOMATION MATURITY BY DEPARTMENT</SectionLabel>
              <div style={{fontSize:14,fontWeight:700}}>
                {COMPANY} is <span style={{color:"#ff6700"}}>{gapPct}% behind</span> industry peers
              </div>
            </div>
            <button onClick={()=>setShowBenchmark(!showBenchmark)} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${showBenchmark?"rgba(74,222,128,0.3)":"rgba(255,255,255,0.1)"}`,background:showBenchmark?"rgba(74,222,128,0.06)":"transparent",color:showBenchmark?"#4ade80":"rgba(255,255,255,0.35)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>
              {showBenchmark?"✓ ":""}Industry Benchmark
            </button>
          </div>
          <RadarChart showBenchmark={showBenchmark}/>
          <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:3,borderRadius:2,background:"#ff6700"}}/><span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{COMPANY}</span></div>
            {showBenchmark&&<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:1,borderTop:"2px dashed rgba(74,222,128,0.5)"}}/><span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Benchmark</span></div>}
          </div>
        </div>

        {/* ── CAPACITY TOGGLE ── */}
        <div style={{marginBottom:24}}>
          <CapacityToggle toggled={capacityToggled} setToggled={setCapacityToggled}/>
        </div>

        {/* ── LIVE SCANNER PROMPT ── */}
        <div style={{marginBottom:24}}>
          {!scanRole ? (
            <div style={{background:"linear-gradient(135deg,rgba(255,103,0,0.05),rgba(255,103,0,0.02))",border:"1px solid rgba(255,103,0,0.1)",borderRadius:16,padding:"22px 18px",textAlign:"center"}}>
              <SectionLabel icon="🔬">LIVE AI ROLE SCANNER</SectionLabel>
              <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Watch AI analyze any role in real-time</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:16}}>See how iMocha reads the JD, detects automatable tasks, and scores them — live.</div>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6}}>
                {ROLES.slice(0,4).map(r=>(
                  <button key={r.rank} onClick={()=>setScanRole(r)} style={{padding:"7px 14px",borderRadius:9,border:"1px solid rgba(255,103,0,0.2)",background:"rgba(255,103,0,0.05)",color:"#ff8c3a",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                    Scan: {r.title.split("/")[0].trim().substring(0,20)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <LiveScanner role={scanRole} onClose={()=>setScanRole(null)}/>
          )}
        </div>

        {/* ── ROLE LIST ── */}
        <div style={{marginBottom:24}}>
          <SectionLabel icon="📋">ALL ANALYZED ROLES</SectionLabel>
          <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
            {["All","High","Medium","Low"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:8,border:"1px solid",borderColor:filter===f?"#ff6700":"rgba(255,255,255,0.07)",background:filter===f?"rgba(255,103,0,0.1)":"transparent",color:filter===f?"#ff6700":"rgba(255,255,255,0.3)",fontSize:11,fontWeight:600,cursor:"pointer"}}>{f}</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {filtered.map(role=>{
              const isExp=expandedRole===role.rank;
              const annualSave=role.hours*AVG_COST_HR*52;
              return(
                <div key={role.rank} style={{background:isExp?"rgba(255,103,0,0.03)":"rgba(255,255,255,0.02)",border:`1px solid ${isExp?"rgba(255,103,0,0.12)":"rgba(255,255,255,0.05)"}`,borderRadius:12,overflow:"hidden",transition:"all 0.2s"}}>
                  <div onClick={()=>setExpandedRole(isExp?null:role.rank)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700}}>{role.rank}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{role.title}</div>
                      <div style={{display:"flex",gap:6,marginTop:3,alignItems:"center"}}>
                        <TierBadge tier={role.tier} small/>
                        <span style={{fontSize:12,fontWeight:700,color:"#ff6700"}}>{role.hours}h</span>
                        <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>saved/wk</span>
                        <span style={{fontSize:9,color:"rgba(255,255,255,0.12)"}}>·</span>
                        <span style={{fontSize:10,color:"#ffb347",fontWeight:600}}>€{Math.round(annualSave/1000)}K/yr</span>
                      </div>
                    </div>
                    {/* Score ring */}
                    <svg width={48} height={48}>
                      <circle cx={24} cy={24} r={19} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3.5}/>
                      <circle cx={24} cy={24} r={19} fill="none" stroke={role.score>=60?"#ff6700":role.score>=40?"#ffb347":"#555"} strokeWidth={3.5}
                        strokeDasharray={2*Math.PI*19} strokeDashoffset={2*Math.PI*19*(1-role.score/100)} strokeLinecap="round" transform="rotate(-90 24 24)"/>
                      <text x={24} y={25} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={13} fontWeight={800} fontFamily="'DM Sans'">{role.score}</text>
                    </svg>
                    <div style={{fontSize:10,color:"rgba(255,103,0,0.5)",cursor:"pointer",whiteSpace:"nowrap"}} onClick={e=>{e.stopPropagation();setScanRole(role)}}>Scan →</div>
                  </div>

                  {/* Expanded detail */}
                  {isExp&&(
                    <div style={{padding:"0 16px 16px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                      {/* Task impact lines */}
                      <div style={{marginTop:14}}>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:600,letterSpacing:1,marginBottom:8}}>TASK-LEVEL AUTOMATION POTENTIAL</div>
                        {role.tasks.map((task,ti)=>(
                          <div key={ti} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:ti<role.tasks.length-1?"1px solid rgba(255,255,255,0.03)":"none"}}>
                            <span style={{width:16,textAlign:"center",fontSize:11}}>{task.auto?"⚡":"·"}</span>
                            <span style={{flex:1,fontSize:12,fontWeight:500,color:task.auto?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.3)"}}>{task.name}</span>
                            <div style={{width:80,height:4,borderRadius:2,background:"rgba(255,255,255,0.05)",overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:2,width:`${task.score}%`,background:task.score>=70?"#ff6700":task.score>=50?"#ffb347":"rgba(255,255,255,0.15)"}}/>
                            </div>
                            <span style={{fontSize:11,fontWeight:700,color:task.score>=70?"#ff6700":task.score>=50?"#ffb347":"rgba(255,255,255,0.2)",minWidth:24,textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{task.score}</span>
                          </div>
                        ))}
                      </div>

                      {/* What gets unlocked */}
                      <div style={{marginTop:14}}>
                        <div style={{fontSize:9,color:"rgba(74,222,128,0.5)",fontWeight:600,letterSpacing:1,marginBottom:6}}>✦ CAPACITY UNLOCKED — HIGH-VALUE WORK</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {role.freed.map((f,j)=><span key={j} style={{padding:"4px 10px",borderRadius:6,background:"rgba(74,222,128,0.06)",color:"rgba(74,222,128,0.55)",border:"1px solid rgba(74,222,128,0.1)",fontSize:10}}>✦ {f}</span>)}
                        </div>
                      </div>

                      {/* Impact summary */}
                      <div style={{marginTop:14,padding:12,borderRadius:10,background:"rgba(255,103,0,0.04)",border:"1px solid rgba(255,103,0,0.08)",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:8}}>
                        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:"#ff6700"}}>{role.tasks.filter(t=>t.auto).length}/{role.tasks.length}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.2)",letterSpacing:1}}>AUTOMATABLE</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:"#ffb347"}}>{role.hours}h</div><div style={{fontSize:8,color:"rgba(255,255,255,0.2)",letterSpacing:1}}>WEEKLY</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:"#4ade80"}}>{role.hours*52}h</div><div style={{fontSize:8,color:"rgba(255,255,255,0.2)",letterSpacing:1}}>ANNUAL</div></div>
                        <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:"#ff4444"}}>€{Math.round(annualSave/1000)}K</div><div style={{fontSize:8,color:"rgba(255,255,255,0.2)",letterSpacing:1}}>COST SAVED</div></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROADMAP BUILDER ── */}
        <div style={{marginBottom:24}}>
          <RoadmapBuilder onGate={()=>setShowGate(true)}/>
        </div>

        {/* ── POST-GATE CALENDLY ── */}
        {gated&&(
          <div style={{textAlign:"center",padding:"28px 20px",background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:16,marginBottom:24}}>
            <div style={{fontSize:24,marginBottom:6}}>✓</div>
            <div style={{fontSize:17,fontWeight:800,marginBottom:4}}>Full report sent to your inbox!</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:18}}>Want to walk through your automation roadmap with an expert?</div>
            <button onClick={()=>window.open("https://calendly.com/imocha","_blank")} style={{padding:"13px 28px",borderRadius:12,border:"2px solid #ff6700",background:"transparent",color:"#ff6700",fontSize:14,fontWeight:700,cursor:"pointer"}}>Book a 15-min Strategy Call →</button>
          </div>
        )}

        {/* ── BOTTOM CTA ── */}
        {!gated&&(
          <div style={{textAlign:"center",padding:"28px 20px",borderRadius:16,background:"linear-gradient(135deg,rgba(255,103,0,0.06),rgba(255,103,0,0.02))",border:"1px solid rgba(255,103,0,0.1)",marginBottom:24}}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>This is just {ROLES.length} of {TOTAL_OPEN} roles.</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:16}}>Imagine the full picture — every role, every score, every opportunity mapped.</div>
            <button onClick={()=>setShowGate(true)} style={{padding:"14px 30px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ff6700,#ff8c3a)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 24px rgba(255,103,0,0.3)"}}>Get the Full Report →</button>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.12)"}}>© 2026 iMocha · AI Automation Index · Confidential</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:18,height:18,borderRadius:5,background:"linear-gradient(135deg,#ff6700,#ff8c3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"#fff"}}>iM</div>
            <span style={{fontSize:9,color:"rgba(255,255,255,0.15)",fontWeight:600}}>imocha.io</span>
          </div>
        </div>
      </div>
    </div>
  );
}
