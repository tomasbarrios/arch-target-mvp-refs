type AdditionalProps = {
  className?: string;
};
type MyComponentProps = React.PropsWithChildren<AdditionalProps>;

export default function Text(props: MyComponentProps) {
  const defaultStyles: Object = {
    whiteSpace: "pre-line",
  };
  return (
    <p style={defaultStyles} {...props}>
      {props.children}
    </p>
  );
}
