import { FaCode } from 'react-icons/fa6';

const PROJECTS = [
	{

	}
]
export const ProjectsSection = () => {
    return (
        <section>
            <div className='flex items-center text-2xl text-white'>
                <FaCode />
                <h3 className='ml-2'>Proyectos</h3>
            </div>
			<div className="flex flex-col w-full">
				<div className="flex flex-row">
					<img src="" alt="" srcset="" />
					<div className="flex flex-col">
						<h4>Nombre del proyeco</h4>
						<div className="">
							Tecnologias iconos
						</div>
						<p>
							Descripcion del proyecto
						</p>
						<div>
							Links a los repo y las preview correspondientes
						</div>
					</div>
				</div>
			</div>
        </section>
    );
};
