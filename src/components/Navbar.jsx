import React, { useState, useEffect } from "react";

export const Navbar = () => {
    const [navbarColor, setNavbarColor] = useState("bg-slate-900");

    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 48) {
            setNavbarColor("bg-slate-800 mt-2");
          } else {
            setNavbarColor("bg-slate-900");
          }
        };

        window.addEventListener("scroll", handleScroll);

    // Cleanup event listener when component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
    
    return (
        <div className={`p-4 h-12 fixed rounded-full ${navbarColor} left-1/2 -translate-x-1/2 transition-all duration-300`}>
            <nav className="flex flex-row justify-center gap-3 mx-auto text-white text-xs transition-colors ease-linear">
                <a href='#home' className="hover:text-slate-300 transition-colors ease-linear">
                    Inicio
                </a>
                <a href='#projects' className="hover:text-slate-300 transition-colors ease-linear">
                    Proyectos
                </a>
                <a href='#about-me' className="hover:text-slate-300 transition-colors ease-linear">
                    Sobre mi
                </a>
                <a href='#' className="hover:text-slate-300 transition-colors ease-linear">
                    Contacto
                </a>
            </nav>
        </div>
    );
};
