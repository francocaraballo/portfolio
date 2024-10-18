import { ProjectItem } from './ProjectItem';

import { FaCode } from 'react-icons/fa6';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';

import MiloSportImg from '../../assets/img-projects/milo-sport-screen.png';

// const TAGS = {
//     NEXT: {
//         name: 'Next.js',
//         class: 'bg-black text-white',
//         icon: NextJSIcon,
//     },
//     TAILWIND: {
//         name: 'Tailwind CSS',
//         class: 'bg-[#003159] text-white',
//         icon: TailwindIcon,
//     },
//     REACT: {
//         name: 'React',
//         class: 'bg-[#00d8ff] text-white',
//         icon: ReactIcon,
//     },
//     JS: {
//         name: 'JavaScript',
//         class: 'bg-[#f7df1e] text-black',
//         icon: JavaScriptIcon,
//     },
//     CSS: {
//         name: 'CSS',
//         class: 'bg-[#2965f1] text-white',
//         icon: CSSIcon,
//     },
//     SASS: {
//         name: 'Sass',
//         class: 'bg-[#cc6699] text-white',
//         icon: SassIcon,
//     },
//     HTML: {
//         name: 'HTML',
//         class: 'bg-[#ff5733] text-white',
//         icon: HTMLIcon,

//     }
// };

// const PROJECTS = [
//     {
//         title: 'SNEAKERS SET - Tienda virtual',
//         description: 'Aplicación web interactiva creada como parte del curso de JavaScript en Coderhouse. Permite a los usuarios interactuar con una interfaz dinámica que responde a las entradas del usuario. El objetivo del proyecto es demostrar habilidades clave como la manipulación del DOM y el uso de eventos.',
//         img: MiloSportImg,
//         tag: [TAGS.JS, TAGS.CSS, TAGS.HTML]
//     }
// ];

export const ProjectsSection = () => {
    return (
        <section className='text-white'>
            <div className='flex items-center text-2xl text-white mb-8'>
                <FaCode />
                <h3 className='ml-2'>Proyectos</h3>
            </div>
            <div className='flex flex-col lg:flex-row lg:justify-between w-full overflow-hidden'>
                <div className='w-96 h-64 '>
                    <img
                        src={MiloSportImg}
                        alt='MiloSport Tienda Virtual'
                        className='object-cover w-full h-full rounded '
                    />
                </div>
                <div className='flex flex-col w-1/2'>
                    <h4 className='text-2xl mb-2'>Nombre del proyecto</h4>
                    <div className='mb-4'>Tecnologias iconos</div>
                    <p className='text-sm whitespacing-normal mb-6'>
                        Aplicación web interactiva creada como parte del curso
                        de JavaScript en Coderhouse. Permite a los usuarios
                        interactuar con una interfaz dinámica que responde a las
                        entradas del usuario. El objetivo del proyecto es
                        demostrar habilidades clave como la manipulación del DOM
                        y el uso de eventos.
                    </p>
                    <div className='flex justify-start items-center gap-x-4 px-4 text-lg'>
                        <a href='#'>
                            <button className='flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-800 rounded'>
                                <FiGithub />
                                <span>Code</span>
                            </button>
                        </a>
                        <a href='#'>
                            <button className='flex items-center gap-2 px-3 py-2 bg-slate-700 rounded'>
                                <FaExternalLinkAlt />
                                <span>Preview</span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
