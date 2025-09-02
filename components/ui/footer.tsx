import { Separator } from "@/components/ui/separator"

export default function Footer() {
	return (
		<footer className="mx-auto w-full bg-background md:container select-none">
			<div className="mx-auto px-4 py-16 sx:mx-3 sx:px-3 sm:px-6 lg:px-8">
				<Separator className="my-8" />
				<div className="flex flex-col items-center justify-between sm:flex-row">
					<p className="text-xs text-muted-foreground">
						{new Date().getFullYear()} FernaandoJr. Feel free to use
						this portfolio as a model!
					</p>
					<div className="mt-4 flex space-x-4 sm:mt-0">
						<p className="cursor-pointer text-xs text-muted-foreground hover:text-primary">
							Made with ❤️
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
