interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="font-bold text-[20px] leading-[30px] md:text-[24px] md:leading-[32px] text-gray-800 ">
        {title}
      </h1>
      <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
        {description}
      </p>
    </header>
  );
}
