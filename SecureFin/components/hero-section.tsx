"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu } from 'lucide-react';
import { useAuth } from "@/components/auth-context";
import { AuthModal } from "@/components/auth-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DotGlobeHeroProps {
  rotationSpeed?: number;
  globeRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

const Globe: React.FC<{
  rotationSpeed: number;
  radius: number;
}> = ({ rotationSpeed, radius }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += rotationSpeed * 0.3;
      groupRef.current.rotation.z += rotationSpeed * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="hsl(var(--foreground))"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </group>
  );
};

const DotGlobeHero = React.forwardRef<
  HTMLDivElement,
  DotGlobeHeroProps
>(({
  rotationSpeed = 0.002,
  globeRadius = 1.5,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-screen bg-background overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          {children}
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={75} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          <Globe
            rotationSpeed={rotationSpeed}
            radius={globeRadius}
          />
        </Canvas>
      </div>
    </div>
  );
});

DotGlobeHero.displayName = "DotGlobeHero";

// Integrated Hero Section Component
const HeroSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, role, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();


  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };


  return (
    <DotGlobeHero>
      <div className="w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        {/* --- Navbar --- */}
        <div className="py-2 relative z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="#" className="font-bold text-2xl pb-1 text-foreground cursor-pointer flex-shrink-0">
              SecureFin
            </a>
            <nav className="hidden lg:flex text-muted-foreground font-medium">
              <ul className="flex items-center space-x-2">
                <li><Link href="/about" className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">About</Link></li>
                {isLoggedIn && (
                  <>
                    <li><Link href="/dashboard" className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Dashboard</Link></li>
                    {role !== 'admin' && (
                      <>
                        <li><Link href="/vitta-raksha" className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Vitt Raksha</Link></li>
                        <li><Link href="/optibudget" className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">OptiBudget</Link></li>
                      </>
                    )}
                    {role === 'admin' && (
                      <li><Link href="/realtime-guard" className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">RealtimeGuard</Link></li>
                    )}
                    <li><Link href="/wallet" className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Wallet</Link></li>
                  </>
                )}
                <li className="relative">
                  {/* <button onClick={() => toggleDropdown('desktop-resources')} className="flex items-center hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">
                    Resources<ChevronDown className={`h-4 w-4 ml-1 transition-transform ${openDropdown === 'desktop-resources' ? 'rotate-180' : ''}`} />
                  </button> */}
                  {/* {openDropdown === 'desktop-resources' && (
                    <ul className="absolute top-full left-0 mt-2 p-2 bg-card border border-border shadow-lg rounded-xl z-20 w-48">
                      <li><a href="#" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">Documentation</a></li>
                      <li><a href="#" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">API Reference</a></li>
                    </ul>
                  )} */}
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={isLoggedIn ? logout : handleLoginClick} className="text-foreground hover:bg-white/10 hover:text-cyan-400 cursor-pointer py-2 px-4 text-sm capitalize font-medium transition-all duration-300 rounded-xl border border-transparent hover:border-white/10">
                {isLoggedIn ? "Logout" : "Login"}
              </button>
              {/* <button className="bg-foreground hover:bg-muted-foreground text-background py-2.5 px-5 text-sm rounded-xl capitalize font-medium transition-colors flex items-center gap-2">
                Get Started<ArrowRight className="h-4 w-4" />
              </button> */}
            </div>
            <div className="lg:hidden relative">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-transparent hover:bg-muted border-none p-2 rounded-xl transition-colors">
                <Menu className="h-6 w-6" />
              </button>
              {isMobileMenuOpen && (
                <ul className="absolute top-full right-0 mt-2 p-2 shadow-lg bg-card border border-border rounded-xl w-56 z-30">
                  <li><Link href="/about" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">About</Link></li>
                  {isLoggedIn && (
                    <>
                      <li><Link href="/dashboard" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">Dashboard</Link></li>
                      {role !== 'admin' && (
                        <>
                          <li><Link href="/vitta-raksha" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">Vitt Raksha</Link></li>
                          <li><Link href="/optibudget" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">OptiBudget</Link></li>
                        </>
                      )}
                      {role === 'admin' && (
                        <li><Link href="/realtime-guard" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">RealtimeGuard</Link></li>
                      )}
                      <li><Link href="/wallet" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">Wallet</Link></li>
                    </>
                  )}
                  <li className="border-t border-border mt-2 pt-2 space-y-2">
                    <button onClick={isLoggedIn ? logout : handleLoginClick} className="block w-full text-center px-3 py-2 text-sm text-foreground hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-colors">
                      {isLoggedIn ? "Logout" : "Login"}
                    </button>
                    <button className="w-full bg-foreground text-background hover:bg-muted-foreground px-3 py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 font-medium">
                      Get Started<ArrowRight className="h-4 w-4" />
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* --- Hero Content --- */}
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
          <div className="max-w-4xl mx-auto backdrop-blur-sm bg-background/5 p-8 rounded-3xl border border-gray-100/10 shadow-5xl">
            <h1 className="text-1xl sm:text-6xl md:text-6xl text-foreground font-bold tracking-tight">
              Empowering You to Transact <span className="text-primary">Fearlessly.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover cutting-edge solutions designed for the modern digital landscape. Secure, scalable, and built for the future of finance.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {/* <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <input type="email" placeholder="enter@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full max-w-xs bg-muted border-border text-foreground placeholder-muted-foreground font-medium pl-10 pr-4 py-2 text-sm sm:pl-11 sm:py-3 sm:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-ring" />
              </div> */}
              {/* <button onClick={handleEmailSubmit} className="bg-foreground hover:bg-muted-foreground text-background px-5 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-full normal-case font-medium transition-colors flex items-center gap-2">
                Join Now<ArrowRight className="h-4 w-4" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </DotGlobeHero>
  );
};

export { HeroSection };
