"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function GlobeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 2.5

    const canvas = document.createElement("canvas")
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext("2d")!

    // Draw simple Earth texture
    // Ocean blue base
    ctx.fillStyle = "#1a5f7a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add some land masses (simplified continents)
    ctx.fillStyle = "#2d7f5f"
    // North America
    ctx.beginPath()
    ctx.ellipse(200, 400, 150, 200, 0, 0, Math.PI * 2)
    ctx.fill()
    // Europe/Africa
    ctx.beginPath()
    ctx.ellipse(1000, 500, 120, 280, 0, 0, Math.PI * 2)
    ctx.fill()
    // Asia
    ctx.beginPath()
    ctx.ellipse(1300, 350, 200, 180, 0, 0, Math.PI * 2)
    ctx.fill()
    // South America
    ctx.beginPath()
    ctx.ellipse(400, 700, 100, 150, 0, 0, Math.PI * 2)
    ctx.fill()
    // Australia
    ctx.beginPath()
    ctx.ellipse(1500, 800, 80, 90, 0, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)

    // Create globe with Earth texture
    const geometry = new THREE.IcosahedronGeometry(1, 64)
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x0a2f3a,
      shininess: 10,
      wireframe: false,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Add countries visualization
    const countriesGroup = new THREE.Group()
    globe.add(countriesGroup)

    // Add some random glowing points on the globe
    const pointsGeometry = new THREE.BufferGeometry()
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.02,
      sizeAttenuation: true,
    })

    const pointPositions: number[] = []
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(-1 + (2 * i) / 200)
      const theta = Math.sqrt(200 * Math.PI) * phi
      const x = Math.cos(theta) * Math.sin(phi)
      const y = Math.sin(theta) * Math.sin(phi)
      const z = Math.cos(phi)
      pointPositions.push(x, y, z)
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pointPositions), 3))
    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    scene.add(points)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1)
    directionalLight.position.set(2, 2, 2)
    scene.add(directionalLight)

    // Glow effect with post-processing
    const glowGeometry = new THREE.IcosahedronGeometry(1.1, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.1,
      wireframe: false,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowMesh)

    // Animation
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      globe.rotation.x += 0.0001
      globe.rotation.y += 0.0003

      glowMesh.rotation.x += 0.0001
      glowMesh.rotation.y += 0.0003

      points.rotation.x += 0.00005
      points.rotation.y += 0.00015

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      containerRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      pointsGeometry.dispose()
      pointsMaterial.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full absolute inset-0" style={{ filter: "blur(0.5px)" }} />
}
