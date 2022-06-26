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
         <div className="h-screen overflow-y-auto py-4 px-3 bg-gray-50 rounded-r">
            <ul className="space-y-2">
               <li>
                  <SidebarButton onClick={() => router.push('/')} title="Dashboard" icon={icons.dashboard} />
               </li>
               <li>
                  <SidebarButton onClick={() => router.push('/groups')} title="Groups" icon={icons.group} />
               </li>
               <li>
                  <SidebarButton onClick={() => null} title="Inbox" icon={icons.inbox} />
               </li>
               <li>
                  <SidebarButton onClick={() => null} title="Users" icon={icons.users} />
               </li>
               <li>
                  <SidebarButton onClick={() => null} title="Products" icon={icons.products} />
               </li>
               <li>
                  <SidebarButton onClick={() => null} title="Sign In" icon={icons.login} />
               </li>
               <li>
                  <SidebarButton onClick={logout} title="Logout" icon={icons.logout} />
               </li>
            </ul>
         </div>
      </aside>
   )
}

export default Sidebar