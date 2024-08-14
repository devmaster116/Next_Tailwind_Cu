import { twMerge } from "tailwind-merge"
import { Typography } from "../typography"

type ClassOverrideProps = {
  container?: string
  title?: string
  content?: string
}

export type Props = {
  title: string
  content?: string
  classOverride?: ClassOverrideProps
  onClick?: () => void
}

export const Paragraph = (props: Props) => {
  return (
    <div 
      className={twMerge(
        'flex flex-col gap-1',
        props.classOverride?.container
      )}
    >
      <Typography 
        variant="label-large"
        className={props.classOverride?.title}  
      >
        {props.title}
      </Typography>

      {props?.content && (
        <Typography 
          onClick={props.onClick} 
          variant="label-medium" 
          className={props.classOverride?.content}  
        >
          {props.content}
        </Typography>
      )}
    </div>
  )
}