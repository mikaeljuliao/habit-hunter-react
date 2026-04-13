export const xpParaSubir = (nivel) => {
  return Math.pow((nivel + 1) * 50, 1.2); // Exemplo de fórmula
};

export const calcularRank = (nivel) => {
  if (nivel < 5) return "Iniciante";
  if (nivel < 15) return "Guerreiro";
  return "Mestre dos Hábitos";
};

export const calcularProgresso = (xp, nivel) => {
  const totalNecessario = xpParaSubir(nivel);
  return (xp / totalNecessario) * 100;
};