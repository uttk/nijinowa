import React, { useEffect, useState } from "react";
import styles from "./Form.module.scss";

interface BodyProps<SubmitType> extends React.Props<{}> {
  className?: string;
  onSubmit: SubmitType;
}

interface ResultTypeBase {
  [key: string]: string | File;
}

type GetInputName<R extends ResultTypeBase, T> = {
  [K in keyof R]: R[K] extends T ? K : never
} extends { [key: string]: infer S }
  ? S extends keyof R
    ? S
    : never
  : never;

interface FileInputProps<R extends ResultTypeBase> extends React.Props<{}> {
  label?: string;
  name: GetInputName<R, File>;
  defaultValue?: string;
  disabled?: boolean;
}

interface TextInputProps<R extends ResultTypeBase> extends React.Props<{}> {
  label?: string;
  name: GetInputName<R, string>;
  defaultValue?: string;
  disabled?: boolean;
}

interface TextAreaProps<R extends ResultTypeBase> extends React.Props<{}> {
  label: string;
  name: GetInputName<R, string>;
  cols?: number;
  rows?: number;
  defaultValue?: string;
  disabled?: boolean;
}

interface SubmitButtonProps extends React.Props<{}> {
  label: string;
  disabled?: boolean;
}

const isInputElement = (e: any): e is HTMLInputElement => {
  return !!e && typeof e.value === "string";
};

export const createForm = <ResultType extends ResultTypeBase>(
  names: Array<keyof ResultType>
) => {
  type SubmitType = (result: Partial<ResultType>) => void;
  type NameType = keyof ResultType;

  const refs: Partial<
    Record<NameType, HTMLInputElement | HTMLTextAreaElement>
  > = {};

  const submit = (onSubmit: SubmitType) => (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const result: Partial<ResultType> = {};

    for (const key in names) {
      if (names[key]) {
        const ele = form[key];
        const resultKey = names[key];

        if (isInputElement(ele)) {
          if (ele.files) {
            result[resultKey] = ele.files[0] as ResultType[keyof ResultType];
          } else {
            result[resultKey] = ele.value as ResultType[keyof ResultType];
          }
        }
      }
    }

    onSubmit(result);
  };

  return {
    refs,

    Body: ({ children, className, onSubmit }: BodyProps<SubmitType>) => (
      <form className={className} onSubmit={submit(onSubmit)}>
        {children}
      </form>
    ),

    FileInput: ({
      label,
      name,
      disabled = false
    }: FileInputProps<ResultType>) => {
      const [preview, setPreview] = useState<string>("");
      const getImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;

        if (files) {
          if (files.length === 1 && files[0].type.match("image")) {
            const reader = new FileReader();

            reader.onload = () => {
              const url = reader.result;
              if (typeof url === "string") {
                setPreview(url);
              }
            };

            reader.readAsDataURL(files[0]);
          } else if (files.length > 0) {
            alert("一つの画像ファイルのみ選択してください");
          }
        }
      };

      return (
        <div className={styles.wrapper}>
          <label className={styles.form_label}>{label}</label>

          {preview ? (
            <img
              src={preview}
              className={styles.preview_image}
              alt="upload preview"
            />
          ) : (
            <div className={styles.no_images}>No Image</div>
          )}

          <label
            htmlFor={`file-input-${name}`}
            className={
              disabled ? styles.file_input_disabled : styles.file_input
            }
          >
            画像を選択
          </label>

          <input
            ref={ref => {
              if (ref) {
                refs[name as NameType] = ref;
              }
            }}
            id={`file-input-${name}`}
            style={{ display: "none" }}
            type="file"
            name={`${name}`}
            disabled={disabled}
            onChange={getImage}
          />
        </div>
      );
    },

    TextInput: ({
      label,
      name,
      defaultValue,
      disabled = false
    }: TextInputProps<ResultType>) => (
      <div className={styles.wrapper}>
        <label className={styles.form_label} htmlFor={`text-input-${name}`}>
          {label}
        </label>
        <input
          ref={ref => {
            if (ref) {
              refs[name as NameType] = ref;
            }
          }}
          id={`text-input-${name}`}
          className={styles.text_input}
          type="text"
          name={`${name}`}
          disabled={disabled}
          defaultValue={defaultValue}
        />
      </div>
    ),

    TextArea: ({
      label,
      name,
      cols = 30,
      rows = 10,
      disabled = false,
      defaultValue
    }: TextAreaProps<ResultType>) => {
      useEffect(() => {
        const ele = refs[name as NameType];
        if (ele) {
          ele.value = defaultValue || "";
        }
      }, [defaultValue, name]);

      return (
        <div className={styles.wrapper}>
          <label className={styles.form_label} htmlFor={`textarea-${name}`}>
            {label}
          </label>
          <textarea
            ref={ref => {
              if (ref) {
                refs[name as NameType] = ref;
              }
            }}
            id={`textarea-${name}`}
            className={styles.form_textarea}
            name={`${name}`}
            cols={cols}
            rows={rows}
            disabled={disabled}
          />
        </div>
      );
    },

    SubmitButton: ({ label = "送信", disabled = false }: SubmitButtonProps) => (
      <div className={styles.wrapper}>
        <button
          className={styles.submit_button}
          type="submit"
          disabled={disabled}
        >
          {label}
        </button>
      </div>
    )
  };
};
