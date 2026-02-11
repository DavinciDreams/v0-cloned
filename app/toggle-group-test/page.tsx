"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export default function ToggleGroupTestPage() {
  const [textStyle, setTextStyle] = useState<string[]>([])
  const [alignment, setAlignment] = useState<string>("left")

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Toggle Group Component Test</h1>
          <p className="text-muted-foreground">
            Testing the shadcn/ui ToggleGroup component with various configurations
          </p>
        </div>

        {/* Single Selection */}
        <section className="space-y-4 border rounded-lg p-6">
          <h2 className="text-xl font-semibold">Single Selection (type="single")</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Text Alignment (default variant)</p>
              <ToggleGroup type="single" value={alignment} onValueChange={(value) => value && setAlignment(value)}>
                <ToggleGroupItem value="left" aria-label="Align left">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-sm mt-2">Selected: {alignment}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Text Alignment (outline variant)</p>
              <ToggleGroup type="single" value={alignment} onValueChange={(value) => value && setAlignment(value)}>
                <ToggleGroupItem value="left" aria-label="Align left" variant="outline">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center" variant="outline">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right" variant="outline">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>

        {/* Multiple Selection */}
        <section className="space-y-4 border rounded-lg p-6">
          <h2 className="text-xl font-semibold">Multiple Selection (type="multiple")</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Text Formatting</p>
              <ToggleGroup type="multiple" value={textStyle} onValueChange={setTextStyle}>
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  <Bold />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  <Italic />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Toggle underline">
                  <Underline />
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-sm mt-2">Selected: {textStyle.join(", ") || "none"}</p>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4 border rounded-lg p-6">
          <h2 className="text-xl font-semibold">Sizes</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small (size="sm")</p>
              <ToggleGroup type="single">
                <ToggleGroupItem value="left" aria-label="Align left" size="sm">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center" size="sm">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right" size="sm">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Default (size="default")</p>
              <ToggleGroup type="single">
                <ToggleGroupItem value="left" aria-label="Align left">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Large (size="lg")</p>
              <ToggleGroup type="single">
                <ToggleGroupItem value="left" aria-label="Align left" size="lg">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center" size="lg">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right" size="lg">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>

        {/* With Text */}
        <section className="space-y-4 border rounded-lg p-6">
          <h2 className="text-xl font-semibold">With Text</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Options with labels</p>
              <ToggleGroup type="single" variant="outline">
                <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
                <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
                <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Icons with text</p>
              <ToggleGroup type="single">
                <ToggleGroupItem value="bold">
                  <Bold />
                  Bold
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                  <Italic />
                  Italic
                </ToggleGroupItem>
                <ToggleGroupItem value="underline">
                  <Underline />
                  Underline
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </section>

        {/* Disabled State */}
        <section className="space-y-4 border rounded-lg p-6">
          <h2 className="text-xl font-semibold">Disabled State</h2>
          <div className="space-y-4">
            <ToggleGroup type="single">
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center" disabled>
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </section>
      </div>
    </div>
  )
}
