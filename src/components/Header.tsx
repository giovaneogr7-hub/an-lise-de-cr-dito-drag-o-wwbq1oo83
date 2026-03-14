import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />

      <div className="flex flex-1 items-center gap-4 justify-between">
        <div className="flex-1 sm:max-w-md relative group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input
            type="search"
            placeholder="Buscar por CPF ou Nome..."
            className="w-full bg-black/50 border-border pl-9 focus-visible:ring-accent transition-all duration-300 placeholder:text-muted-foreground/50 rounded-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-primary rounded-full"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.6)]" />
          </Button>

          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border/50">
            <div className="text-right">
              <p className="text-sm font-medium leading-none">Analista Chefe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=12"
                alt="Avatar"
              />
              <AvatarFallback className="bg-primary/10 text-primary">AC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
