import type { ButtonHTMLAttributes } from "react";

type AdditionalProps = {
    // className?: string;
    confirmPrompt?: string;
    // type?: string;
  };

  type MyComponentProps = ButtonHTMLAttributes<HTMLButtonElement> & AdditionalProps;
  
  export default function Button(props: MyComponentProps) {
    const defaultStyles: Object = {
    };
    const confirmAction = (ev: React.MouseEvent<HTMLButtonElement>) => {
        if(props.confirmPrompt) {
            if(confirm(props.confirmPrompt)) {
                return ev
            } else {
                ev.preventDefault()
            }
        } else {
            return ev
        }
        
    }
    const defaultClassNames="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"

    return (
      <button onClick={confirmAction} style={defaultStyles} className={defaultClassNames} {...props}>
        {props.children}
      </button>
    );
  }
  