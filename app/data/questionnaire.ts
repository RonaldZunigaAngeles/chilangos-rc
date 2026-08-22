export type BikerQuestion = {
  id: string;
  label: string;
  prompt: string;
  type?: "short" | "select";
  options?: string[];
  required?: boolean;
};

export type BikerSection = {
  id: string;
  title: string;
  introduction: string;
  questions: BikerQuestion[];
};

export const bikerSections: BikerSection[] = [
  {
    id: "identidad",
    title: "El nombre detrás del casco",
    introduction: "Antes de la moto está la persona. Preséntate como quieres que te reconozca la banda.",
    questions: [
      { id: "alias", label: "¿Cómo te conoce la banda?", prompt: "Tu apodo, nombre de ruta o el nombre con el que quieres aparecer.", type: "short", required: true },
      { id: "tres-palabras", label: "Si tuvieras que describirte como biker en tres palabras, ¿cuáles serían?", prompt: "No pienses en cómo deberías sonar: piensa en quién eres.", type: "short" },
      { id: "origen-general", label: "¿De qué ciudad, estado o lugar sientes que viene tu historia?", prompt: "Comparte únicamente una referencia general; nunca tu domicilio.", type: "short" },
      { id: "vida-fuera-casco", label: "¿Quién eres cuando te quitas el casco?", prompt: "Cuéntanos tus pasiones, lo que valoras o esa parte de ti que casi nadie conoce." },
      { id: "momento-actual", label: "¿En qué etapa de tu vida llegó el motociclismo y qué estaba pasando contigo?", prompt: "Responde solo hasta donde te sientas cómodo." },
    ],
  },
  {
    id: "origen",
    title: "Cuando todo empezó",
    introduction: "Cada motociclista recuerda ese momento en que una moto dejó de ser un vehículo y se volvió otra cosa.",
    questions: [
      { id: "primer-recuerdo", label: "¿Cuál es el primer recuerdo que tienes relacionado con una motocicleta?", prompt: "Una imagen, un sonido, una persona o una historia de tu infancia." },
      { id: "quien-inspiro", label: "¿Quién o qué despertó tu gusto por las motos?", prompt: "No necesitas escribir nombres completos ni datos de otras personas." },
      { id: "primera-moto", label: "¿Cuál fue la primera moto que manejaste o sentiste verdaderamente tuya?", prompt: "Cuéntanos la marca, el modelo o lo que recuerdes de ella." },
      { id: "primera-rodada", label: "¿Cómo fue la primera vez que saliste a carretera?", prompt: "¿Qué sentiste antes de arrancar y qué cambió al regresar?" },
      { id: "momento-biker", label: "¿En qué momento entendiste que el motociclismo ya era parte de tu identidad?", prompt: "Esa escena en la que dijiste: esto también soy yo." },
    ],
  },
  {
    id: "maquina",
    title: "La máquina y lo que significa",
    introduction: "La moto habla de tus gustos, pero también de tus decisiones, tus sueños y tu manera de avanzar.",
    questions: [
      { id: "moto-actual", label: "¿Qué moto manejas actualmente y por qué la elegiste?", prompt: "Marca y modelo son suficientes; nunca compartas placas o número de serie." },
      { id: "nombre-moto", label: "¿Tu moto tiene nombre o una historia que la haga especial?", prompt: "Si pudiera hablar, ¿qué diría de ti?" },
      { id: "marcas-favoritas", label: "¿Qué marcas de motocicletas admiras y qué te atrae de ellas?", prompt: "Harley-Davidson, Indian, BMW, Triumph, Royal Enfield o cualquier otra." },
      { id: "moto-soñada", label: "Si pudieras elegir cualquier motocicleta, ¿cuál sería y por qué?", prompt: "No importa si está cerca, lejos o todavía parece imposible." },
      { id: "detalle-inconfundible", label: "¿Qué detalle de una moto te conquista primero?", prompt: "El sonido, la historia, el motor, las líneas, la comodidad o su personalidad." },
      { id: "personalizacion", label: "¿Cómo personalizarías tu moto para que realmente contara tu historia?", prompt: "Colores, accesorios, recuerdos, parches o modificaciones que tengan significado." },
    ],
  },
  {
    id: "carretera",
    title: "Kilómetros que dejaron huella",
    introduction: "Las rutas importan, pero lo que uno trae de regreso casi nunca cabe en una maleta.",
    questions: [
      { id: "ruta-favorita", label: "¿Cuál ha sido tu ruta favorita y qué la hizo inolvidable?", prompt: "Describe el lugar, el paisaje, la compañía o la sensación." },
      { id: "rodada-transformadora", label: "¿Qué rodada te cambió por dentro, aunque nadie más se haya dado cuenta?", prompt: "Puede ser una victoria, una despedida, una reconciliación o un momento de paz." },
      { id: "destino-pendiente", label: "¿Qué destino sueñas recorrer en moto antes de que pasen más años?", prompt: "En México o en cualquier rincón del mundo." },
      { id: "estilo-ruta", label: "¿Qué tipo de camino se parece más a ti?", prompt: "Carretera abierta, pueblos mágicos, curvas, costa, montaña o ciudad." },
      { id: "ritual-salida", label: "¿Tienes algún ritual antes de arrancar?", prompt: "Una revisión, una canción, una frase o una costumbre que te acompaña." },
      { id: "parada-perfecta", label: "¿Cómo sería la parada perfecta después de una buena rodada?", prompt: "Un paisaje, una comida, una conversación o ese lugar al que siempre regresarías." },
    ],
  },
  {
    id: "alma",
    title: "Lo que se mueve por dentro",
    introduction: "Aquí no buscamos respuestas perfectas. Buscamos lo que de verdad sucede cuando el motor se enciende.",
    questions: [
      { id: "significado-biker", label: "Para ti, ¿qué significa realmente ser biker?", prompt: "Olvida los estereotipos: define lo que significa en tu propia vida." },
      { id: "pensamientos-ruta", label: "¿Qué pensamientos aparecen cuando llevas varios kilómetros a solas con el camino?", prompt: "¿Qué conversaciones tienes contigo mismo debajo del casco?" },
      { id: "libertad", label: "¿Cómo definirías la libertad después de haber rodado?", prompt: "Tal vez cambió desde la primera vez que tomaste el manubrio." },
      { id: "miedos", label: "¿Qué miedo te ha ayudado a reconocer o enfrentar el motociclismo?", prompt: "Comparte solo lo que quieras; no necesitas contar detalles íntimos." },
      { id: "momento-dificil", label: "¿Alguna vez una rodada llegó justo cuando necesitabas recuperar algo de ti?", prompt: "Si quieres, cuenta qué te devolvió la carretera." },
      { id: "leccion-vida", label: "¿Qué te ha enseñado manejar que también aplicas fuera de la moto?", prompt: "Paciencia, atención, equilibrio, confianza, límites o algo completamente distinto." },
    ],
  },
  {
    id: "hermandad",
    title: "La banda que elegimos",
    introduction: "Chilangos no se entiende solamente por las motos. Se entiende por la gente que decide quedarse.",
    questions: [
      { id: "llegada-club", label: "¿Cómo llegaste a Chilangos RC y qué pensaste la primera vez?", prompt: "Cuéntanos la historia desde tu propia perspectiva." },
      { id: "razon-permanecer", label: "¿Qué te hizo sentir que este era un grupo al que querías pertenecer?", prompt: "Describe el momento, el gesto o la energía que te convenció." },
      { id: "recuerdo-club", label: "¿Cuál es el recuerdo con la banda que siempre te va a sacar una sonrisa?", prompt: "Evita compartir información privada de otras personas." },
      { id: "admiracion", label: "¿Qué admiras de algún integrante y qué te ha enseñado?", prompt: "Puedes mencionar únicamente su apodo y hablar desde el respeto." },
      { id: "aporte-club", label: "¿Qué crees que tú aportas a la hermandad?", prompt: "Tal vez organizas, acompañas, reparas, cuidas, escuchas o levantas el ánimo." },
      { id: "momento-hermandad", label: "¿En qué momento sentiste que la banda era más que un grupo para salir a rodar?", prompt: "Ese instante en el que apareció la palabra familia." },
      { id: "futuro-club", label: "¿Qué te gustaría que Chilangos RC nunca perdiera, aunque crezca?", prompt: "Piensa en sus valores, su forma de rodar y su esencia." },
    ],
  },
  {
    id: "seguridad",
    title: "Respeto por el camino",
    introduction: "Ser biker también es saber regresar. La experiencia se comparte mejor cuando ayuda a cuidar a alguien más.",
    questions: [
      { id: "equipo-innegociable", label: "¿Qué equipo o medida de seguridad consideras absolutamente indispensable?", prompt: "Casco, guantes, botas, chamarra, revisión mecánica o lo que nunca negocias." },
      { id: "leccion-seguridad", label: "¿Qué experiencia te enseñó a respetar más la carretera?", prompt: "No compartas ubicaciones exactas, documentos ni información de otras personas." },
      { id: "rodar-grupo", label: "¿Qué hace que una rodada en grupo sea segura y disfrutable para todos?", prompt: "Formación, comunicación, ritmo, paciencia, cero alcohol o acompañamiento." },
      { id: "consejo-principiante", label: "¿Qué le dirías a alguien que va a salir a carretera por primera vez?", prompt: "Ese consejo honesto que te hubiera gustado escuchar al empezar." },
      { id: "limite-personal", label: "¿Qué límite aprendiste a respetar aunque otros quieran seguir?", prompt: "Clima, cansancio, velocidad, presión del grupo o condiciones de la ruta." },
    ],
  },
  {
    id: "estilo",
    title: "Rituales, gustos y personalidad",
    introduction: "También somos nuestras canciones, nuestras paradas favoritas y esos pequeños detalles que nos delatan.",
    questions: [
      { id: "cancion-ruta", label: "¿Qué canción o género musical describe mejor tu manera de rodar?", prompt: "Esa rola que podría acompañar la película de tu vida biker." },
      { id: "estilo-biker", label: "¿Cómo describirías tu estilo biker sin mencionar marcas?", prompt: "Clásico, discreto, rebelde, aventurero, elegante o completamente tuyo." },
      { id: "objeto-significativo", label: "¿Hay algún parche, chamarra, accesorio o recuerdo que tenga un significado especial?", prompt: "¿Qué historia guarda y por qué lo sigues llevando contigo?" },
      { id: "plan-perfecto", label: "Describe tu domingo perfecto sobre dos ruedas.", prompt: "Desde que te despiertas hasta que vuelves a casa." },
      { id: "gusto-inesperado", label: "¿Qué gusto o rasgo tuyo sorprendería a alguien que solo te conoce con casco?", prompt: "Esa parte inesperada que también forma parte de tu historia." },
    ],
  },
  {
    id: "sueños",
    title: "Lo que todavía falta por rodar",
    introduction: "Una buena ruta no se mide solo por lo recorrido, sino por lo que todavía nos emociona imaginar.",
    questions: [
      { id: "meta-biker", label: "¿Cuál es tu mayor meta como motociclista?", prompt: "Puede ser una ruta, una habilidad, una moto o una manera de vivir." },
      { id: "viaje-soñado", label: "Si pudieras organizar una rodada inolvidable para Chilangos RC, ¿cómo sería?", prompt: "Cuéntanos el destino, la vibra y lo que te gustaría que todos recordaran." },
      { id: "proyecto-club", label: "¿Qué proyecto o tradición te gustaría construir con el club?", prompt: "Una causa, un encuentro anual, un viaje largo o una nueva forma de compartir." },
      { id: "aprendizaje-pendiente", label: "¿Qué habilidad o experiencia todavía quieres desarrollar como biker?", prompt: "Mecánica, rutas largas, liderazgo, manejo bajo lluvia o lo que tengas pendiente." },
      { id: "mensaje-yo-pasado", label: "¿Qué le dirías a la persona que eras antes de subirte a una moto?", prompt: "Háblale como si supieras todo lo que estaba por descubrir." },
    ],
  },
  {
    id: "legado",
    title: "Lo que quieres dejar en el camino",
    introduction: "Al final no se trata solo de kilómetros. Se trata de la huella que dejamos en quienes rodaron a nuestro lado.",
    questions: [
      { id: "filosofia", label: "¿Cuál es tu filosofía de vida biker?", prompt: "La idea o forma de vivir que mejor resume tu relación con la carretera." },
      { id: "frase-propia", label: "Si tu historia biker tuviera una frase, ¿cuál sería?", prompt: "Una línea corta que podríamos usar como tu sello personal.", type: "short" },
      { id: "recuerdo-futuro", label: "¿Cómo te gustaría que la banda te recordara dentro de muchos años?", prompt: "Piensa en la persona y compañero que quieres ser." },
      { id: "mensaje-banda", label: "¿Qué te gustaría decirle a Chilangos RC que normalmente no dices en voz alta?", prompt: "Agradecimientos, sueños o palabras que a veces se quedan debajo del casco." },
      { id: "pregunta-faltante", label: "¿Qué no te preguntamos y debería formar parte de tu historia?", prompt: "Este espacio es completamente tuyo." },
      {
        id: "permiso-publicacion",
        label: "¿Cómo autorizas que se utilicen tus respuestas?",
        prompt: "Tu elección prevalece sobre cualquier respuesta marcada como publicable.",
        type: "select",
        required: true,
        options: [
          "Solo para conocerme dentro de Chilangos RC; nada puede publicarse.",
          "Pueden preparar mi perfil con las respuestas que marque, pero quiero revisarlo antes.",
          "Autorizo publicar únicamente las respuestas que marqué como publicables.",
        ],
      },
    ],
  },
];

export const bikerQuestionCount = bikerSections.reduce(
  (total, section) => total + section.questions.length,
  0,
);
