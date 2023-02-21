import { StyledButtonLarge } from "../../resources/css/styles";

interface LastSearchesProps {
    lastSearches: string[],
    onLastSearch: (searchTerm: string) => void
}

const LastSearches = ({ lastSearches, onLastSearch }: LastSearchesProps) => {
    return (
        <>
            {lastSearches.map((searchTerm, idx) => (
                <StyledButtonLarge
                    style={{ marginBottom: '10px'}}
                    key={searchTerm + idx}
                    type="button"
                    onClick={() => onLastSearch(searchTerm)}
                >
                    {searchTerm}
                </StyledButtonLarge>
            ))}
        </>
    );
}

export default LastSearches;