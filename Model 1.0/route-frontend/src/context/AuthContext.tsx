import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
export type Role = 'admin'|'owner'|'driver'|'operator'|'manager'|'customer'|null;
type Ctx = { userRole: Role; setUserRole:(r:Role)=>void; login:(r:Role)=>void; logout:()=>void; isAuthenticated: boolean; };
const AuthContext = createContext<Ctx|null>(null);
export function AuthProvider({children}:{children:ReactNode}) {
const [userRole,setUserRole]=useState<Role>(() => {
    try {
      const storedRole = localStorage.getItem('userRole');
      return storedRole ? (storedRole as Role) : null;
    } catch (error) {
      console.error('Failed to read user role from localStorage:', error);
      return null;
    }
  });

useEffect(() => {
    try {
      if (userRole) {
        localStorage.setItem('userRole', userRole);
      } else {
        localStorage.removeItem('userRole');
      }
    } catch (error) {
      console.error('Failed to write user role to localStorage:', error);
    }
  }, [userRole]);

const login=(r:Role)=>setUserRole(r);
const logout=()=>setUserRole(null);
const isAuthenticated = userRole !== null;
return <AuthContext.Provider value={{userRole,setUserRole,login,logout, isAuthenticated}}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const c=useContext(AuthContext); if(!c) throw new Error('useAuth must be used within AuthProvider'); return c; }