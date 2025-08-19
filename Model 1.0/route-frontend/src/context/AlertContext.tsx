import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
type AlertType='success'|'error'|'info'|'warning';
type Alert={id:string,type:AlertType,message:string,title?:string,autoClose?:boolean,duration?:number};
type Ctx={alerts:Alert[]; showSuccess:(m:string,t?:string)=>void; showError:(m:string,t?:string)=>void; showInfo:(m:string,t?:string)=>void; remove:(id:string)=>void;};
const AlertContext=createContext<Ctx|null>(null);
export function AlertProvider({children}:{children:ReactNode}) {
const [alerts,setAlerts]=useState<Alert[]>([]);
const add=(a:Omit<Alert,'id'>)=>{ const id=Math.random().toString(36).slice(2); const alert={id,duration:5000,autoClose:true,...a}; setAlerts(x=>[...x,alert]); if(alert.autoClose) setTimeout(()=>remove(id),alert.duration); };
const showSuccess=(m:string,t?:string)=>add({type:'success',message:m,title:t});
const showError=(m:string,t?:string)=>add({type:'error',message:m,title:t,autoClose:false});
const showInfo=(m:string,t?:string)=>add({type:'info',message:m,title:t});
const remove=(id:string)=>setAlerts(x=>x.filter(a=>a.id!==id));
return <AlertContext.Provider value={{alerts,showSuccess,showError,showInfo,remove}}>{children}</AlertContext.Provider>;
}
export function useAlert(){ const c=useContext(AlertContext); if(!c) throw new Error('useAlert must be used within AlertProvider'); return c; }