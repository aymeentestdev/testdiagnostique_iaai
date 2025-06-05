import { QuestionType, SubjectType } from '../types';

// Mathematics questions
const mathQuestions: QuestionType[] = [
  {
    id: 'math-1',
    subject: 'math',
    topic: 'Calculus',
    question: 'If f(x) = e^x and g(x) = ln(x), what is the value of (f ∘ g)(e)?',
    options: {
      a: '1',
      b: 'e',
      c: 'e^2',
      d: 'ln(e)',
    },
    correctAnswer: 'b',
    explanation: 'f(g(x)) = f(ln(x)) = e^(ln(x)) = x. Therefore, f(g(e)) = e.',
  },
  {
    id: 'math-2',
    subject: 'math',
    topic: 'Linear Algebra',
    question: 'Given the matrix A = [[2, 1], [1, 3]], what are its eigenvalues?',
    options: {
      a: '1 and 4',
      b: '2 and 3',
      c: '0.5 and 4.5',
      d: '1.5 and 3.5',
    },
    correctAnswer: 'a',
    explanation: 'The eigenvalues are found by solving the characteristic equation det(A - λI) = 0. For this matrix, the equation is (2-λ)(3-λ) - 1 = 0, which gives λ = 1 or λ = 4.',
  },
  {
    id: 'math-3',
    subject: 'math',
    topic: 'Probability',
    question: 'A fair coin is tossed 5 times. What is the probability of getting exactly 3 heads?',
    options: {
      a: '5/32',
      b: '1/5',
      c: '10/32',
      d: '1/2',
    },
    correctAnswer: 'c',
    explanation: 'The probability is C(5,3) × (1/2)^3 × (1/2)^2 = 10 × (1/32) = 10/32 = 5/16.',
  },
  {
    id: 'math-4',
    subject: 'math',
    topic: 'Geometry',
    question: 'What is the volume of a sphere with radius r?',
    options: {
      a: '4πr²',
      b: '4πr³/3',
      c: '2πr³',
      d: 'πr³',
    },
    correctAnswer: 'b',
    explanation: 'The volume of a sphere is given by the formula V = (4/3) × π × r³.',
  },
  {
    id: 'math-5',
    subject: 'math',
    topic: 'Calculus',
    question: 'Evaluate the indefinite integral: ∫ x²e^x dx',
    options: {
      a: 'x²e^x - 2xe^x + 2e^x + C',
      b: 'x²e^x - e^x + C',
      c: 'x³e^x/3 + C',
      d: 'x²e^x - 2∫ xe^x dx + C',
    },
    correctAnswer: 'a',
    explanation: 'Using integration by parts twice with u = x² and dv = e^x dx leads to the solution x²e^x - 2xe^x + 2e^x + C.',
  },
];

// Physics questions
const physicsQuestions: QuestionType[] = [
  {
    id: 'physics-1',
    subject: 'physics',
    topic: 'Mechanics',
    question: 'A ball is thrown vertically upward with an initial velocity of 20 m/s. How high will it go?',
    options: {
      a: '10 m',
      b: '20 m',
      c: '40 m',
      d: '30 m',
    },
    correctAnswer: 'b',
    explanation: 'Using the formula h = v²/(2g) with g = 9.8 m/s², we get h = 20²/(2 × 9.8) ≈ 20 m.',
  },
  {
    id: 'physics-2',
    subject: 'physics',
    topic: 'Electromagnetism',
    question: 'What is the magnetic field at the center of a circular loop of radius R carrying current I?',
    options: {
      a: 'μ₀I/2R',
      b: 'μ₀I/R',
      c: '2μ₀I/R',
      d: 'μ₀I/(2πR)',
    },
    correctAnswer: 'a',
    explanation: 'The magnetic field at the center of a circular loop is given by B = μ₀I/(2R).',
  },
  {
    id: 'physics-3',
    subject: 'physics',
    topic: 'Thermodynamics',
    question: 'Which statement describes the Second Law of Thermodynamics?',
    options: {
      a: 'Energy cannot be created or destroyed',
      b: 'Heat flows from hot to cold',
      c: 'The entropy of an isolated system never decreases',
      d: 'Work can be completely converted to heat',
    },
    correctAnswer: 'c',
    explanation: 'The Second Law of Thermodynamics states that the entropy of an isolated system not in equilibrium will tend to increase over time, approaching a maximum value at equilibrium.',
  },
  {
    id: 'physics-4',
    subject: 'physics',
    topic: 'Optics',
    question: 'For a thin converging lens, if an object is placed at a distance of 2f from the lens, where will the image be formed?',
    options: {
      a: 'At infinity',
      b: 'At 2f',
      c: 'At f',
      d: 'Between f and 2f',
    },
    correctAnswer: 'b',
    explanation: 'Using the lens equation 1/f = 1/do + 1/di, with do = 2f, we get 1/di = 1/f - 1/2f = 1/2f, so di = 2f.',
  },
  {
    id: 'physics-5',
    subject: 'physics',
    topic: 'Quantum Physics',
    question: 'What is the de Broglie wavelength of an electron with momentum p?',
    options: {
      a: 'λ = h/p',
      b: 'λ = hp',
      c: 'λ = h/2p',
      d: 'λ = 2h/p',
    },
    correctAnswer: 'a',
    explanation: 'The de Broglie wavelength is given by λ = h/p, where h is Planck\'s constant and p is the momentum.',
  },
];

// Chemistry questions
const chemistryQuestions: QuestionType[] = [
  {
    id: 'chemistry-1',
    subject: 'chemistry',
    topic: 'Atomic Structure',
    question: 'Which quantum number determines the shape of an orbital?',
    options: {
      a: 'Principal quantum number (n)',
      b: 'Azimuthal quantum number (l)',
      c: 'Magnetic quantum number (ml)',
      d: 'Spin quantum number (ms)',
    },
    correctAnswer: 'b',
    explanation: 'The azimuthal quantum number (l) determines the shape of the orbital (s, p, d, f).',
  },
  {
    id: 'chemistry-2',
    subject: 'chemistry',
    topic: 'Thermochemistry',
    question: 'What is the enthalpy change for a reaction where 2 moles of bonds are broken (each requiring 400 kJ/mol) and 2 moles of bonds are formed (each releasing 450 kJ/mol)?',
    options: {
      a: '+800 kJ',
      b: '-900 kJ',
      c: '-100 kJ',
      d: '+100 kJ',
    },
    correctAnswer: 'd',
    explanation: 'ΔH = energy to break bonds - energy released in bond formation = (2 × 400) - (2 × 450) = 800 - 900 = -100 kJ. Since the question asks for the enthalpy change, which is the negative of the energy change, the answer is +100 kJ.',
  },
  {
    id: 'chemistry-3',
    subject: 'chemistry',
    topic: 'Equilibrium',
    question: 'For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), how would an increase in pressure affect the equilibrium?',
    options: {
      a: 'Shift toward products',
      b: 'Shift toward reactants',
      c: 'No effect',
      d: 'Cannot be determined',
    },
    correctAnswer: 'a',
    explanation: 'According to Le Chatelier\'s principle, increasing pressure will shift the equilibrium toward the side with fewer gas molecules. In this reaction, there are 4 molecules on the reactant side (1 N₂ + 3 H₂) and 2 molecules on the product side (2 NH₃), so the equilibrium shifts toward products.',
  },
  {
    id: 'chemistry-4',
    subject: 'chemistry',
    topic: 'Organic Chemistry',
    question: 'What is the IUPAC name for CH₃-CH₂-CH(CH₃)-CH₂-CH₃?',
    options: {
      a: '2-methylpentane',
      b: '3-methylpentane',
      c: '2-ethylbutane',
      d: 'Hexane',
    },
    correctAnswer: 'b',
    explanation: 'The longest carbon chain has 5 carbons (pentane), and there is a methyl group attached to the 3rd carbon, so the IUPAC name is 3-methylpentane.',
  },
  {
    id: 'chemistry-5',
    subject: 'chemistry',
    topic: 'Electrochemistry',
    question: 'In a galvanic cell, which statement is correct?',
    options: {
      a: 'Oxidation occurs at the cathode',
      b: 'Electrons flow from anode to cathode',
      c: 'The anode has a positive charge',
      d: 'Reduction occurs at the anode',
    },
    correctAnswer: 'b',
    explanation: 'In a galvanic cell, oxidation occurs at the anode, reduction occurs at the cathode, and electrons flow from the anode (negative) to the cathode (positive).',
  },
];

// Biology questions
const biologyQuestions: QuestionType[] = [
  {
    id: 'biology-1',
    subject: 'biology',
    topic: 'Genetics',
    question: 'If a man with blood type AB has children with a woman with blood type O, what blood types can their children have?',
    options: {
      a: 'A and B only',
      b: 'A, B, and AB',
      c: 'A, B, AB, and O',
      d: 'A and B and O only',
    },
    correctAnswer: 'a',
    explanation: 'A person with blood type AB has genotype IAIB, and a person with blood type O has genotype ii. Their children will receive either IA or IB from the father and i from the mother, resulting in either IAi (type A) or IBi (type B).',
  },
  {
    id: 'biology-2',
    subject: 'biology',
    topic: 'Cell Biology',
    question: 'Which of the following organelles is NOT found in animal cells?',
    options: {
      a: 'Mitochondria',
      b: 'Chloroplasts',
      c: 'Golgi apparatus',
      d: 'Lysosomes',
    },
    correctAnswer: 'b',
    explanation: 'Chloroplasts are found in plant cells but not in animal cells. They are responsible for photosynthesis.',
  },
  {
    id: 'biology-3',
    subject: 'biology',
    topic: 'Ecology',
    question: 'In a predator-prey relationship, if the predator population increases, what typically happens to the prey population over time?',
    options: {
      a: 'It increases steadily',
      b: 'It decreases initially, then increases',
      c: 'It decreases steadily',
      d: 'It remains unchanged',
    },
    correctAnswer: 'b',
    explanation: 'In a predator-prey cycle, an increase in predators leads to a decrease in prey. As prey becomes scarce, predator numbers decline, allowing prey to recover. This cyclical relationship continues over time.',
  },
  {
    id: 'biology-4',
    subject: 'biology',
    topic: 'Physiology',
    question: 'Which hormone is responsible for regulating blood glucose levels by promoting cellular uptake of glucose?',
    options: {
      a: 'Glucagon',
      b: 'Insulin',
      c: 'Epinephrine',
      d: 'Cortisol',
    },
    correctAnswer: 'b',
    explanation: 'Insulin is secreted by the beta cells of the pancreas and promotes the uptake of glucose into cells, lowering blood glucose levels. Glucagon has the opposite effect.',
  },
  {
    id: 'biology-5',
    subject: 'biology',
    topic: 'Molecular Biology',
    question: 'During which phase of the cell cycle does DNA replication occur?',
    options: {
      a: 'G1 phase',
      b: 'S phase',
      c: 'G2 phase',
      d: 'M phase',
    },
    correctAnswer: 'b',
    explanation: 'DNA replication occurs during the S (synthesis) phase of interphase, before mitosis begins.',
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
      title: 'Mathematics',
      description: 'Test your understanding of calculus, algebra, geometry, and probability.',
      color: 'math',
      icon: 'Calculator',
      numQuestions: mathQuestions.length,
    },
    physics: {
      title: 'Physics',
      description: 'Challenge your knowledge of mechanics, thermodynamics, and quantum physics.',
      color: 'physics',
      icon: 'Atom',
      numQuestions: physicsQuestions.length,
    },
    chemistry: {
      title: 'Chemistry',
      description: 'Examine your understanding of atomic structure, reactions, and organic chemistry.',
      color: 'chemistry',
      icon: 'Flask',
      numQuestions: chemistryQuestions.length,
    },
    biology: {
      title: 'Biology',
      description: 'Test your knowledge of genetics, cell biology, physiology, and ecology.',
      color: 'biology',
      icon: 'Microscope',
      numQuestions: biologyQuestions.length,
    },
  };
};