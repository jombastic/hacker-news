import * as React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;

type InputWithLabelProps = {
    id: string;
    children: React.ReactNode;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?: boolean;
}

const InputWithLabel = ({ id, children, value, type = "text", onInputChange, isFocused }: InputWithLabelProps) => {
    // A
    const inputRef = React.useRef < HTMLInputElement > (null!); // null! means read-only because we only execute the focus method on it (read); 

    // C
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            // D
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <StyledLabel htmlFor={id}>{children}</StyledLabel>
            &nbsp;
            {/* B */}
            <StyledInput type={type} id={id} value={value} onChange={onInputChange} ref={inputRef} />
        </>
    );
}

export { InputWithLabel };