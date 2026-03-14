import { BarChart3, LayoutDashboard, Settings, ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
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
import { cn } from '@/lib/utils'

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Análise de Crédito', url: '/analysis', icon: ShieldCheck },
  { title: 'Relatórios', url: '/reports', icon: BarChart3 },
  { title: 'Configurações', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-border/50 bg-glass">
      <SidebarHeader className="p-4 flex items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center bg-black rounded-lg border border-primary/50">
            {/* Abstract Dragon Eye / Core Logo */}
            <div className="w-4 h-4 bg-primary rounded-sm transform rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-breathing-eye" />
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-wide text-foreground">
            DRAGÃO
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-widest text-[10px] mt-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 mt-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className={cn(
                          'transition-all duration-300 rounded-lg px-3 py-2 text-sm font-medium',
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                        )}
                      >
                        <item.icon
                          className={cn('w-4 h-4', isActive ? 'text-primary' : 'opacity-70')}
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
