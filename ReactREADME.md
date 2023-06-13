# Types

### Children

https://stackoverflow.com/a/67377965

````
import React from "react";
import Button from "./Styles";

type MyComponentProps = React.PropsWithChildren<{}>;

export default function MyComponent({ children, ...other}: MyComponentProps) {
  return <Button {...other}>{children}</Button>;
}
```

### Cuando trate de usar classname
https://blog.logrocket.com/using-react-children-prop-with-typescript/
````
