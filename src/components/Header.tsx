import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

export function Header() {
  const { isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-black/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/40 bg-black shadow-[0_0_12px_rgba(212,175,55,0.2)]">
            <img src={logoImg} alt="Último Dragão Crédito" className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-bold tracking-widest text-primary drop-shadow-md">
            ÚLTIMO DRAGÃO
          </span>
        </Link>
      </div>

      <div className="hidden md:flex md:items-center">
        <SidebarTrigger className="mr-4 text-muted-foreground hover:bg-white/5 hover:text-white" />

        {/* Responsive Logo for Desktop when sidebar is collapsed/hidden */}
        <Link
          to="/"
          className="hidden lg:hidden md:flex items-center gap-3 transition-opacity hover:opacity-80 group"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/40 bg-black shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-transform duration-300 group-hover:scale-105">
            <img src={logoImg} alt="Último Dragão Crédito" className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-bold tracking-widest text-primary drop-shadow-md">
            ÚLTIMO DRAGÃO
          </span>
        </Link>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:w-auto">
        <div className="relative w-full max-w-sm ml-auto md:ml-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isMobile ? 'Buscar...' : 'Buscar CPFs, propostas...'}
            className="w-full bg-white/5 pl-10 border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-colors sm:w-[300px]"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-white/10 hover:text-white shrink-0 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-black shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 transition-colors"
            >
              <User className="h-5 w-5 text-white/80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black/95 border-white/10 backdrop-blur-xl text-white"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">Usuário Master</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@ultimodragao.tech
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer transition-colors">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer transition-colors">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer transition-colors">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
