interface LastSearchesProps {
    lastSearches: string[],
    onLastSearch: (searchTerm: string) => void
}

const LastSearches = ({ lastSearches, onLastSearch }: LastSearchesProps) => {
    return (
        <>
            {lastSearches.map((searchTerm, idx) => (
                <button
                    key={searchTerm + idx}
                    type="button"
                    onClick={() => onLastSearch(searchTerm)}
                >
                    {searchTerm}
                </button>
            ))}
        </>
    );
}

export default LastSearches;