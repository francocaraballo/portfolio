import {
    Navbar,
    MainSection,
    AboutMeSection,
    ProjectsSection,
} from './components';
function App() {
    return (
		<div className="bg-slate-900">
			<div className='max-w-[800px] mx-auto'>
				<Navbar />
				<MainSection />
				<AboutMeSection />
				<ProjectsSection />
			</div>
		</div>
    );
}

export default App;
