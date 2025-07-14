import { Spinner } from "../../components/ui/spinner"
export default function Home() {
	return (
		<div className="container mx-auto py-18 sx:px-3 sx:px-3 sm:px-6 lg:px-8">
			<div className="flex flex-col items-center justify-center h-screen">
				<Spinner />
				<p>Page in development...</p>
			</div>
		</div>
	)
}
