export const reemplazarVariosTextos = (texto: string, reemplazos: Record<string, string>): string => {
    if (!texto || !reemplazos) return texto;
  
    Object.entries(reemplazos).forEach(([textoABuscar, textoDeReemplazo]) => {
      texto = texto.split(textoABuscar).join(textoDeReemplazo);
    });
  
    return texto;
  };
  