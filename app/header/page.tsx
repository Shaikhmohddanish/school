import { useRouter } from "next/navigation"
import UserMenu from "../components/UserMenu"
import { BaseUser } from "@/types/user"

interface HeaderProps {
  user: BaseUser | null;
  handleLogout: () => void;
}

export default function Header({ user, handleLogout }: HeaderProps) { 
    return (
        <header className="bg-white shadow">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-6">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  </div>
        
                  <div className="flex items-center space-x-4">
                    <span className="hidden sm:block text-gray-700">
                      Welcome, {user?.name || user?.email}!
                    </span>
        
                    <UserMenu user={user} handleLogout={handleLogout} />
                  </div>
                </div>
              </div>
            </header>
    )
}