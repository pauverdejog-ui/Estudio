/* Temario por defecto y fechas iniciales.
   Cada asignatura: temas = [ [título, [puntos...]], ... ]
   Al primer arranque se copia al almacenamiento local y desde la app se puede editar. */

const DATA_VERSION = 1;

const DEFAULT_SUBJECTS = [
  /* ───────────── UNED · 2º curso, 1er cuatrimestre ───────────── */
  {
    id: "ff3", uni: "UNED", code: "61042018", short: "FF III",
    name: "Fundamentos de Física III", color: "#2f6fdb",
    note: "Tipler-Mosca, Física Moderna. El tema 9 se evalúa solo por PEC.",
    temas: [
      ["Dualidad onda-partícula y física cuántica", [
        "Radiación del cuerpo negro y ley de Planck",
        "Ley de Stefan-Boltzmann y ley de desplazamiento de Wien",
        "Efecto fotoeléctrico y ecuación de Einstein",
        "El fotón: energía y momento",
        "Dispersión de Compton",
        "Hipótesis de De Broglie y longitud de onda",
        "Difracción de electrones y de partículas",
        "Cuantización del momento cinético y niveles del hidrógeno",
        "Función de onda y su interpretación probabilística",
        "Partícula en una caja: cuantización de la energía",
        "Valores esperados",
        "Principio de indeterminación y sus consecuencias"
      ]],
      ["Aplicaciones de la ecuación de Schrödinger", [
        "Ecuación de Schrödinger dependiente e independiente del tiempo",
        "Pozo de potencial infinito",
        "Pozo de potencial finito",
        "Valores esperados y operadores",
        "Oscilador armónico cuántico",
        "Reflexión y transmisión de ondas electrónicas (escalón)",
        "Efecto túnel y barrera de potencial",
        "Ecuación de Schrödinger en tres dimensiones",
        "Comparación de resultados cuánticos y clásicos"
      ]],
      ["Átomos", [
        "Espectros atómicos de emisión y absorción",
        "Modelo de Bohr y espectro del hidrógeno",
        "Teoría cuántica de los átomos",
        "Ecuación de Schrödinger para el átomo de hidrógeno",
        "Números cuánticos n, l, mₗ, mₛ",
        "Funciones de onda del hidrógeno",
        "Espín y acoplamiento espín-órbita",
        "Estructura fina de las líneas espectrales",
        "Principio de exclusión de Pauli y tabla periódica",
        "Espectros ópticos y espectros de rayos X"
      ]],
      ["Moléculas", [
        "Enlace iónico",
        "Enlace covalente",
        "Otros enlaces: van der Waals, hidrógeno, metálico",
        "Moléculas biatómicas y poliatómicas",
        "Niveles de energía y energía interna molecular",
        "Espectros moleculares: rotación y vibración"
      ]],
      ["Sólidos", [
        "Estructura de los sólidos",
        "Energía potencial y estructura de un sólido",
        "Modelo microscópico clásico de la conducción eléctrica",
        "Gas de electrones de Fermi",
        "Teoría cuántica de la conducción",
        "Teoría de bandas",
        "Semiconductores y dopado",
        "Superconductividad"
      ]],
      ["Relatividad especial", [
        "Relatividad newtoniana, éter y experimento de Michelson-Morley",
        "Medida de la velocidad de la luz",
        "Postulados de Einstein",
        "Transformación de Lorentz y su inversa",
        "Dilatación del tiempo",
        "Contracción de longitudes",
        "Efecto Doppler relativista",
        "Simultaneidad y sincronización de relojes",
        "Paradoja de los gemelos",
        "Transformación relativista de velocidades",
        "Momento lineal relativista y su conservación",
        "Energía relativista, energía en reposo y E = mc²",
        "Colisiones de partículas a gran velocidad",
        "Principio de equivalencia (relatividad general)"
      ]],
      ["Física nuclear", [
        "Composición del núcleo: tamaño, forma y densidad",
        "Defecto de masa y energía de enlace",
        "Curva de energía de enlace por nucleón y estabilidad",
        "Radiactividad y ley de desintegración",
        "Desintegraciones α, β y γ",
        "Reacciones nucleares: valor Q, exotérmicas y endotérmicas",
        "Fisión nuclear",
        "Reactores nucleares",
        "Fusión nuclear"
      ]],
      ["Partículas elementales", [
        "Interacciones fundamentales",
        "Hadrones y leptones",
        "Partículas y antipartículas",
        "Leyes de conservación",
        "Números cuánticos: bariónico, leptónico, extrañeza",
        "Quarks",
        "Modelo estándar",
        "Aplicar conservación a reacciones entre partículas"
      ]],
      ["Astrofísica y cosmología (PEC)", [
        "Tipos de estrellas y diagrama H-R",
        "Generación de energía en las estrellas",
        "Evolución estelar y muerte de estrellas masivas",
        "Galaxias, cúmulos y cuásares",
        "Agujeros negros supermasivos",
        "Materia visible y materia oscura",
        "Escala de distancias cosmológica",
        "Ley de Hubble y expansión del universo",
        "Big Bang y radiación cósmica de fondo",
        "Energía oscura y destino del universo"
      ]]
    ]
  },
  {
    id: "mm2", uni: "UNED", code: "61042024", short: "MM II",
    name: "Métodos Matemáticos II", color: "#7a4bd1",
    note: "Hay que aprobar cada parte por separado (A: temas 1-3, B: 4-6, C: 7-12).",
    temas: [
      ["Ecuaciones diferenciales no lineales: primer contacto", [
        "Sistemas autónomos de orden dos",
        "Plano de fases y trayectorias",
        "Puntos críticos",
        "Ejemplos: péndulo, Lotka-Volterra"
      ]],
      ["Estabilidad lineal de puntos críticos", [
        "Sistemas lineales autónomos y su mapa fásico",
        "Clasificación: nodo, silla, foco, centro",
        "Estabilidad y estabilidad asintótica",
        "Linealización de sistemas no lineales",
        "Sistemas conservativos",
        "Método directo de Lyapunov",
        "Ciclos límite y soluciones periódicas"
      ]],
      ["Bifurcaciones locales de codimensión 1", [
        "Concepto de bifurcación",
        "Bifurcación silla-nodo",
        "Bifurcación transcrítica",
        "Bifurcación de tridente (pitchfork)",
        "Bifurcación de Hopf"
      ]],
      ["Integración en el campo complejo", [
        "Curvas y parametrización",
        "Integrales de contorno",
        "Primitivas y teorema fundamental",
        "Teorema de Cauchy-Goursat",
        "Dominios simple y múltiplemente conexos",
        "Fórmula integral de Cauchy y derivadas",
        "Teorema de Liouville y del módulo máximo"
      ]],
      ["Sucesiones y series complejas", [
        "Convergencia de sucesiones y series",
        "Series de potencias y radio de convergencia",
        "Series de Taylor",
        "Series de Laurent",
        "Convergencia uniforme e integración/derivación término a término",
        "Ceros de funciones analíticas"
      ]],
      ["Residuos y polos: aplicaciones", [
        "Singularidades aisladas: evitables, polos, esenciales",
        "Residuos y cálculo en polos",
        "Teorema de los residuos",
        "Integrales trigonométricas",
        "Integrales impropias reales",
        "Lema de Jordan e integrales de Fourier",
        "Contornos con indentación y puntos de ramificación"
      ]],
      ["Espacios vectoriales", [
        "Espacios de dimensión infinita",
        "Subespacios, independencia lineal y bases",
        "Aplicaciones lineales"
      ]],
      ["Espacios métricos", [
        "Métrica y ejemplos (ℓᵖ, C[a,b])",
        "Bolas, abiertos, cerrados y topología",
        "Sucesiones convergentes y de Cauchy",
        "Completitud",
        "Continuidad entre espacios métricos"
      ]],
      ["Espacios normados", [
        "Norma y métrica inducida",
        "Espacios de Banach",
        "Espacios de dimensión finita",
        "Operadores lineales acotados",
        "Funcionales lineales y espacio dual"
      ]],
      ["Espacios de Hilbert", [
        "Producto escalar y espacios pre-Hilbert",
        "Espacios de Hilbert",
        "Ortogonalidad y teorema de la proyección",
        "Conjuntos ortonormales, desigualdad de Bessel e igualdad de Parseval",
        "Bases ortonormales",
        "Series trigonométricas de Fourier",
        "Transformada de Fourier",
        "Polinomios ortogonales (Legendre, Hermite, Laguerre)",
        "Teorema de representación de Riesz"
      ]],
      ["Operadores en espacios normados", [
        "Operadores continuos y acotados",
        "Operador adjunto",
        "Operadores autoadjuntos (hermíticos)",
        "Operadores unitarios y normales",
        "Operadores compactos"
      ]],
      ["Introducción a la teoría espectral", [
        "Resolvente y espectro",
        "Espectro puntual, continuo y residual",
        "Propiedades espectrales de operadores acotados",
        "Teoría espectral de operadores compactos",
        "Descomposición espectral de autoadjuntos acotados"
      ]]
    ]
  },
  {
    id: "mec", uni: "UNED", code: "61042107", short: "Mecánica",
    name: "Mecánica", color: "#0f8b6c",
    note: "Español, Serrano, Zúñiga: Mecánica Clásica. PEC1 temas 1-4, PEC2 temas 5-7.",
    temas: [
      ["Cinemática", [
        "Sistemas de referencia y coordenadas",
        "Posición, velocidad y aceleración",
        "Componentes intrínsecas",
        "Sistemas en reposo relativo",
        "Sistemas en movimiento relativo: traslación",
        "Sistemas en rotación y velocidad angular",
        "Transformación de velocidades y aceleraciones (Coriolis, centrípeta)"
      ]],
      ["La dinámica de Newton", [
        "Leyes de Newton y sistemas inerciales",
        "Transformaciones de Galileo",
        "Fuerzas de inercia en sistemas no inerciales",
        "Dinámica respecto a la Tierra: gravedad efectiva y Coriolis",
        "Péndulo de Foucault y desviación en caída libre",
        "Trabajo, energía cinética y fuerzas conservativas"
      ]],
      ["Geometría de los sistemas de partículas", [
        "Centro de masas",
        "Tensor de inercia: momentos y productos",
        "Teorema de Steiner",
        "Ejes principales y diagonalización del tensor",
        "Elipsoide de inercia"
      ]],
      ["Dinámica de sistemas de partículas", [
        "Momento lineal y su conservación",
        "Momento angular y su conservación",
        "Energía de un sistema de partículas y teorema de König",
        "Sistemas de masa variable",
        "Colisiones"
      ]],
      ["El sólido rígido", [
        "Grados de libertad del sólido rígido",
        "Momento angular y tensor de inercia",
        "Energía cinética de rotación",
        "Ecuaciones de Euler",
        "Rotación libre y estabilidad en ejes principales",
        "Ángulos de Euler",
        "Peonza simétrica"
      ]],
      ["Gravitación y fuerzas centrales", [
        "Ley de gravitación y potencial gravitatorio",
        "Problema de dos cuerpos y masa reducida",
        "Conservación del momento angular y de la energía",
        "Potencial efectivo",
        "Ecuación de la órbita",
        "Órbitas cónicas",
        "Leyes de Kepler"
      ]],
      ["Mecánica analítica", [
        "Ligaduras y coordenadas generalizadas",
        "Principio de los trabajos virtuales y de D'Alembert",
        "Principio de Hamilton",
        "Ecuaciones de Euler-Lagrange",
        "Coordenadas cíclicas y cantidades conservadas",
        "Simetrías y leyes de conservación",
        "Hamiltoniano y ecuaciones de Hamilton"
      ]]
    ]
  },
  {
    id: "em1", uni: "UNED", code: "61042030", short: "EM I",
    name: "Electromagnetismo I", color: "#d1452f",
    note: "Victoriano López Rodríguez, Electromagnetismo I. Puntos tomados de los descriptores de la guía.",
    temas: [
      ["Campo eléctrico", [
        "Carga eléctrica",
        "Ley de Coulomb",
        "Campo eléctrico",
        "Principio de superposición",
        "Circulación del campo y rotacional",
        "Potencial electrostático y gradiente",
        "Potencial de un conjunto de cargas",
        "Conductores",
        "Teorema de Gauss y aplicaciones"
      ]],
      ["Dipolos y multipolos", [
        "Dipolo eléctrico: campo y potencial",
        "Potencial de una distribución de carga",
        "Momentos multipolares"
      ]],
      ["Dieléctricos", [
        "Polarización eléctrica",
        "Campo y potencial de un material polarizado",
        "Vector desplazamiento",
        "Susceptibilidad y permitividad",
        "Clases de dieléctricos",
        "Ruptura dieléctrica",
        "Condiciones en los límites"
      ]],
      ["Sistemas de conductores", [
        "Características de un conductor",
        "Sistemas de conductores",
        "Coeficientes de potencial",
        "Coeficientes de capacidad e influencia",
        "Condensadores",
        "Asociación de condensadores"
      ]],
      ["Energía electrostática", [
        "Energía de un sistema de cargas puntuales",
        "Energía de una distribución continua",
        "Energía de un sistema de conductores",
        "Energía en función de los vectores de campo",
        "Fuerza electrostática",
        "Presión electrostática"
      ]],
      ["Problemas electrostáticos: Laplace y Poisson", [
        "Ecuaciones de Laplace y Poisson",
        "Teorema de unicidad",
        "Método de imágenes",
        "Separación de variables en cartesianas",
        "Problemas unidimensionales en cilíndricas y esféricas",
        "Métodos numéricos"
      ]],
      ["Corriente eléctrica", [
        "Corriente y densidad de corriente",
        "Ecuación de continuidad y primera ley de Kirchhoff",
        "Ley de Ohm y resistencia",
        "Ley de Joule",
        "Condiciones en los límites",
        "Resistencia y capacidad",
        "Tiempo de relajación",
        "Fuerza electromotriz"
      ]],
      ["Campo magnético", [
        "Experimento de Oersted",
        "Ley de Biot y Savart",
        "Campo de una carga en movimiento",
        "Ley de Ampère",
        "Fuerza de Lorentz",
        "Fuerza sobre una corriente",
        "Flujo de B: forma integral y diferencial",
        "Teorema de la circulación: forma integral y diferencial",
        "Potencial vector magnético",
        "Condiciones en los límites"
      ]]
    ]
  },
  {
    id: "fc2", uni: "UNED", code: "61042047", short: "FC II",
    name: "Física Computacional II", color: "#c47f00",
    note: "Burden y Faires, Análisis Numérico. PEC: 4 de las 6 propuestas.",
    temas: [
      ["Resolución de ecuaciones no lineales", [
        "Método de bisección",
        "Iteración de punto fijo",
        "Método de Newton",
        "Secante y regula falsi",
        "Análisis de error y orden de convergencia",
        "Aceleración: Aitken Δ² y Steffensen",
        "Ceros de polinomios: Horner y Müller",
        "Sistemas no lineales: Newton multivariable"
      ]],
      ["Solución de conjuntos de ecuaciones", [
        "Eliminación gaussiana",
        "Estrategias de pivoteo",
        "Factorización LU",
        "Matrices especiales: diagonal dominante, definidas positivas, Cholesky, tridiagonales",
        "Normas vectoriales y matriciales",
        "Métodos iterativos de Jacobi y Gauss-Seidel",
        "Relajación (SOR)",
        "Cotas de error y número de condición",
        "Valores propios: Gerschgorin y método de la potencia"
      ]],
      ["Interpolación y ajuste de curvas", [
        "Polinomio de Lagrange y error",
        "Algoritmo de Neville",
        "Diferencias divididas de Newton",
        "Interpolación de Hermite",
        "Splines cúbicos",
        "Curvas paramétricas (Bézier)"
      ]],
      ["Aproximación de funciones", [
        "Mínimos cuadrados discretos",
        "Polinomios ortogonales y mínimos cuadrados continuos",
        "Polinomios de Chebyshev",
        "Aproximación racional (Padé)",
        "Polinomios trigonométricos",
        "Transformada rápida de Fourier"
      ]],
      ["Derivación e integración numéricas", [
        "Derivación numérica: fórmulas de 3 y 5 puntos",
        "Extrapolación de Richardson",
        "Fórmulas de Newton-Cotes: trapecio y Simpson",
        "Integración compuesta",
        "Integración de Romberg",
        "Cuadratura adaptativa",
        "Cuadratura gaussiana",
        "Integrales múltiples",
        "Integrales impropias"
      ]],
      ["Ecuaciones diferenciales ordinarias", [
        "Teoría de problemas de valor inicial (Lipschitz, bien planteado)",
        "Método de Euler",
        "Métodos de Taylor de orden superior",
        "Métodos de Runge-Kutta",
        "Control de error: Runge-Kutta-Fehlberg",
        "Métodos multipaso: Adams-Bashforth y Adams-Moulton",
        "Predictor-corrector",
        "Sistemas y ecuaciones de orden superior",
        "Estabilidad",
        "Ecuaciones rígidas (stiff)"
      ]]
    ]
  },
  /* ───────────── UNED · 3er curso ───────────── */
  {
    id: "td1", uni: "UNED", code: "61043029", short: "Termo I",
    name: "Termodinámica I", color: "#b0337a",
    note: "Reif (Física Estadística) y Castillo-García Ybarra, capítulos 1-4.",
    temas: [
      ["Sistemas termodinámicos", [
        "Niveles macroscópico y microscópico",
        "Fluctuaciones en el equilibrio",
        "Irreversibilidad y tendencia al equilibrio",
        "Propiedades del estado de equilibrio",
        "Calor y temperatura",
        "Modelos: gas ideal, esferas duras, sistema de espines",
        "Magnitudes típicas"
      ]],
      ["Variables aleatorias y distribución binómica", [
        "Conjuntos estadísticos",
        "Relaciones elementales entre probabilidades",
        "Distribución binómica",
        "Valores medios y dispersión",
        "Valores medios en un sistema de espines",
        "Distribuciones de probabilidad continuas",
        "Movimiento browniano y paseo aleatorio"
      ]],
      ["Estados accesibles. Primer y segundo principio", [
        "Especificación del estado de un sistema",
        "Postulados estadísticos",
        "Cálculo de probabilidades",
        "Número de estados accesibles",
        "Ligaduras, equilibrio e irreversibilidad",
        "Interacción entre sistemas macroscópicos",
        "Calor y trabajo",
        "Primer principio y energía interna",
        "Procesos cuasiestáticos y reversibles",
        "Entropía y segundo principio"
      ]],
      ["Niveles energéticos discretos. Interacción térmica", [
        "Distribución de energía entre sistemas",
        "Aproximación al equilibrio térmico",
        "Temperatura absoluta",
        "Pequeña transferencia de calor",
        "Sistema en contacto con un foco térmico",
        "Distribución canónica de Boltzmann",
        "Paramagnetismo",
        "Energía media de un gas ideal",
        "Presión media de un gas ideal",
        "Variación de entropía en sistemas discretos"
      ]]
    ]
  },
  /* ───────────── LiU ───────────── */
  {
    id: "tsbb19", uni: "LiU", code: "TSBB19", short: "TSBB19",
    name: "Machine Learning for Computer Vision", color: "#0d7fa3",
    note: "Lecture plan HT2026. TEN1 covers the theory (goals 1-3).",
    temas: [
      ["Introduction", [
        "Common computer vision tasks",
        "Recognition, detection, segmentation, tracking",
        "Human object recognition and categorisation"
      ]],
      ["Feature descriptors", [
        "Invariant local features",
        "Interest points and canonical frames",
        "Descriptor construction (SIFT-like)",
        "Bag-of-features framework",
        "Shape descriptors and matching"
      ]],
      ["CNNs: introduction and theory", [
        "Neurons, layers and activation functions",
        "Convolution and pooling layers",
        "Loss functions",
        "Backpropagation and SGD",
        "Regularisation: weight decay, dropout, augmentation"
      ]],
      ["Image classification with CNNs", [
        "Classic architectures (AlexNet, VGG, ResNet)",
        "Batch normalisation and residual connections",
        "Transfer learning and fine-tuning",
        "Support vector machines"
      ]],
      ["Compound descriptors, metric learning, evaluation", [
        "Compound descriptors and deep features",
        "Metric learning (contrastive, triplet loss)",
        "Precision-recall and ROC curves",
        "Evaluation protocols and confusion matrices"
      ]],
      ["Visual object detection", [
        "Sliding windows and part-based models",
        "Two-stage detectors (R-CNN family)",
        "One-stage detectors (YOLO, SSD)",
        "Anchors, NMS and IoU",
        "The role of context",
        "Detection metrics (mAP)"
      ]],
      ["Semantic and panoptic segmentation", [
        "Fully convolutional networks",
        "Encoder-decoder (U-Net) and upsampling",
        "Dilated convolutions and multi-scale context",
        "Instance and panoptic segmentation",
        "Segmentation metrics (IoU, mIoU)"
      ]],
      ["Visual object tracking with deep features", [
        "Tracking problem formulation",
        "Discriminative correlation filters",
        "Siamese trackers",
        "Tracking by detection",
        "Tracking evaluation"
      ]],
      ["Projects", [
        "Project 1: visual object recognition",
        "Project 2: semantic segmentation",
        "Seminar 2 and exam discussion"
      ]]
    ]
  },
  {
    id: "tsks15", uni: "LiU", code: "TSKS15", short: "TSKS15",
    name: "Detection and Estimation of Signals", color: "#4b5bd6",
    note: "Kay vol. I (estimation) and vol. II (detection). Lecture plan HT2026.",
    temas: [
      ["L1 · Detection theory basics", [
        "Model-based vs data-driven inference",
        "Neyman-Pearson theorem",
        "Probability of detection and false alarm",
        "ROC curves",
        "Bayesian cost and probability of error"
      ]],
      ["L2 · Deterministic signals", [
        "Deterministic vector signals in white Gaussian noise",
        "Coloured noise and pre-whitening",
        "Matched filter"
      ]],
      ["L3 · Random signals", [
        "Random Gaussian signals in Gaussian noise",
        "Optimal detector (estimator-correlator)",
        "Detector performance",
        "Special cases and examples"
      ]],
      ["L4 · Multiple hypotheses", [
        "Orthodox vs Bayesian approach",
        "M-ary hypothesis testing",
        "M-ary deterministic signals in WGN"
      ]],
      ["L5 · Estimation basics and CRB", [
        "Orthodox vs Bayesian estimation",
        "Bias, variance, MSE and BMSE",
        "Cramér-Rao bound (scalar)",
        "Efficiency"
      ]],
      ["L6 · Vector CRB", [
        "CRB for vector parameters",
        "Slepian-Bangs formula",
        "Nuisance parameters and decoupling",
        "Source localisation with time of arrival",
        "CRB for the linear Gaussian model"
      ]],
      ["L7 · Linear models", [
        "MVU estimator for the linear Gaussian model",
        "BLUE for arbitrary noise",
        "Tapped-delay line identification",
        "Two-tone sinusoidal model"
      ]],
      ["L8 · Maximum likelihood", [
        "ML estimation",
        "Asymptotic efficiency",
        "Invariance under parameter transformations"
      ]],
      ["L9 · Least squares", [
        "Linear least squares",
        "Non-linear least squares",
        "Separable models",
        "Method of moments",
        "First-order approximations"
      ]],
      ["L10 · Bayesian estimation", [
        "Prior, posterior and Bayesian risk",
        "MMSE estimator",
        "LMMSE estimator",
        "Nuisance parameters in both paradigms"
      ]],
      ["L11 · GLRT", [
        "Detection with unknown parameters",
        "Generalised likelihood ratio test",
        "GLRT for linear Gaussian models",
        "GLRT performance"
      ]],
      ["L12 · GLRT extensions", [
        "GLRT for separable models",
        "Unknown noise statistics",
        "Summary and outlook"
      ]],
      ["Applications and labs", [
        "Amplitude and phase estimation",
        "Frequency estimation",
        "Time-delay and angle-of-arrival estimation",
        "Coherent and non-coherent detection",
        "Lab 1",
        "Lab 2"
      ]]
    ]
  },
  {
    id: "tams17", uni: "LiU", code: "TAMS17", short: "TAMS17",
    name: "Statistical Theory, Advanced Course", color: "#3b8f2e",
    note: "Casella and Berger, Statistical Inference.",
    temas: [
      ["Families of distributions", [
        "Exponential families",
        "Natural parameters and curved families",
        "Location and scale families"
      ]],
      ["Data reduction", [
        "Sufficient statistics and factorisation theorem",
        "Minimal sufficient statistics",
        "Ancillary statistics",
        "Complete statistics and Basu's theorem",
        "Likelihood principle"
      ]],
      ["Point estimation methods", [
        "Method of moments",
        "Maximum likelihood estimators",
        "Invariance of the MLE",
        "Bayes estimators",
        "EM algorithm"
      ]],
      ["Evaluating point estimators", [
        "Mean squared error and bias",
        "Best unbiased estimators",
        "Cramér-Rao inequality",
        "Rao-Blackwell theorem",
        "Lehmann-Scheffé and UMVUE",
        "Loss function optimality"
      ]],
      ["Hypothesis testing", [
        "Likelihood ratio tests",
        "Bayesian tests",
        "Union-intersection and intersection-union tests",
        "Error probabilities and power function",
        "Neyman-Pearson lemma",
        "Uniformly most powerful tests and monotone likelihood ratio",
        "p-values"
      ]],
      ["Interval estimation", [
        "Inverting a test statistic",
        "Pivotal quantities",
        "Pivoting the CDF",
        "Bayesian credible intervals",
        "Size and coverage probability",
        "Optimality of confidence sets"
      ]],
      ["Bayesian inference and decision theory", [
        "Prior and posterior distributions",
        "Conjugate families",
        "Loss functions and risk",
        "Bayes rules and minimax"
      ]],
      ["Asymptotic theory", [
        "Consistency",
        "Asymptotic normality and efficiency of the MLE",
        "Delta method",
        "Asymptotic distribution of the LRT",
        "Wald and score tests",
        "Approximate confidence intervals"
      ]]
    ]
  },
  {
    id: "tsks33", uni: "LiU", code: "TSKS33", short: "TSKS33",
    name: "Complex Networks and Big Data", color: "#c2410c",
    note: "Latora, Nicosia, Russo: Complex Networks. 12 lectures, 7 tutorials, labs (LAB1).",
    temas: [
      ["Graphs and networks", [
        "Introduction to network science",
        "Graph representation and adjacency matrix",
        "Degree sequence and degree distribution",
        "Walks, paths and network motifs"
      ]],
      ["Laplacian and network types", [
        "Laplacian and its properties",
        "Signed networks",
        "Bipartite, affiliation and tripartite networks"
      ]],
      ["Similarity and clustering", [
        "Similarity metrics",
        "Clustering coefficient and transitivity"
      ]],
      ["Centrality", [
        "Degree and closeness centrality",
        "Betweenness centrality",
        "Eigenvector centrality",
        "Katz centrality",
        "PageRank",
        "Hubs and authorities (HITS)"
      ]],
      ["Sampling and random walks", [
        "Sampling of networks",
        "Random walks on graphs",
        "Friendship paradox"
      ]],
      ["Assortativity and modularity", [
        "Assortativity metrics",
        "Degree correlations",
        "Modularity"
      ]],
      ["Community detection", [
        "Graph partitioning",
        "Kernighan-Lin algorithm",
        "Girvan-Newman algorithm",
        "Spectral algorithms"
      ]],
      ["Network formation models", [
        "Poisson (Erdős-Rényi) random networks",
        "Configuration model",
        "Preferential attachment",
        "Power laws, scale-free networks and cutoffs"
      ]],
      ["Small worlds", [
        "Watts-Strogatz model",
        "Kleinberg model",
        "Small-world phenomena",
        "Searchability and reachability"
      ]],
      ["Dynamics on networks", [
        "Cascades",
        "Linear threshold models",
        "DeGroot model",
        "Diffusion"
      ]],
      ["Graph learning", [
        "Introduction to graph signal processing",
        "Graph Fourier transform and filtering",
        "Introduction to graph learning"
      ]],
      ["Labs", [
        "Lab 1", "Lab 2", "Lab 3", "Lab 4", "Lab 5", "Lab 6"
      ]]
    ]
  }
];

/* Fechas tomadas del calendario del móvil (4 oct 2026).
   type: exam | pec | other. Horas en hora local (Madrid/Estocolmo, misma zona). */
const DEFAULT_EVENTS = [
  // LiU
  { sid: "tsbb19", type: "pec",  title: "TSBB19 · Entrega informe proyecto 2", start: "2026-10-11", allDay: true },
  { sid: "tsbb19", type: "other", title: "TSBB19 · Seminario 2 (presentación proyecto 2)", start: "2026-10-14T13:15", end: "2026-10-14T17:00" },
  { sid: "tsbb19", type: "exam", title: "Examen TSBB19 (TEN1)", start: "2026-10-23T14:00", end: "2026-10-23T18:00" },
  { sid: "tsks15", type: "exam", title: "Examen TSKS15 (TEN1)", start: "2026-10-28T14:00", end: "2026-10-28T18:00" },
  { sid: "tsbb19", type: "exam", title: "Reexamen TSBB19 (TEN1) · hora por confirmar", start: "2027-01-04", allDay: true },
  { sid: "tsks15", type: "exam", title: "Reexamen TSKS15 (TEN1) · hora por confirmar", start: "2027-01-08", allDay: true },
  { sid: "tams17", type: "exam", title: "Examen TAMS17 (TEN2) · hora por confirmar", start: "2027-01-11", allDay: true },
  { sid: "tsks33", type: "exam", title: "Examen TSKS33 (TEN1) · hora por confirmar", start: "2027-01-14", allDay: true },
  // UNED PEC
  { sid: "em1", type: "pec", title: "Electromagnetismo I · PEC 1", start: "2026-10-30", end: "2026-11-02", allDay: true },
  { sid: "ff3", type: "pec", title: "Fundamentos de Física III · PEC 1", start: "2026-11-05T15:00", end: "2026-11-09T15:00" },
  { sid: "mm2", type: "pec", title: "Métodos Matemáticos II · PEC 1", start: "2026-11-19", end: "2026-11-25", allDay: true },
  { sid: "em1", type: "pec", title: "Electromagnetismo I · PEC 2", start: "2026-11-20", end: "2026-11-23", allDay: true },
  { sid: "mec", type: "pec", title: "Mecánica · PEC 1", start: "2026-11-25T20:00", end: "2026-11-25T21:30" },
  { sid: "em1", type: "pec", title: "Electromagnetismo I · PEC 3", start: "2026-12-11", end: "2026-12-14", allDay: true },
  { sid: "ff3", type: "pec", title: "Fundamentos de Física III · PEC 3", start: "2026-12-18T15:00", end: "2027-01-12T15:00" },
  { sid: "mm2", type: "pec", title: "Métodos Matemáticos II · PEC 2", start: "2027-01-08", end: "2027-01-14", allDay: true },
  { sid: "ff3", type: "pec", title: "Fundamentos de Física III · PEC 2", start: "2027-01-08T15:00", end: "2027-01-11T15:00" },
  { sid: "em1", type: "pec", title: "Electromagnetismo I · PEC 4", start: "2027-01-15", end: "2027-01-18", allDay: true },
  { sid: "mec", type: "pec", title: "Mecánica · PEC 2", start: "2027-01-17T20:00", end: "2027-01-17T21:30" },
  { sid: "td1", type: "pec", title: "Termodinámica I · PEC", start: "2027-01-18T15:00", end: "2027-01-19T15:00" },
  // UNED exámenes 1ª convocatoria
  { sid: "td1", type: "exam", title: "Examen Termodinámica I (1ª conv.)", start: "2027-01-25T11:30", end: "2027-01-25T13:30" },
  { sid: "mm2", type: "exam", title: "Examen Métodos Matemáticos II (1ª conv.)", start: "2027-01-26T09:00", end: "2027-01-26T11:00" },
  { sid: "ff3", type: "exam", title: "Examen Fundamentos de Física III (1ª conv.)", start: "2027-01-26T16:00", end: "2027-01-26T18:00" },
  { sid: "mec", type: "exam", title: "Examen Mecánica (1ª conv.)", start: "2027-01-27T11:30", end: "2027-01-27T13:30" },
  { sid: "em1", type: "exam", title: "Examen Electromagnetismo I (1ª conv.)", start: "2027-01-27T18:30", end: "2027-01-27T20:30" },
  { sid: "fc2", type: "exam", title: "Examen Física Computacional II (1ª conv.)", start: "2027-01-29T11:30", end: "2027-01-29T13:30" },
  // UNED exámenes 2ª convocatoria
  { sid: "td1", type: "exam", title: "Examen Termodinámica I (2ª conv.)", start: "2027-02-08T18:30", end: "2027-02-08T20:30" },
  { sid: "ff3", type: "exam", title: "Examen Fundamentos de Física III (2ª conv.)", start: "2027-02-09T09:00", end: "2027-02-09T11:00" },
  { sid: "mm2", type: "exam", title: "Examen Métodos Matemáticos II (2ª conv.)", start: "2027-02-09T16:00", end: "2027-02-09T18:00" },
  { sid: "em1", type: "exam", title: "Examen Electromagnetismo I (2ª conv.)", start: "2027-02-10T11:30", end: "2027-02-10T13:30" },
  { sid: "mec", type: "exam", title: "Examen Mecánica (2ª conv.)", start: "2027-02-10T18:30", end: "2027-02-10T20:30" },
  { sid: "fc2", type: "exam", title: "Examen Física Computacional II (2ª conv.)", start: "2027-02-12T18:30", end: "2027-02-12T20:30" }
];
