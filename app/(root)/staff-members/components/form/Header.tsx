interface HeaderProps {
    title: string
    description: string
  }
  
  export function Header({ title, description }: HeaderProps) {
    return (
      <header className="flex flex-col gap-2">
        <h1 className="font-extrabold text-xl text-grey-800 ">{title}</h1>
        <p className="text-grey-800 font-normal text-base ">{description}</p>
      </header>
    )
  } 