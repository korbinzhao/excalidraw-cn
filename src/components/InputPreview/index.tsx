import React, { useState, useRef, useEffect } from "react";
import { Input, InputProps, InputRef } from "antd";

function InputPreview(props: InputProps & { onSave?: (value: any) => void }) {
  const { defaultValue, onChange, onSave, ...extraProps } = props || {};

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  if (isEditable) {
    return (
      <Input
        ref={inputRef}
        style={{ minWidth: 200 }}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
          onChange?.(e);
        }}
        onBlur={() => {
          setIsEditable(false);
          onSave?.(value);
        }}
        defaultValue={defaultValue}
        {...extraProps}
      />
    );
  }
  return (
    <span
      title={`画布名称: ${value || defaultValue}`}
      style={{ cursor: "pointer", whiteSpace: "nowrap", color: "#999" }}
      onClick={() => {
        setIsEditable(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }}
    >
      {value}
    </span>
  );
}

export default InputPreview;
