export const Navbar = () => {
    return (
        <div className='p-4 h-[8vh]'>
            <nav className="flex flex-row justify-center gap-3 mx-auto text-white text-xs transition-colors ease-linear">
                <a href='#' className="hover:text-slate-300 transition-colors ease-linear">
                    Inicio
                </a>
                <a href='#' className="hover:text-slate-300 transition-colors ease-linear">
                    Proyectos
                </a>
                <a href='#' className="hover:text-slate-300 transition-colors ease-linear">
                    Sobre mi
                </a>
                <a href='#' className="hover:text-slate-300 transition-colors ease-linear">
                    Contacto
                </a>
            </nav>
        </div>
    );
};
