import Href from "@/components/ui/href"

export default function Home() {
	return (
		<div className="container mx-auto py-18 sx:px-3 sx:px-3 sm:px-6 lg:px-8">
			<div className="flex justify-center flex-col gap-2 items-center my-10">
				<h1 className="text-5xl font-bold my-8">About me</h1>
				<article className="text-md max-w-2xl leading-8 text-justify flex flex-col gap-6">
					<p>
						I was born in
						<Href
							href="https://pt.wikipedia.org/wiki/Mogi_Gua%C3%A7u"
							space>
							Mogi Guaçu, São Paulo.
						</Href>
						Since I was very young, I&apos;ve always been fascinated
						by technology, especially the internet. As the years
						went by, this passion only grew stronger, and it became
						clear that I would pursue a career in a tech-related
						field.
					</p>
					<p>
						I started a technical high school course called Software
						Development, where I had my first real experience with
						coding and building projects on my own. That was when I
						realized that what truly excites me is creating things,
						bringing ideas from my mind into the real world, whether
						through programming or other creative processes.
					</p>
					<p>
						Web technologies were my first gateway: HTML, CSS, and
						JavaScript helped me understand the fundamentals of
						logic and algorithms. From there, I decided to fully
						dive into the web development world.
					</p>
					<p>
						Over the years, I&apos;ve had the opportunity to work
						with HTML, CSS, JavaScript, TypeScript, React, Node.js,
						Express, and other technologies. I&apos;ve also explored
						other areas of software development, such as mobile
						applications and backend development.
					</p>
					<p>
						So I decided to pursue a degree in Analysis and Systems
						Development in
						<Href href="https://fatecmm.cps.sp.gov.br/">
							Fatec Artur de Azevedo,
						</Href>
						where I could expand my knowledge and gain a deeper
						understanding of software development, algorithms,
						software architecture, software engineering, and other
						essential topics in the field. Such as design patterns,
						testing methodologies, and requirements engineering.
					</p>
					<p>
						On my second semester of college, I had the opportunity
						to work as an internship at client support at
						<Href href="https://www.agrocrm.com.br/">AgroCRM,</Href>
						where I could apply my knowledge in real-world scenarios
						and gain valuable experience in the field. After 6
						months, I transitioned to a back-end development role
						using
						<Href href="https://www.genexus.com/">GeneXus</Href>
						and other technologies, such as SQL, and RESTful APIs.
					</p>
					<p>
						From there, I had the opportunity to code in a
						professional environment, working on real projects and
						learning from experienced developers. I was able to
						apply my knowledge in practical situations, collaborate
						with other professionals, and gain valuable experience
						in the field. It allowed me to apply my knowledge in
						real-world scenarios and learn from experienced
						professionals.
					</p>
					<p>
						And the rest is history! I continued to work in the
						software development field, gaining experience in
						various technologies and frameworks, and honing my
						skills as a developer. I had the opportunity to work on
						projects that challenged me and allowed me to grow as a
						professional. I also had the chance to collaborate with
						other developers, learn from them, and share my own
						knowledge and experiences.
					</p>
					<p>
						Today, I dedicate my time and energy to continuously
						improving my skills in modern technologies, frameworks,
						and platforms demanded by the industry. I love creating
						personal projects and collaborating with other
						developers who share the same passion for technology and
						innovation.
					</p>
				</article>
			</div>
		</div>
	)
}
