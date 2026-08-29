export type MaintenanceTip = {
  id: "tires" | "oil" | "spark" | "brakes" | "battery" | "lights" | "drive" | "service";
  title: string;
  timing: string;
  summary: string;
  checks: string[];
  source: string;
};

export const harleySources = {
  maintenance: "https://www.harley-davidson.com/us/en/content/expert-advice/6-motorcycle-maintenance-essentials.html",
  oil: "https://www.harley-davidson.com/us/en/content/expert-advice/motorcycle-oil-basics.html",
  sparkPlugs: "https://www.harley-davidson.com/us/en/content/expert-advice/motorcycle-spark-plug-wire-faqs.html",
  tires: "https://www.harley-davidson.com/us/en/content/expert-advice/when-to-replace-motorcycle-tire.html",
  manuals: "https://serviceinfo.harley-davidson.com/",
  service: "https://www.harley-davidson.com/us/en/content/motorcycle-maintenance/authorized-service.html",
};

export const maintenanceTips: MaintenanceTip[] = [
  {
    id: "tires",
    title: "Llantas y presión",
    timing: "Antes de cada salida",
    summary: "Mide la presión en frío con un calibrador y usa la cifra indicada para tu modelo, año y carga; no la que aparece como límite en el costado de la llanta.",
    checks: ["Busca cortes, objetos, grietas, bultos y desgaste irregular.", "Reemplaza antes de llegar a las barras de desgaste; revisa también la fecha de fabricación."],
    source: harleySources.maintenance,
  },
  {
    id: "oil",
    title: "Aceite y filtro",
    timing: "1,000 mi iniciales · después cada 5,000 mi",
    summary: "Harley-Davidson señala SAE 20W-50 como el grado que cubre el rango de temperatura más amplio. El manual de tu moto define el tipo, la capacidad y el procedimiento exactos.",
    checks: ["Revisa nivel y fugas antes de rodar.", "Acorta el intervalo con uso intenso, polvo, frío o almacenamiento prolongado."],
    source: harleySources.oil,
  },
  {
    id: "spark",
    title: "Bujías y cables",
    timing: "Según motor, año y manual",
    summary: "No todas las Harley usan la misma bujía, separación ni torque. Consulta el manual y revisa cables, botas y terminales antes de reemplazar piezas.",
    checks: ["Busca grietas, quemaduras, corrosión o marcha irregular.", "En motores Milwaukee-Eight, H-D indica dos años o 30,000 mi; no apliques ese intervalo a otros motores."],
    source: harleySources.sparkPlugs,
  },
  {
    id: "brakes",
    title: "Frenos",
    timing: "Inspección cada 2,500 mi",
    summary: "Comprueba pastillas, discos, tacto de manetas y pedal, nivel de líquido y cualquier fuga. En condiciones adversas, Harley-Davidson recomienda revisar con mayor frecuencia.",
    checks: ["Con lluvia, polvo o uso intenso, la inspección puede ser cada 1,000 mi o menos.", "Si cambia el tacto o aparece ruido anormal, no salgas sin una revisión profesional."],
    source: harleySources.maintenance,
  },
  {
    id: "battery",
    title: "Batería",
    timing: "Revisión frecuente y durante almacenamiento",
    summary: "Mantén la batería cargada, limpia y seca. Un mantenedor adecuado ayuda cuando la moto pasa tiempo sin usarse.",
    checks: ["Busca corrosión, conexiones flojas, daño o fugas.", "Confirma en el manual el cargador y procedimiento compatibles con tu batería."],
    source: harleySources.maintenance,
  },
  {
    id: "lights",
    title: "Luces y controles",
    timing: "Antes de cada salida",
    summary: "Haz una revisión T-CLOCS: acelerador, clutch, frenos, dirección, espejos, faro, direccionales, luz trasera y claxon.",
    checks: ["El cableado no debe rozar, pellizcarse ni limitar el giro del manubrio.", "Pide a otra persona que confirme la luz de freno."],
    source: harleySources.maintenance,
  },
  {
    id: "drive",
    title: "Correa, chasis y suspensión",
    timing: "Antes de cada salida y en servicio",
    summary: "Revisa tensión y estado de la correa o cadena, fijaciones, cuadro, dirección, suspensión y pata lateral.",
    checks: ["Ajusta la suspensión a la carga de pasajero y equipaje conforme al manual.", "No improvises tensiones ni torques: usa la especificación exacta de tu motocicleta."],
    source: harleySources.maintenance,
  },
  {
    id: "service",
    title: "Manual y servicio",
    timing: "El calendario de tu moto manda",
    summary: "Año, modelo, motor, kilometraje, tiempo y condiciones de uso cambian el mantenimiento. El manual del propietario es la referencia principal.",
    checks: ["Registra fecha, kilometraje y trabajo realizado.", "Una falla de seguridad requiere diagnóstico de un técnico calificado antes de volver a rodar."],
    source: harleySources.manuals,
  },
];
