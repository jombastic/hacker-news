import styled from 'styled-components';

export const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;

    svg {
      path {
        fill: #ffffff;
        stroke: #ffffff;
      }
    }
  }

  & + & {
    margin-left: 5px;
  }
`;

export const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

export const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

export const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;

  span {
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: ${(props: any) => props.width};

    a {
      color: inherit;
    }
  }
`;

export const CaretHolder = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  vertical-align: middle;
`