import {
    Alert as ShadcnAlert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"

type AdditionalProps = {
  className?: string;
  title?: string;
  description: string;
};
type MyComponentProps = React.PropsWithChildren<AdditionalProps>;

export default function Alert(props: MyComponentProps) {
  const defaultStyles: Object = {
    // whiteSpace: "pre-line",
  };
  return (
    <ShadcnAlert>
      <AlertTitle>{props.title}</AlertTitle>
      <AlertDescription>
        {props.description}
      </AlertDescription>
    </ShadcnAlert>
  );
}
