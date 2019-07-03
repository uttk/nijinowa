import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "../../atoms/Button";
import styles from "./Alerts.module.scss";

interface AlertElement {
  id: number;
  type: "success" | "warn" | "error";
  message: string;
  style: string;
  onClose: () => void;
  onHidden: () => void;
  delete?: boolean;
}

interface AlertManager {
  elements: AlertElement[];
  dispatch: (elements: AlertElement[]) => void;

  readonly createAlerts: (element: AlertElement) => void;
  readonly updateAlerts: (element: AlertElement) => void;
  readonly deleteAlerts: (id: AlertElement["id"]) => void;
  readonly hiddenAlerts: (id: AlertElement["id"]) => void;
}

const AlertsMg: AlertManager = {
  elements: [],

  dispatch: () => {},

  createAlerts: (element: AlertElement) => {
    const newElements = AlertsMg.elements.concat(element);
    AlertsMg.dispatch(newElements);
  },

  updateAlerts: (element: AlertElement) => {
    const newElements = AlertsMg.elements.map(v => {
      if (v.id === element.id) {
        return element;
      } else {
        return v;
      }
    });

    AlertsMg.dispatch(newElements);
  },

  deleteAlerts: (id: number) => {
    AlertsMg.dispatch(
      AlertsMg.elements.map(v => (v.id === id ? { ...v, delete: true } : v))
    );
  },

  hiddenAlerts: (id: number) => {
    AlertsMg.dispatch(AlertsMg.elements.filter(v => v.id !== id));
  }
};

const createId = () => {
  while (true) {
    const id = Math.floor(Math.random() * 1000);

    if (!AlertsMg.elements.find(v => v.id === id)) {
      return id;
    }
  }
};

export const createAlertElement = (
  message: string,
  type: AlertElement["type"]
): AlertElement => {
  const id = createId();

  return {
    id,
    type,
    message,
    style: `${styles.alert} ${styles[type]}`,
    onClose: () => {
      AlertsMg.deleteAlerts(id);
    },
    onHidden: () => {
      AlertsMg.hiddenAlerts(id);
    }
  };
};

export const success = (message: string) => {
  AlertsMg.createAlerts(createAlertElement(message, "success"));
};

export const warn = (message: string) => {
  AlertsMg.createAlerts(createAlertElement(message, "warn"));
};

export const error = (message: string) => {
  AlertsMg.createAlerts(createAlertElement(message, "error"));
};

interface AlertProps extends React.Props<{}> {}

export const Alert: React.FC<AlertProps> = React.memo(() => {
  const [alerts, setAlert] = useState<AlertElement[]>([]);
  const len = alerts.length;

  AlertsMg.elements = alerts;
  AlertsMg.dispatch = (elements: AlertElement[]) => {
    setAlert(elements);
  };

  return (
    <div>
      {alerts.map((alert, i) => (
        <AlertBar
          key={alert.id}
          top={(len - i) * 64}
          alert={alert}
          displayTime={5000}
        />
      ))}
    </div>
  );
});

interface AlertBarProps extends React.Props<{}> {
  top: number;
  alert: AlertElement;
  displayTime: number;
}

export const AlertBar: React.FC<AlertBarProps> = ({
  top,
  alert,
  displayTime
}) => {
  const [style, setStyle] = useState(alert.style);
  const ref = useRef<{ timeoutId?: NodeJS.Timeout }>({}).current;

  useEffect(() => {
    if (alert.delete) {
      if (ref.timeoutId) {
        clearTimeout(ref.timeoutId);
      }

      setStyle(alert.style);
      ref.timeoutId = setTimeout(alert.onHidden, 300);
    } else {
      ref.timeoutId = setTimeout(() => {
        setStyle(`${style} ${styles.alert_show}`);

        ref.timeoutId = setTimeout(() => {
          setStyle(alert.style);
          ref.timeoutId = setTimeout(alert.onHidden, 300);
        }, displayTime);
      }, 0);
    }

    return () => {
      if (ref.timeoutId) {
        clearTimeout(ref.timeoutId);
      }
    };
  }, [alert.delete]);

  return (
    <li className={style} style={{ top }}>
      <p>{alert.message}</p>
      <IconButton
        size={16}
        icon="close_white"
        color="transparent"
        className={styles.close_btn}
        onClick={alert.onClose}
      />
    </li>
  );
};
