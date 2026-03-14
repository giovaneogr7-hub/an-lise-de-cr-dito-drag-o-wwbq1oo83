import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  iconClassName?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  className,
  iconClassName,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        'border-gold-glow bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 relative overflow-hidden',
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground font-display">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-lg bg-black/50 border border-white/5', iconClassName)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</div>
        {(description || trendValue) && (
          <div className="flex items-center mt-1 space-x-2 text-xs">
            {trendValue && (
              <span
                className={cn('font-medium', {
                  'text-emerald-400': trend === 'up',
                  'text-destructive': trend === 'down',
                  'text-muted-foreground': trend === 'neutral',
                })}
              >
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                {trendValue}
              </span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
