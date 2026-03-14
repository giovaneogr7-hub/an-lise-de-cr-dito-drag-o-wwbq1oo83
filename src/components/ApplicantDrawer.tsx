import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { CreditApplication, formatCurrency } from '@/lib/mock-data'
import { Calendar, CircleDollarSign, TrendingUp } from 'lucide-react'

interface ApplicantDrawerProps {
  applicant: CreditApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicantDrawer({ applicant, open, onOpenChange }: ApplicantDrawerProps) {
  if (!applicant) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-primary/20 bg-background/95 backdrop-blur-xl overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10">
              {applicant.id}
            </Badge>
            <Badge
              variant="secondary"
              className={`
                ${applicant.status === 'Pendente' ? 'bg-accent/20 text-accent border-accent/20' : ''}
                ${applicant.status === 'Em Revisão' ? 'bg-primary/20 text-primary border-primary/20' : ''}
                ${applicant.status === 'Urgente' ? 'bg-destructive/20 text-destructive border-destructive/20 animate-pulse' : ''}
                ${applicant.status === 'Aprovado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : ''}
              `}
            >
              {applicant.status}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-display mt-4">{applicant.name}</SheetTitle>
          <SheetDescription className="text-base font-mono">CPF: {applicant.cpf}</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 p-4 rounded-xl bg-card border border-white/5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CircleDollarSign className="w-3 h-3" /> Valor Solicitado
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(applicant.amount)}
              </p>
            </div>
            <div className="space-y-1 p-4 rounded-xl bg-card border border-white/5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Score de Crédito
              </p>
              <p className="text-xl font-bold text-electric-blue">{applicant.score}</p>
            </div>
            <div className="col-span-2 space-y-1 p-4 rounded-xl bg-card border border-white/5">
              <p className="text-xs text-muted-foreground">Renda Comprovada</p>
              <p className="text-lg font-semibold">{formatCurrency(applicant.income)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Histórico
            </h4>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
              {applicant.history.map((event, i) => (
                <div
                  key={i}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-background bg-primary text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg bg-card/50 border border-border/50 text-sm">
                    <p className="text-muted-foreground text-xs mb-1">{event.date}</p>
                    <p className="text-foreground">{event.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
