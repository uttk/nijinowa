export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });
};

type classNameTypes = string | { [key: string]: boolean };

const visit = (classes: classNameTypes): string => {
  if (typeof classes === "string") {
    return classes;
  } else if (typeof classes === "object") {
    let result = "";

    for (const key in classes) {
      if (classes[key]) {
        result += `${key} `;
      }
    }

    return result;
  }

  return "";
};

export const classNames = (...args: classNameTypes[]): string => {
  return args.map(visit).join(" ");
};
