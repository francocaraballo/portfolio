import { ProjectItem } from './ProjectItem';

import { FaCode } from 'react-icons/fa6';
import { SiNextdotjs as NextJSIcon } from 'react-icons/si';
import { RiTailwindCssFill as TailwindIcon } from 'react-icons/ri';
import {
    FaReact as ReactIcon,
    FaJsSquare as JavaScriptIcon,
    FaCss3Alt as CSSIcon,
    FaHtml5 as HTMLIcon,
    FaSass as SassIcon,
} from 'react-icons/fa';
import { IoLogoFirebase as FirebaseIcon } from "react-icons/io5";


import SneakersSet from '../../assets/img-projects/sneakers-set.png';
import MiloSport from '../../assets/img-projects/milo-sport.png'

const TAGS = {
    NEXT: {
        name: 'Next.js',
        class: 'bg-black text-white',
        icon: NextJSIcon,
    },
    TAILWIND: {
        name: 'Tailwind CSS',
        class: 'bg-[#003159] text-white',
        icon: TailwindIcon,
    },
    REACT: {
        name: 'React',
        class: 'bg-[#00d8ff] text-black',
        icon: ReactIcon,
    },
    JS: {
        name: 'JavaScript',
        class: 'bg-[#f7df1e] text-black',
        icon: JavaScriptIcon,
    },
    CSS: {
        name: 'CSS',
        class: 'bg-[#2965f1] text-white',
        icon: CSSIcon,
    },
    SASS: {
        name: 'Sass',
        class: 'bg-[#cc6699] text-white',
        icon: SassIcon,
    },
    HTML: {
        name: 'HTML',
        class: 'bg-[#ff5733] text-white',
        icon: HTMLIcon,
    },
    FIREBASE: {
        name: 'Firebase',
        class: 'bg-[#f6820d] text-white',
        icon: FirebaseIcon,
    },
};

const PROJECTS = [
    {
        title: 'Milo Sport',
        description:
            'E-commerce destinado a un emprendimiento de ropa deportiva, se implementaron las herramientas de Firebase, como Hosting y Firestore para almacenar los productos',
        img: MiloSport,
        tags: [TAGS.REACT, TAGS.TAILWIND, TAGS.FIREBASE],
        gitLink: 'https://github.com/francocaraballo/js-coder-3',
        previewLink: 'https://francocaraballo.github.io/js-coder-3/',
    },
    {
        title: 'SNEAKERS SET - Tienda virtual',
        description:
            'Aplicación web interactiva creada como parte del curso de JavaScript en Coderhouse. Permite a los usuarios interactuar con una interfaz dinámica que responde a las entradas del usuario. El objetivo del proyecto es demostrar habilidades clave como la manipulación del DOM y el uso de eventos.',
        img: SneakersSet,
        tags: [TAGS.JS, TAGS.CSS, TAGS.HTML],
        gitLink: 'https://github.com/francocaraballo/js-coder-3',
        previewLink: 'https://francocaraballo.github.io/js-coder-3/',
    },
];

export const ProjectsSection = () => {
    return (
        <section id='projects' className='text-white scroll-mt-12' >
            <div className='flex items-center text-2xl text-white mb-8'>
                <FaCode />
                <h3 className='ml-2'>Proyectos</h3>
            </div>
            <div className='flex flex-col gap-y-12'>
                {PROJECTS.map((project) => (
                    <ProjectItem {...project} key={project.title} />
                ))}
            </div>
        </section>
    );
};
