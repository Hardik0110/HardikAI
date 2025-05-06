"use client"

import * as React from "react"

// Оптимизированный класс Pixel
class Pixel {
  private ctx: CanvasRenderingContext2D
  private x: number
  private y: number
  private color: string
  private speed: number
  private size: number = 0
  private sizeStep: number
  private minSize: number = 0.5
  private maxSize: number
  private delay: number
  private counter: number = 0
  private counterStep: number
  private isIdle: boolean = false
  private isReverse: boolean = false
  private isShimmer: boolean = false
  private readonly maxSizeInteger: number = 2

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.ctx = context
    this.x = x
    this.y = y
    this.color = color
    this.speed = this.getRandomValue(0.1, 0.9) * speed
    this.sizeStep = Math.random() * 0.4
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger)
    this.delay = delay
    this.counterStep = Math.random() * 4 + (canvas.width + canvas.height) * 0.01
  }

  private getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private draw(): void {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    )
  }

  private shimmer(): void {
    if (this.size >= this.maxSize) {
      this.isReverse = true
    } else if (this.size <= this.minSize) {
      this.isReverse = false
    }

    this.size += this.isReverse ? -this.speed : this.speed
  }

  appear(): void {
    this.isIdle = false

    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true
    }

    if (this.isShimmer) {
      this.shimmer()
    } else {
      this.size += this.sizeStep
    }

    this.draw()
  }

  disappear(): void {
    this.isShimmer = false
    this.counter = 0

    if (this.size <= 0) {
      this.isIdle = true
      return
    }
    
    this.size -= 0.1
    this.draw()
  }

  get idle(): boolean {
    return this.isIdle
  }
}

// Оптимизированный веб-компонент
class PixelCanvasElement extends HTMLElement {
  private canvas: HTMLCanvasElement = document.createElement("canvas")
  private ctx: CanvasRenderingContext2D | null
  private pixels: Pixel[] = []
  private animation: number | null = null
  private timeInterval: number = 1000 / 60
  private timePrevious: number = performance.now()
  private reducedMotion: boolean
  private _initialized: boolean = false
  private _resizeObserver: ResizeObserver | null = null
  private _parent: Element | null = null
  private _boundAppear: () => void
  private _boundDisappear: () => void
  private _nameElement: HTMLDivElement | null = null

  constructor() {
    super()
    this.ctx = this.canvas.getContext("2d")
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    // Создаем привязанные функции один раз
    this._boundAppear = () => this.handleAnimation("appear")
    this._boundDisappear = () => this.handleAnimation("disappear")

    const shadow = this.attachShadow({ mode: "open" })
    const style = document.createElement("style")
    style.textContent = `
      :host {
        display: grid;
        inline-size: 100%;
        block-size: 100%;
        overflow: hidden;
        position: relative;
      }
      .canvas-name {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: bold;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        text-align: center;
        z-index: 10;
      }
    `
    
    // Create name element
    this._nameElement = document.createElement("div")
    this._nameElement.className = "canvas-name"
    
    shadow.appendChild(style)
    shadow.appendChild(this.canvas)
    shadow.appendChild(this._nameElement)
  }

  get colors(): string[] {
    return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"]
  }

  get gap(): number {
    const value = Number(this.dataset.gap) || 5
    return Math.max(4, Math.min(50, value))
  }

  get speed(): number {
    const value = Number(this.dataset.speed) || 35
    return this.reducedMotion ? 0 : Math.max(0, Math.min(100, value)) * 0.001
  }

  get noFocus(): boolean {
    return this.hasAttribute("data-no-focus")
  }

  get variant(): string {
    return this.dataset.variant || "default"
  }
  
  get name(): string | null {
    return this.dataset.name || null
  }
  
  get nameColor(): string {
    return this.dataset.nameColor || "#ffffff"
  }

  connectedCallback(): void {
    if (this._initialized) return
    this._initialized = true
    this._parent = this.parentElement
    
    // Update name element if name is provided
    if (this.name && this._nameElement) {
      this._nameElement.textContent = this.name
      this._nameElement.style.color = this.nameColor
    }

    requestAnimationFrame(() => {
      this.handleResize()

      this._resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => this.handleResize())
      })
      this._resizeObserver.observe(this)
    })

    // Add event listeners for mouse interaction
    this._parent?.addEventListener("mouseenter", this._boundAppear)
    this._parent?.addEventListener("mouseleave", this._boundDisappear)
    
    // Show/hide name on hover
    if (this.name && this._nameElement) {
      this._parent?.addEventListener("mouseenter", () => {
        if (this._nameElement) {
          this._nameElement.style.opacity = "1"
        }
      })
      
      this._parent?.addEventListener("mouseleave", () => {
        if (this._nameElement) {
          this._nameElement.style.opacity = "0"
        }
      })
    }

    if (!this.noFocus) {
      this._parent?.addEventListener("focus", this._boundAppear, { capture: true })
      this._parent?.addEventListener("blur", this._boundDisappear, { capture: true })
      
      // Show/hide name on focus
      if (this.name && this._nameElement) {
        this._parent?.addEventListener("focus", () => {
          if (this._nameElement) {
            this._nameElement.style.opacity = "1"
          }
        }, { capture: true })
        
        this._parent?.addEventListener("blur", () => {
          if (this._nameElement) {
            this._nameElement.style.opacity = "0"
          }
        }, { capture: true })
      }
    }
  }

  disconnectedCallback(): void {
    this._initialized = false
    this._resizeObserver?.disconnect()
    this._resizeObserver = null

    this._parent?.removeEventListener("mouseenter", this._boundAppear)
    this._parent?.removeEventListener("mouseleave", this._boundDisappear)

    if (!this.noFocus) {
      this._parent?.removeEventListener("focus", this._boundAppear, { capture: true })
      this._parent?.removeEventListener("blur", this._boundDisappear, { capture: true })
    }

    if (this.animation) {
      cancelAnimationFrame(this.animation)
      this.animation = null
    }

    this._parent = null
  }

  attributeChangedCallback(name: string, newValue: string): void {
    if (name === 'data-name' && this._nameElement) {
      this._nameElement.textContent = newValue || ''
    }
    
    if (name === 'data-name-color' && this._nameElement) {
      this._nameElement.style.color = newValue || '#ffffff'
    }
  }
  
  static get observedAttributes(): string[] {
    return ['data-name', 'data-name-color']
  }

  handleResize(): void {
    if (!this.ctx || !this._initialized) return

    const rect = this.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)

    const dpr = window.devicePixelRatio || 1
    this.canvas.width = width * dpr
    this.canvas.height = height * dpr
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(dpr, dpr)

    this.createPixels()
  }

  private getDistance(x: number, y: number, isIcon: boolean): number {
    if (isIcon) {
      // Расстояние до центра
      const dx = x - this.canvas.width / 2
      const dy = y - this.canvas.height / 2
      return Math.sqrt(dx * dx + dy * dy)
    } else {
      // Расстояние до нижнего левого угла
      const dx = x
      const dy = this.canvas.height - y
      return Math.sqrt(dx * dx + dy * dy)
    }
  }

  createPixels(): void {
    if (!this.ctx) return
    this.pixels = []

    const isIcon = this.variant === "icon"
    const { width, height } = this.canvas
    const gap = this.gap
    const colors = this.colors
    const colorsLength = colors.length
    
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const color = colors[Math.floor(Math.random() * colorsLength)]
        const delay = this.reducedMotion ? 0 : this.getDistance(x, y, isIcon)

        this.pixels.push(
          new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
        )
      }
    }
  }

  handleAnimation(name: "appear" | "disappear"): void {
    if (this.animation) {
      cancelAnimationFrame(this.animation)
    }

    const animate = (): void => {
      this.animation = requestAnimationFrame(animate)

      const timeNow = performance.now()
      const timePassed = timeNow - this.timePrevious

      if (timePassed < this.timeInterval) return

      this.timePrevious = timeNow - (timePassed % this.timeInterval)

      if (!this.ctx) return
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      let allIdle = true
      for (const pixel of this.pixels) {
        pixel[name]()
        if (!pixel.idle) allIdle = false
      }

      if (allIdle) {
        cancelAnimationFrame(this.animation!)
        this.animation = null
      }
    }

    animate()
  }
}

// Типы для React-компонента
interface PixelCanvasAttributes {
  'data-gap'?: number;
  'data-speed'?: number;
  'data-colors'?: string;
  'data-variant'?: string;
  'data-no-focus'?: string;
  'data-name'?: string;
  'data-name-color'?: string;
}

// Fix for custom element TypeScript definition
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pixel-canvas': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & PixelCanvasAttributes, 
        HTMLElement
      >;
    }
  }
}

export interface PixelCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number
  speed?: number
  colors?: string[]
  variant?: "default" | "icon"
  noFocus?: boolean
  name?: string
  nameColor?: string
}

// React-компонент
const PixelCanvasComponent = 
  ({ gap, speed, colors, variant, noFocus, name, nameColor, style, ...props }: PixelCanvasProps, ref: React.Ref<HTMLDivElement>) => {
    React.useEffect(() => {
      if (typeof window !== "undefined" && !customElements.get("pixel-canvas")) {
        customElements.define("pixel-canvas", PixelCanvasElement)
      }
    }, [])

    // Need to use createElement to avoid TypeScript errors with custom elements
    return React.createElement("pixel-canvas", {
      ref,
      "data-gap": gap,
      "data-speed": speed,
      "data-colors": colors?.join(","),
      "data-variant": variant,
      "data-name": name,
      "data-name-color": nameColor,
      ...(noFocus && { "data-no-focus": "" }),
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        ...style
      },
      ...props
    })
  }

export const PixelCanvas = React.forwardRef<HTMLDivElement, PixelCanvasProps>(PixelCanvasComponent)

PixelCanvas.displayName = "PixelCanvas"