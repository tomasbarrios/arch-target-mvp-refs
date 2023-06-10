type MyComponentProps = React.PropsWithChildren<{}>;

export default function Text({children}: MyComponentProps) {
    const defaultStyles: Object = {
        whiteSpace: "pre-line"
    }
    return (<p style={defaultStyles}>
        {children}
    </p>)
}