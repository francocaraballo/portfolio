import { VscAccount } from 'react-icons/vsc';

import AboutMeImg from '../assets/about-me.jpg'
export const AboutMeSection = () => {
    return (
        <section id='about-me' className='text-white min-h-screen flex flex-col justify-center scroll-mt-12' >
            <div className='flex items-center text-2xl mb-8'>
                <VscAccount />
                <h3 className='ml-2'>Sobre mi</h3>
            </div>
            <div className='flex flex-col lg:flex-row justify-evenly items-center p-4'>
                <div className='w-96'>
                    <p>
                        Me llamo Franco, soy un desarrollador front-end con
                        muchas ganas de crecer en el mundo de la tecnología.
                        Aunque todavía estoy dando mis primeros pasos en este
                        ambito, disfruto muchísimo de cada reto que me permite
                        seguir aprendiendo y mejorando. Me encanta crear
                        proyectos para implementar conceptos aprendidos, siempre
                        pensando en cómo mejorar.
                    </p>
					<br />
                    <p>
                        Me considero una persona perseverante, con una
                        mentalidad enfocada en la resolucion de problemas. Me
                        gustaria contar con la posibilidad de poner en practica,
                        todo lo aprendido, tanto habilidades blandas como
                        tecnicas.
                    </p>
                </div>
				<div className="w-52 h-64 rounded overflow-hidden">
					<img src={AboutMeImg} alt="Franco Caraballo" className='w-full h-full object-cover'/>
				</div>
            </div>
        </section>
    );
};
