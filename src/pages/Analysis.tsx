import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Analysis() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">Análise de Crédito</h1>
      <Card className="border-gold-glow bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Módulo em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O fluxo detalhado de esteira de aprovação será implementado aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
