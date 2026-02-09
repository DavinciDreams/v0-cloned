"use client";

import {
  Latex,
  LatexHeader,
  LatexTitle,
  LatexActions,
  LatexCopyButton,
  LatexFullscreenButton,
  LatexContent,
  type LatexData,
} from "@/components/ai-elements/latex-client";

export default function LatexTestPage() {
  // Example 1: Single equation (Quadratic formula)
  const singleEquationData: LatexData = {
    equation: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    displayMode: true,
  };

  // Example 2: Multiple equations
  const multipleEquationsData: LatexData = {
    equations: [
      {
        equation: "E = mc^2",
        displayMode: true,
        label: "Einstein's mass-energy equivalence",
      },
      {
        equation: "F = ma",
        displayMode: true,
        label: "Newton's second law",
      },
      {
        equation: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}",
        displayMode: true,
        label: "Gauss's law (electromagnetism)",
      },
    ],
  };

  // Example 3: Complex equation (Maxwell's equations)
  const maxwellEquationsData: LatexData = {
    equations: [
      {
        equation: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}",
        displayMode: true,
        label: "Gauss's law",
      },
      {
        equation: "\\nabla \\cdot \\mathbf{B} = 0",
        displayMode: true,
        label: "Gauss's law for magnetism",
      },
      {
        equation:
          "\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}",
        displayMode: true,
        label: "Faraday's law",
      },
      {
        equation:
          "\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}",
        displayMode: true,
        label: "Ampère's law with Maxwell's correction",
      },
    ],
  };

  // Example 4: Calculus
  const calculusData: LatexData = {
    equations: [
      {
        equation: "\\int_a^b f(x) \\, dx",
        displayMode: true,
        label: "Definite integral",
      },
      {
        equation: "\\frac{d}{dx} f(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        displayMode: true,
        label: "Derivative definition",
      },
      {
        equation:
          "\\int_a^b f(x) \\, dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)",
        displayMode: true,
        label: "Fundamental theorem of calculus",
      },
    ],
  };

  // Example 5: Matrix and Linear Algebra
  const linearAlgebraData: LatexData = {
    equations: [
      {
        equation:
          "\\mathbf{A} = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
        displayMode: true,
        label: "Matrix notation",
      },
      {
        equation: "\\det(\\mathbf{A}) = ad - bc",
        displayMode: true,
        label: "Determinant of 2x2 matrix",
      },
      {
        equation:
          "\\mathbf{A}\\mathbf{x} = \\mathbf{b} \\quad \\text{where } \\mathbf{x} \\in \\mathbb{R}^n",
        displayMode: true,
        label: "System of linear equations",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">LaTeX Component Test</h1>
          <p className="mt-2 text-muted-foreground">
            Testing the LaTeX rendering component with various mathematical
            equations
          </p>
        </div>

        {/* Example 1: Single Equation */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">1. Quadratic Formula</h2>
          <Latex data={singleEquationData}>
            <LatexHeader>
              <LatexTitle>Quadratic Formula</LatexTitle>
              <LatexActions>
                <LatexCopyButton />
                <LatexFullscreenButton />
              </LatexActions>
            </LatexHeader>
            <LatexContent />
          </Latex>
        </div>

        {/* Example 2: Multiple Equations */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            2. Famous Physics Equations
          </h2>
          <Latex data={multipleEquationsData}>
            <LatexHeader>
              <LatexTitle>Physics Fundamentals</LatexTitle>
              <LatexActions>
                <LatexCopyButton />
                <LatexFullscreenButton />
              </LatexActions>
            </LatexHeader>
            <LatexContent />
          </Latex>
        </div>

        {/* Example 3: Maxwell's Equations */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            3. Maxwell&apos;s Equations
          </h2>
          <Latex data={maxwellEquationsData}>
            <LatexHeader>
              <LatexTitle>Classical Electromagnetism</LatexTitle>
              <LatexActions>
                <LatexCopyButton />
                <LatexFullscreenButton />
              </LatexActions>
            </LatexHeader>
            <LatexContent />
          </Latex>
        </div>

        {/* Example 4: Calculus */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">4. Calculus</h2>
          <Latex data={calculusData}>
            <LatexHeader>
              <LatexTitle>Fundamental Calculus</LatexTitle>
              <LatexActions>
                <LatexCopyButton />
                <LatexFullscreenButton />
              </LatexActions>
            </LatexHeader>
            <LatexContent />
          </Latex>
        </div>

        {/* Example 5: Linear Algebra */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">5. Linear Algebra</h2>
          <Latex data={linearAlgebraData}>
            <LatexHeader>
              <LatexTitle>Matrix Operations</LatexTitle>
              <LatexActions>
                <LatexCopyButton />
                <LatexFullscreenButton />
              </LatexActions>
            </LatexHeader>
            <LatexContent />
          </Latex>
        </div>
      </div>
    </div>
  );
}
