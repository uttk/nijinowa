import React, { FormEvent } from "react";
import styles from "./SearchInput.module.scss";

interface SearchInputProps extends React.Props<{}> {
  maxWidth?: number;
  placeholder?: string;
  onSubmit: (inputValue: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  maxWidth,
  placeholder = "キーワードを検索"
}) => {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit((e.currentTarget.search as HTMLInputElement).value);
  };

  return (
    <form
      className={styles.search__input}
      style={{ maxWidth }}
      onSubmit={submit}
    >
      <div className="search-icon" />

      <input
        type="text"
        name="search"
        autoComplete="off"
        placeholder={placeholder}
      />
    </form>
  );
};
