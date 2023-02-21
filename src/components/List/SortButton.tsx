import { StyledButtonLarge, CaretHolder } from '../../resources/css/styles';

import { ReactComponent as CaretUp } from '../../resources/svg/caret-up.svg';
import { ReactComponent as CaretDown } from '../../resources/svg/caret-down.svg';
import { ReactComponent as CaretUpFill } from '../../resources/svg/caret-up-fill.svg';
import { ReactComponent as CaretDownFill } from '../../resources/svg/caret-down-fill.svg';

import { Sort, SORTS } from '.';

interface SortProps {
    title: string;
    sortType: string;
    sort: Sort;
    handleSort: (sortKey: keyof SORTS) => void
}

const SortButton = ({ title, sortType, sort, handleSort }: SortProps) => {
    return (
        <StyledButtonLarge type="button" onClick={() => handleSort(sortType)}>
            {title}
            &nbsp;
            <CaretHolder>
                {sort.sortKey === sortType && !sort.isReverse ? (<CaretUpFill />) : (<CaretUp />)}
                {sort.sortKey === sortType && sort.isReverse ? (<CaretDownFill />) : (<CaretDown />)}
            </CaretHolder>
        </StyledButtonLarge>
    );
}

export default SortButton;