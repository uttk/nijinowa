import React, { useEffect, useRef, useState } from "react";

export interface ToggleWrapperChildProps {
  flag: boolean;
  trueFlag: () => void;
  falseFlag: () => void;
}

interface ToggleWrapperProps extends React.Props<{}> {
  defaultValue?: boolean;
  children: (props: ToggleWrapperChildProps) => React.ReactElement;
  onceDidMount?: (props: ToggleWrapperChildProps) => void | (() => void);
}

export const ToggleWrapper: React.FC<ToggleWrapperProps> = ({
  children,
  defaultValue = false,
  onceDidMount
}) => {
  const [flag, setFlag] = useState(defaultValue);

  const trueFlag = useRef((e?: React.MouseEvent | Event) => {
    if (e) {
      e.stopPropagation();
    }

    setFlag(true);
  }).current;

  const falseFlag = useRef((e?: React.MouseEvent | Event) => {
    if (e) {
      e.stopPropagation();
    }

    setFlag(false);
  }).current;

  useEffect(() => {
    if (onceDidMount) {
      return onceDidMount({ flag, trueFlag, falseFlag });
    }
  }, []);

  return children({ flag, trueFlag, falseFlag });
};
