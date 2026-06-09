import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="border w-fit border-border rounded-md overflow-hidden">
        <Image src="/pt-br.svg" alt="Fernando Jr" width={80} height={80} />
      </div>
      <div className="flex flex-col">
        <p className="text-3xl font-bold">FernaandoJr</p>
        <p className="font-base text-muted-foreground">subtitle</p>
      </div>
    </div>
  );
}
