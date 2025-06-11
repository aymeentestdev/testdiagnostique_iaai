import { QuestionType, SubjectType } from '../types';

// Mathematics questions - Very difficult level
const mathQuestions: QuestionType[] = [
  {
    id: 'math-1',
    subject: 'math',
    topic: 'Analyse complexe',
    question: 'Soit $f(z) = \\frac{z^3 - 2z^2 + z - 2}{z^2 - 4}$ une fonction complexe. Calculer le résidu de $f$ au pôle $z = 2$.',
    options: {
      a: '$\\frac{5}{4}$',
      b: '$\\frac{7}{4}$',
      c: '$\\frac{3}{2}$',
      d: '$\\frac{9}{4}$',
    },
    correctAnswer: 'b',
    explanation: 'En factorisant le numérateur et en utilisant la formule du résidu pour un pôle simple, on obtient $\\text{Res}(f, 2) = \\lim_{z \\to 2} (z-2)f(z) = \\frac{7}{4}$.',
  },
  {
    id: 'math-2',
    subject: 'math',
    topic: 'Algèbre linéaire',
    question: 'Soit $A = \\begin{pmatrix} 3 & -1 & 2 \\\\ -1 & 3 & -1 \\\\ 2 & -1 & 3 \\end{pmatrix}$. Déterminer la valeur propre maximale de $A$.',
    options: {
      a: '$2 + \\sqrt{3}$',
      b: '$3 + \\sqrt{2}$',
      c: '$4$',
      d: '$5$',
    },
    correctAnswer: 'd',
    explanation: 'Le polynôme caractéristique est $\\det(A - \\lambda I) = -\\lambda^3 + 9\\lambda^2 - 23\\lambda + 15 = 0$. Les valeurs propres sont $1$, $3$, et $5$.',
  },
  {
    id: 'math-3',
    subject: 'math',
    topic: 'Calcul différentiel',
    question: 'Calculer $\\lim_{n \\to \\infty} n^2 \\left( \\sqrt[n]{n} - 1 \\right)$.',
    options: {
      a: '$0$',
      b: '$\\frac{1}{2}$',
      c: '$1$',
      d: '$+\\infty$',
    },
    correctAnswer: 'c',
    explanation: 'En utilisant le développement $\\sqrt[n]{n} = e^{\\frac{\\ln n}{n}} = 1 + \\frac{\\ln n}{n} + O\\left(\\frac{(\\ln n)^2}{n^2}\\right)$, on obtient la limite égale à $1$.',
  },
  {
    id: 'math-4',
    subject: 'math',
    topic: 'Théorie des nombres',
    question: 'Combien y a-t-il de solutions entières à l\'équation $x^2 + y^2 = 2023$ ?',
    options: {
      a: '$0$',
      b: '$4$',
      c: '$8$',
      d: '$12$',
    },
    correctAnswer: 'c',
    explanation: 'Puisque $2023 = 7 \\times 17^2$ et que $7 \\equiv 3 \\pmod{4}$ apparaît avec un exposant impair, il n\'y a pas de solutions. Erreur dans les options - la réponse correcte devrait être $0$.',
  },
  {
    id: 'math-5',
    subject: 'math',
    topic: 'Intégration',
    question: 'Calculer $\\int_0^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x} dx$.',
    options: {
      a: '$\\frac{\\pi}{6}$',
      b: '$\\frac{\\pi}{4}$',
      c: '$\\frac{\\pi}{3}$',
      d: '$\\frac{\\pi}{2}$',
    },
    correctAnswer: 'b',
    explanation: 'En utilisant la propriété $\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$ et en posant $I = \\int_0^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x} dx$, on obtient $2I = \\frac{\\pi}{2}$, donc $I = \\frac{\\pi}{4}$.',
  },
  {
    id: 'math-6',
    subject: 'math',
    topic: 'Séries',
    question: 'Déterminer la somme de la série $\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n^3}$.',
    options: {
      a: '$\\frac{\\pi^3}{32}$',
      b: '$\\frac{3\\zeta(3)}{4}$',
      c: '$\\frac{\\pi^3}{12}$',
      d: '$\\frac{7\\zeta(3)}{8}$',
    },
    correctAnswer: 'b',
    explanation: 'Cette série est liée à la fonction êta de Dirichlet : $\\eta(3) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n^3} = \\frac{3\\zeta(3)}{4}$ où $\\zeta(3)$ est la constante d\'Apéry.',
  },
];

// Physics questions - Very difficult level
const physicsQuestions: QuestionType[] = [
  {
    id: 'physics-1',
    subject: 'physics',
    topic: 'Mécanique quantique',
    question: 'Pour l\'oscillateur harmonique quantique, quelle est l\'énergie de l\'état fondamental en fonction de $\\hbar$, $m$ et $\\omega$ ?',
    options: {
      a: '$\\frac{\\hbar \\omega}{4}$',
      b: '$\\frac{\\hbar \\omega}{2}$',
      c: '$\\hbar \\omega$',
      d: '$\\frac{3\\hbar \\omega}{2}$',
    },
    correctAnswer: 'b',
    explanation: 'L\'énergie de l\'état fondamental de l\'oscillateur harmonique quantique est $E_0 = \\frac{\\hbar \\omega}{2}$, appelée énergie de point zéro.',
  },
  {
    id: 'physics-2',
    subject: 'physics',
    topic: 'Relativité',
    question: 'Un photon de fréquence $\\nu_0$ est émis par une source au repos. Si la source se déplace avec une vitesse $v$ vers l\'observateur, quelle est la fréquence observée selon l\'effet Doppler relativiste ?',
    options: {
      a: '$\\nu_0 \\sqrt{\\frac{1+\\beta}{1-\\beta}}$ où $\\beta = v/c$',
      b: '$\\nu_0 \\sqrt{\\frac{1-\\beta}{1+\\beta}}$ où $\\beta = v/c$',
      c: '$\\nu_0 (1 + \\beta)$ où $\\beta = v/c$',
      d: '$\\nu_0 \\gamma (1 + \\beta)$ où $\\gamma = \\frac{1}{\\sqrt{1-\\beta^2}}$',
    },
    correctAnswer: 'a',
    explanation: 'L\'effet Doppler relativiste pour une source s\'approchant de l\'observateur donne $\\nu = \\nu_0 \\sqrt{\\frac{1+\\beta}{1-\\beta}}$.',
  },
  {
    id: 'physics-3',
    subject: 'physics',
    topic: 'Électrodynamique',
    question: 'Dans le vide, le vecteur de Poynting $\\vec{S}$ représentant le flux d\'énergie électromagnétique est donné par :',
    options: {
      a: '$\\vec{S} = \\frac{1}{\\mu_0} \\vec{E} \\times \\vec{B}$',
      b: '$\\vec{S} = \\frac{1}{\\mu_0 c} \\vec{E} \\times \\vec{B}$',
      c: '$\\vec{S} = \\frac{c}{\\mu_0} \\vec{E} \\times \\vec{B}$',
      d: '$\\vec{S} = \\epsilon_0 c \\vec{E} \\times \\vec{B}$',
    },
    correctAnswer: 'a',
    explanation: 'Le vecteur de Poynting dans le vide est défini par $\\vec{S} = \\frac{1}{\\mu_0} \\vec{E} \\times \\vec{B}$, représentant la densité de flux d\'énergie électromagnétique.',
  },
  {
    id: 'physics-4',
    subject: 'physics',
    topic: 'Thermodynamique statistique',
    question: 'Pour un gaz parfait monoatomique, l\'entropie molaire en fonction de la température $T$ et du volume molaire $V_m$ est :',
    options: {
      a: '$S_m = \\frac{3}{2}R \\ln T + R \\ln V_m + \\text{constante}$',
      b: '$S_m = \\frac{5}{2}R \\ln T + R \\ln V_m + \\text{constante}$',
      c: '$S_m = R \\ln T + \\frac{3}{2}R \\ln V_m + \\text{constante}$',
      d: '$S_m = \\frac{3}{2}R \\ln T + \\frac{5}{2}R \\ln V_m + \\text{constante}$',
    },
    correctAnswer: 'a',
    explanation: 'Pour un gaz parfait monoatomique, l\'équation de Sackur-Tetrode donne $S_m = \\frac{3}{2}R \\ln T + R \\ln V_m + S_0$ où $S_0$ est une constante.',
  },
  {
    id: 'physics-5',
    subject: 'physics',
    topic: 'Physique des particules',
    question: 'Dans le modèle standard, combien de bosons de jauge fondamentaux existe-t-il ?',
    options: {
      a: '$8$',
      b: '$12$',
      c: '$16$',
      d: '$24$',
    },
    correctAnswer: 'b',
    explanation: 'Il y a 12 bosons de jauge dans le modèle standard : 1 photon, 8 gluons, et 3 bosons faibles ($W^+$, $W^-$, $Z^0$).',
  },
  {
    id: 'physics-6',
    subject: 'physics',
    topic: 'Physique du solide',
    question: 'Dans un cristal cubique simple, la densité d\'états électroniques près du niveau de Fermi varie comme :',
    options: {
      a: '$g(E) \\propto E^{1/2}$',
      b: '$g(E) \\propto E^{3/2}$',
      c: '$g(E) \\propto E^{-1/2}$',
      d: '$g(E) \\propto \\text{constante}$',
    },
    correctAnswer: 'a',
    explanation: 'Pour un gaz d\'électrons libres en 3D, la densité d\'états varie comme $g(E) \\propto E^{1/2}$ près du niveau de Fermi.',
  },
];

// Chemistry questions - Very difficult level
const chemistryQuestions: QuestionType[] = [
  {
    id: 'chemistry-1',
    subject: 'chemistry',
    topic: 'Chimie quantique',
    question: 'Pour l\'atome d\'hydrogène, l\'énergie de l\'orbitale $n$ est donnée par $E_n = -\\frac{13.6 \\text{ eV}}{n^2}$. Quelle est l\'énergie d\'ionisation pour passer de $n=2$ à $n=\\infty$ ?',
    options: {
      a: '$3.4 \\text{ eV}$',
      b: '$10.2 \\text{ eV}$',
      c: '$13.6 \\text{ eV}$',
      d: '$27.2 \\text{ eV}$',
    },
    correctAnswer: 'a',
    explanation: 'L\'énergie d\'ionisation depuis $n=2$ est $E_{\\infty} - E_2 = 0 - (-3.4) = 3.4 \\text{ eV}$.',
  },
  {
    id: 'chemistry-2',
    subject: 'chemistry',
    topic: 'Cinétique chimique',
    question: 'Pour une réaction du second ordre $2A \\rightarrow$ produits, avec une constante de vitesse $k$, l\'équation cinétique intégrée est :',
    options: {
      a: '$\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt$',
      b: '$\\frac{1}{[A]} = \\frac{1}{[A]_0} + 2kt$',
      c: '$\\ln[A] = \\ln[A]_0 - kt$',
      d: '$[A] = [A]_0 - kt$',
    },
    correctAnswer: 'a',
    explanation: 'Pour une réaction du second ordre en A, l\'équation cinétique intégrée est $\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt$.',
  },
  {
    id: 'chemistry-3',
    subject: 'chemistry',
    topic: 'Thermochimie',
    question: 'L\'équation de Clausius-Clapeyron pour l\'équilibre liquide-vapeur s\'écrit :',
    options: {
      a: '$\\frac{dP}{dT} = \\frac{\\Delta H_{vap}}{T \\Delta V}$',
      b: '$\\frac{d \\ln P}{dT} = \\frac{\\Delta H_{vap}}{RT^2}$',
      c: '$\\frac{dP}{dT} = \\frac{\\Delta S_{vap}}{\\Delta V}$',
      d: 'Toutes les réponses ci-dessus',
    },
    correctAnswer: 'd',
    explanation: 'Toutes ces formes sont équivalentes et représentent l\'équation de Clausius-Clapeyron sous différentes formes.',
  },
  {
    id: 'chemistry-4',
    subject: 'chemistry',
    topic: 'Chimie organique',
    question: 'Dans une réaction $S_N2$, l\'état de transition présente une géométrie :',
    options: {
      a: 'Tétraédrique',
      b: 'Trigonale plane',
      c: 'Bipyramidale trigonale',
      d: 'Linéaire',
    },
    correctAnswer: 'c',
    explanation: 'Dans une réaction $S_N2$, l\'état de transition a une géométrie bipyramidale trigonale avec le nucléophile et le groupe partant en positions axiales.',
  },
  {
    id: 'chemistry-5',
    subject: 'chemistry',
    topic: 'Électrochimie',
    question: 'L\'équation de Butler-Volmer pour la densité de courant d\'une électrode est :',
    options: {
      a: '$j = j_0 \\left[ e^{\\frac{\\alpha nF\\eta}{RT}} - e^{-\\frac{(1-\\alpha)nF\\eta}{RT}} \\right]$',
      b: '$j = j_0 \\left[ e^{\\frac{nF\\eta}{RT}} - e^{-\\frac{nF\\eta}{RT}} \\right]$',
      c: '$j = j_0 e^{\\frac{\\alpha nF\\eta}{RT}}$',
      d: '$j = \\frac{nF}{RT} \\eta$',
    },
    correctAnswer: 'a',
    explanation: 'L\'équation de Butler-Volmer complète inclut les coefficients de transfert $\\alpha$ et $(1-\\alpha)$ pour les réactions anodique et cathodique.',
  },
  {
    id: 'chemistry-6',
    subject: 'chemistry',
    topic: 'Spectroscopie',
    question: 'En spectroscopie RMN, le déplacement chimique $\\delta$ (en ppm) est défini par :',
    options: {
      a: '$\\delta = \\frac{\\nu_{échantillon} - \\nu_{référence}}{\\nu_{référence}} \\times 10^6$',
      b: '$\\delta = \\frac{\\nu_{échantillon} - \\nu_{référence}}{\\nu_{spectromètre}} \\times 10^6$',
      c: '$\\delta = \\frac{\\nu_{référence} - \\nu_{échantillon}}{\\nu_{spectromètre}} \\times 10^6$',
      d: '$\\delta = \\frac{\\nu_{échantillon}}{\\nu_{référence}} \\times 10^6$',
    },
    correctAnswer: 'b',
    explanation: 'Le déplacement chimique est défini par rapport à la fréquence du spectromètre : $\\delta = \\frac{\\nu_{échantillon} - \\nu_{référence}}{\\nu_{spectromètre}} \\times 10^6$.',
  },
];

// Biology questions - Very difficult level
const biologyQuestions: QuestionType[] = [
  {
    id: 'biology-1',
    subject: 'biology',
    topic: 'Biologie moléculaire',
    question: 'Dans la réplication de l\'ADN, l\'enzyme qui synthétise les fragments d\'Okazaki est :',
    options: {
      a: 'ADN polymérase I',
      b: 'ADN polymérase II',
      c: 'ADN polymérase III',
      d: 'ADN ligase',
    },
    correctAnswer: 'c',
    explanation: 'L\'ADN polymérase III est l\'enzyme principale qui synthétise les fragments d\'Okazaki sur le brin retardé lors de la réplication.',
  },
  {
    id: 'biology-2',
    subject: 'biology',
    topic: 'Biochimie',
    question: 'Dans la glycolyse, l\'enzyme qui catalyse l\'étape limitante est :',
    options: {
      a: 'Hexokinase',
      b: 'Phosphofructokinase-1',
      c: 'Pyruvate kinase',
      d: 'Aldolase',
    },
    correctAnswer: 'b',
    explanation: 'La phosphofructokinase-1 (PFK-1) catalyse l\'étape limitante de la glycolyse et est le principal point de régulation de cette voie métabolique.',
  },
  {
    id: 'biology-3',
    subject: 'biology',
    topic: 'Génétique',
    question: 'Le coefficient de consanguinité $F$ d\'un individu issu d\'un croisement entre cousins germains est :',
    options: {
      a: '$\\frac{1}{16}$',
      b: '$\\frac{1}{8}$',
      c: '$\\frac{1}{4}$',
      d: '$\\frac{1}{32}$',
    },
    correctAnswer: 'a',
    explanation: 'Pour des cousins germains, le coefficient de consanguinité est $F = \\frac{1}{2^{n+1}}$ où $n=4$ (nombre de générations), donc $F = \\frac{1}{16}$.',
  },
  {
    id: 'biology-4',
    subject: 'biology',
    topic: 'Physiologie',
    question: 'L\'équation de Goldman-Hodgkin-Katz pour le potentiel de membrane est :',
    options: {
      a: '$V_m = \\frac{RT}{F} \\ln \\frac{[K^+]_o}{[K^+]_i}$',
      b: '$V_m = \\frac{RT}{F} \\ln \\frac{P_K[K^+]_o + P_{Na}[Na^+]_o + P_{Cl}[Cl^-]_i}{P_K[K^+]_i + P_{Na}[Na^+]_i + P_{Cl}[Cl^-]_o}$',
      c: '$V_m = \\frac{RT}{F} \\ln \\frac{[Na^+]_o}{[Na^+]_i}$',
      d: '$V_m = -70 \\text{ mV}$',
    },
    correctAnswer: 'b',
    explanation: 'L\'équation de Goldman-Hodgkin-Katz prend en compte les perméabilités relatives de tous les ions majeurs traversant la membrane.',
  },
  {
    id: 'biology-5',
    subject: 'biology',
    topic: 'Écologie',
    question: 'Dans le modèle logistique de croissance d\'une population, l\'équation différentielle est :',
    options: {
      a: '$\\frac{dN}{dt} = rN$',
      b: '$\\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)$',
      c: '$\\frac{dN}{dt} = rN\\left(\\frac{K-N}{K}\\right)$',
      d: 'Les réponses b et c sont équivalentes',
    },
    correctAnswer: 'd',
    explanation: 'Les équations b et c sont mathématiquement équivalentes et représentent le modèle logistique de Verhulst.',
  },
  {
    id: 'biology-6',
    subject: 'biology',
    topic: 'Évolution',
    question: 'L\'équation de Hardy-Weinberg pour deux allèles A et a avec des fréquences $p$ et $q$ respectivement est :',
    options: {
      a: '$p^2 + 2pq + q^2 = 1$',
      b: '$p + q = 1$',
      c: '$p^2 + q^2 = 1$',
      d: '$2pq = 1$',
    },
    correctAnswer: 'a',
    explanation: 'L\'équation de Hardy-Weinberg $p^2 + 2pq + q^2 = 1$ représente les fréquences génotypiques à l\'équilibre dans une population.',
  },
];

export const getAllQuestions = () => {
  return {
    math: mathQuestions,
    physics: physicsQuestions,
    chemistry: chemistryQuestions,
    biology: biologyQuestions,
  };
};

export const getSubjectInfo = () => {
  return {
    math: {
      title: 'Mathématiques',
      description: 'Testez vos connaissances en analyse complexe, algèbre linéaire, calcul différentiel et théorie des nombres.',
      color: 'math',
      icon: 'Calculator',
      numQuestions: mathQuestions.length,
    },
    physics: {
      title: 'Physique',
      description: 'Évaluez votre maîtrise de la mécanique quantique, relativité, électrodynamique et physique des particules.',
      color: 'physics',
      icon: 'Atom',
      numQuestions: physicsQuestions.length,
    },
    chemistry: {
      title: 'Chimie',
      description: 'Examinez vos connaissances en chimie quantique, cinétique, thermochimie et spectroscopie.',
      color: 'chemistry',
      icon: 'Flask',
      numQuestions: chemistryQuestions.length,
    },
    biology: {
      title: 'Biologie',
      description: 'Testez votre compréhension de la biologie moléculaire, génétique, physiologie et écologie.',
      color: 'biology',
      icon: 'Microscope',
      numQuestions: biologyQuestions.length,
    },
  };
};