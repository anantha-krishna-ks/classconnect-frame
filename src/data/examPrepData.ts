export const examPrepData = {
  subjects: [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'english', name: 'English' },
    { id: 'social', name: 'Social Science' }
  ],

  chapters: {
    math: [
      { id: 'algebra', name: 'Algebra' },
      { id: 'geometry', name: 'Geometry' },
      { id: 'trigonometry', name: 'Trigonometry' },
      { id: 'calculus', name: 'Calculus' },
      { id: 'statistics', name: 'Statistics' }
    ],
    physics: [
      { id: 'mechanics', name: 'Mechanics' },
      { id: 'thermodynamics', name: 'Thermodynamics' },
      { id: 'optics', name: 'Optics' },
      { id: 'electricity', name: 'Electricity & Magnetism' },
      { id: 'modern-physics', name: 'Modern Physics' }
    ],
    chemistry: [
      { id: 'organic', name: 'Organic Chemistry' },
      { id: 'inorganic', name: 'Inorganic Chemistry' },
      { id: 'physical', name: 'Physical Chemistry' },
      { id: 'coordination', name: 'Coordination Compounds' },
      { id: 'surface', name: 'Surface Chemistry' }
    ]
  },

  concepts: {
    algebra: [
      { id: 'linear-eq', name: 'Linear Equations' },
      { id: 'quadratic', name: 'Quadratic Equations' },
      { id: 'polynomials', name: 'Polynomials' },
      { id: 'sequences', name: 'Sequences and Series' }
    ],
    geometry: [
      { id: 'triangles', name: 'Triangles' },
      { id: 'circles', name: 'Circles' },
      { id: 'coordinate', name: 'Coordinate Geometry' },
      { id: 'mensuration', name: 'Mensuration' }
    ],
    mechanics: [
      { id: 'kinematics', name: 'Kinematics' },
      { id: 'dynamics', name: 'Dynamics' },
      { id: 'work-energy', name: 'Work and Energy' },
      { id: 'rotational', name: 'Rotational Motion' }
    ],
    organic: [
      { id: 'hydrocarbons', name: 'Hydrocarbons' },
      { id: 'alcohols', name: 'Alcohols and Ethers' },
      { id: 'carbonyl', name: 'Carbonyl Compounds' },
      { id: 'nitrogen', name: 'Nitrogen Compounds' }
    ]
  },

  sampleQuestions: [
    {
      id: 1,
      question: "Solve the quadratic equation: x² - 5x + 6 = 0",
      type: "Short Answer",
      marks: 3,
      concept: "Quadratic Equations"
    },
    {
      id: 2,
      question: "Find the area of a triangle with vertices at (0,0), (4,0), and (2,3).",
      type: "Short Answer", 
      marks: 4,
      concept: "Coordinate Geometry"
    },
    {
      id: 3,
      question: "A ball is thrown vertically upward with initial velocity 20 m/s. Find the maximum height reached.",
      type: "Long Answer",
      marks: 5,
      concept: "Kinematics"
    },
    {
      id: 4,
      question: "Name the IUPAC nomenclature of CH₃-CH₂-CH(CH₃)-CH₂-OH",
      type: "Short Answer",
      marks: 2,
      concept: "Alcohols and Ethers"
    },
    {
      id: 5,
      question: "Derive the formula for the nth term of an arithmetic progression.",
      type: "Long Answer",
      marks: 6,
      concept: "Sequences and Series"
    }
  ],

  mockExamQuestions: {
    sectionA: [
      {
        id: 1,
        question: "The solution of x² - 4x + 3 = 0 is:",
        options: ["x = 1, 3", "x = 2, 4", "x = -1, -3", "x = 0, 4"],
        answer: 0,
        marks: 1
      },
      {
        id: 2,
        question: "The derivative of x³ + 2x² - 5x + 1 is:",
        options: ["3x² + 4x - 5", "x² + 2x - 5", "3x² + 2x - 5", "3x² + 4x + 5"],
        answer: 0,
        marks: 1
      },
      {
        id: 3,
        question: "Which of the following is a vector quantity?",
        options: ["Speed", "Mass", "Velocity", "Temperature"],
        answer: 2,
        marks: 1
      },
      {
        id: 4,
        question: "The molecular formula of benzene is:",
        options: ["C₆H₁₂", "C₆H₆", "C₆H₁₄", "C₆H₁₀"],
        answer: 1,
        marks: 1
      },
      {
        id: 5,
        question: "The unit of electric field is:",
        options: ["N/C", "C/N", "N·C", "C²/N"],
        answer: 0,
        marks: 1
      }
    ],
    
    sectionB: [
      {
        id: 1,
        question: "Find the roots of the equation x² - 7x + 12 = 0 using factorization method.",
        marks: 5,
        type: "Short Answer"
      },
      {
        id: 2,
        question: "A car accelerates from rest at 2 m/s² for 5 seconds. Calculate the distance traveled.",
        marks: 5,
        type: "Short Answer"
      },
      {
        id: 3,
        question: "Write the electron configuration of Iron (Fe, Z=26).",
        marks: 3,
        type: "Short Answer"
      },
      {
        id: 4,
        question: "Find the area of a circle with radius 7 cm. (Use π = 22/7)",
        marks: 3,
        type: "Short Answer"
      }
    ],

    sectionC: [
      {
        id: 1,
        question: "Derive the quadratic formula from the general form ax² + bx + c = 0.",
        marks: 8,
        type: "Long Answer"
      },
      {
        id: 2,
        question: "State and prove the work-energy theorem with a suitable example.",
        marks: 8,
        type: "Long Answer"
      },
      {
        id: 3,
        question: "Explain the mechanism of SN1 and SN2 reactions with suitable examples.",
        marks: 10,
        type: "Long Answer"
      }
    ],

    sectionD: [
      {
        id: 1,
        question: "A projectile is launched at an angle of 30° with the horizontal at a velocity of 50 m/s. Calculate: (a) Maximum height reached (b) Range of the projectile (c) Time of flight.",
        marks: 10,
        type: "Application"
      },
      {
        id: 2,
        question: "Design a synthetic route to prepare aniline from benzene. Explain each step with proper reagents and conditions.",
        marks: 10,
        type: "Application"
      }
    ]
  },

  evaluationData: {
    sampleEvaluation: {
      totalMarks: 50,
      obtainedMarks: 38,
      percentage: 76,
      grade: 'B+',
      questionWiseAnalysis: [
        {
          questionNo: 1,
          attempted: true,
          marksObtained: 3,
          totalMarks: 3,
          feedback: "Excellent! Correct method and answer."
        },
        {
          questionNo: 2,
          attempted: true,
          marksObtained: 2,
          totalMarks: 4,
          feedback: "Good approach but minor calculation error in the final step."
        },
        {
          questionNo: 3,
          attempted: true,
          marksObtained: 4,
          totalMarks: 5,
          feedback: "Correct formula used but missed the units in final answer."
        },
        {
          questionNo: 4,
          attempted: false,
          marksObtained: 0,
          totalMarks: 2,
          feedback: "Not attempted. Review IUPAC nomenclature rules."
        },
        {
          questionNo: 5,
          attempted: true,
          marksObtained: 5,
          totalMarks: 6,
          feedback: "Good derivation steps but explanation could be more detailed."
        }
      ],
      improvementAreas: [
        "Practice IUPAC nomenclature rules for organic compounds",
        "Be more careful with calculation steps",
        "Always include proper units in final answers",
        "Time management - attempt all questions"
      ],
      strengths: [
        "Strong understanding of quadratic equations",
        "Good problem-solving approach",
        "Neat presentation of solutions"
      ]
    }
  }
};