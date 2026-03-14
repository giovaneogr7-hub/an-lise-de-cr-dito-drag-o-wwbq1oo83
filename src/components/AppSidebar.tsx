import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Settings, PieChart, ShieldCheck } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Análise de Crédito', icon: ShieldCheck, url: '/analysis' },
  { title: 'Relatórios', icon: PieChart, url: '/reports' },
  { title: 'Configurações', icon: Settings, url: '/settings' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar
      variant="inset"
      className="border-r border-white/5 bg-black/50 backdrop-blur-xl text-white"
    >
      <SidebarHeader className="border-b border-white/5 p-4 lg:py-5">
        <Link
          to="/"
          className="flex items-center gap-4 px-2 transition-opacity hover:opacity-80 group"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-black shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-transform duration-300 group-hover:scale-105">
            <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-widest text-primary drop-shadow-md">
              ÚLTIMO DRAGÃO
            </span>
            <span className="text-xs font-medium text-white/50">Análise Premium</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-white/40 mb-2">
            MENU PRINCIPAL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-10 px-3 transition-colors hover:bg-white/10 hover:text-white data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`h-4 w-4 ${isActive ? 'text-primary shadow-[0_0_10px_rgba(212,175,55,0.3)] rounded-full' : 'text-white/60'}`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
