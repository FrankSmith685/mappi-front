export const quitarTildesYNumeros = (texto: string): string => {
    const tildes: Record<string, string> = {
      á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u',
      Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U',
      ü: 'u', Ü: 'U'
    };
    return texto.replace(/[áéíóúÁÉÍÓÚüÜ0-9]/g, (letra) => tildes[letra] || '');
  };
  