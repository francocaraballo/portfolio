import { FiGithub } from 'react-icons/fi';
import { FaExternalLinkAlt } from 'react-icons/fa'

export const ProjectItem = ({
    title,
    img,
    description,
    tags,
    gitLink,
    previewLink,
}) => {
    return (
        <article className='flex flex-col lg:flex-row lg:justify-between w-full overflow-hidden'>
            <div className='w-96 h-64 '>
                <img
                    src={img}
                    alt='MiloSport Tienda Virtual'
                    className='object-cover w-full h-full rounded '
                />
            </div>
            <div className='flex flex-col w-1/2 flex-wrap'>
                <h4 className='text-2xl mb-2'>{title}</h4>
                <div className='mb-4'>
                    <ul className='flex flex-row mb-2 gap-x-2'>
                        {tags.map((tag) => (
                            <li>
                                <span class={`flex gap-x-2 rounded-full text-xs ${tag.class} py-1 px-2 `}>
                                    <tag.icon class='size-4' />
                                    {tag.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className='text-sm whitespacing-normal mb-6'>
                    {description}
                </p>
                <div className='flex justify-start items-center gap-x-4 px-4 text-lg'>
                    <a href={gitLink} target="_blank">
                        <button className='flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-800 rounded'>
                            <FiGithub />
                            <span>Code</span>
                        </button>
                    </a>
                    <a href={previewLink} target="_blank">
                        <button className='flex items-center gap-2 px-3 py-2 bg-slate-700 rounded'>
                            <FaExternalLinkAlt />
                            <span>Preview</span>
                        </button>
                    </a>
                </div>
            </div>
        </article>
    );
};
