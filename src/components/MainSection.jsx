import { FiGithub } from 'react-icons/fi';
import { FaLinkedinIn } from 'react-icons/fa6';

import HeroImg from '../assets/img-hero.png';

export const MainSection = () => {
    return (
        <div className='flex flex-row justify-around items-center gap-12 h-screen w-full' id='home'>
            <div className='text-white my-auto'>
                {/* texto */}
                <h1 className='text-4xl mb-1'>Hola! soy Franco</h1>
                <h3 className='text-lg text-gray-200'>
                    Desarrollador web Front End
                </h3>
                <p className='text-sm text-gray-200'>
                    Apasionado por la tecnologia
                </p>
                <div className='flex items-center text-black gap-1 mt-4'>
                    <a href='https://github.com/francocaraballo'>
                        <button className='bg-[#C0D0EF] rounded p-2 text-2xl'>
                            <FiGithub />
                        </button>
                    </a>
                    <a href='https://www.linkedin.com/in/francocaraballo/'>
                        <button className='bg-[#C0D0EF] rounded p-2 text-2xl'>
                            <FaLinkedinIn />
                        </button>
                    </a>
                    <a href='mailto:franconcaraballo@gmail.com'>
                        <button className='bg-[#C0D0EF] rounded p-2 text-md'>
                            Contactame
                        </button>
                    </a>
                </div>
            </div>
            <div>
                <img
                    src={HeroImg}
                    alt='Avatar'
                    className='w-48 lg:w-80 rounded'
                />
            </div>
        </div>
    );
};
