import { Outlet } from 'react-router-dom'
import Sidebar from '../components/codeguru/Sidebar'
import TopNav from '../components/codeguru/TopNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#060807] text-neutral-100 flex flex-row">
      {/* Persistent Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-4 pb-24 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
