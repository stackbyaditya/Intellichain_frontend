import { useAlert } from '@/context/AlertContext';
export default function AlertDisplay(){
const {alerts,remove}=useAlert();
if(!alerts.length) return null;
const styles=()=>'p-3 mb-2 rounded border shadow bg-white';
return <div className="fixed top-4 right-4 z-50 w-96">{alerts.map(a=>
<div key={a.id} className={styles()}>
<div className="flex justify-between items-start">
<div>
{a.title && <div className="font-semibold mb-1">{a.title}</div>}
<div className="text-sm">{a.message}</div>
</div>
<button onClick={()=>remove(a.id)} className="text-gray-500 hover:text-black">✕</button>
</div>
</div>)}

</div>; }