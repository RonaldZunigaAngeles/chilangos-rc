export type ChilangoAward = {
  title: string;
  year: number;
  note?: string | null;
};

export const chilangoAwardCategories = [
  { title: "El Rodador", description: "Siempre listo, sin importar el destino." },
  { title: "El Fashion Biker", description: "Impecable de pies a cabeza." },
  { title: "El Chambitas", description: "El que siempre resuelve cualquier desperfecto." },
  { title: "El Cositas", description: "Trae herramientas, snacks y lo que haga falta." },
  { title: "El Tragón", description: "La mejor ruta siempre termina donde se come rico." },
  { title: "El Dormilón", description: "Cinco minutitos más… y ya voy para allá." },
];
