import React from 'react'
import { icons } from '../constants/sidebarNavIcons'
import { useAuthContext } from '../context/AuthContext'
import SidebarButton from './SidebarButton'
import { useRouter } from 'next/router'

const Sidebar = () => {
   const { logout } = useAuthContext()
   const router = useRouter()
   return (
      <aside className="w-64" aria-label="Sidebar">
         <div className="fixed w-64 h-screen overflow-y-auto py-4 px-3 bg-gray-50 rounded-r">
            <ul className="space-y-2">
               <li>
                  <SidebarButton onClick={() => router.push('/')} title="Dashboard" icon={icons.dashboard} />
               </li>
               <li>
                  <SidebarButton onClick={() => router.push('/groups')} title="Groups" icon={icons.group} />
               </li>
               <li>
                  <SidebarButton onClick={() => router.push('/children')} title="Children" icon={icons.users} />
               </li>
               <li>
                  <SidebarButton onClick={() => router.push('/teachers')} title="Teachers" icon={icons.users} />
               </li>
               <li>
                  <SidebarButton onClick={() => router.push('/guardians')} title="Guardians" icon={icons.products} />
               </li>
               <li>
                  <SidebarButton onClick={() => null} title="Sign In" icon={icons.login} />
               </li>
               <li>
                  <SidebarButton onClick={logout} title="Logout" icon={icons.logout} />
               </li>
            </ul>
         </div>
         <div className="w-64" />
      </aside>
   )
}

export default Sidebar