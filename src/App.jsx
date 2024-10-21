import {
    Navbar,
    MainSection,
    AboutMeSection,
    ProjectsSection,
	Footer,
} from './components';
function App() {
    return (
		<div className="bg-slate-900">
			<div className='max-w-[900px] mx-auto'>
				<Navbar />
				<MainSection />
				<ProjectsSection />
				<AboutMeSection />
				<Footer />
			</div>
		</div>
    );
}

export default App;
