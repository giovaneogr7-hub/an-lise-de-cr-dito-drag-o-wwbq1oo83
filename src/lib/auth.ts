export const useAuth = () => {
  // Mock authentication hook providing the currently authenticated user
  return {
    user: {
      id: 'user-123',
      name: 'João Silva',
      email: 'joao.silva@exemplo.com.br',
    },
  }
}
