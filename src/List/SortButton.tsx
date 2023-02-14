import { StyledButtonLarge, CaretHolder } from '../styles';

import { ReactComponent as CaretUp } from '../shared/svg/caret-up.svg';
import { ReactComponent as CaretDown } from '../shared/svg/caret-down.svg';
import { ReactComponent as CaretUpFill } from '../shared/svg/caret-up-fill.svg';
import { ReactComponent as CaretDownFill } from '../shared/svg/caret-down-fill.svg';

import { Sort, SORTS } from '.';

interface SortProps {
    title: string;
    sortType: string;
    sort: Sort;
    handleSort: (sortKey: keyof SORTS) => void
}

const SortButton = ({ title, sortType, sort, handleSort }: SortProps) => {
    return (
        <span>
            <StyledButtonLarge type="button" onClick={() => handleSort(sortType)}>
                {title}
                &nbsp;
                <CaretHolder>
                    {sort.sortKey === sortType && !sort.isReverse ? (<CaretUpFill />) : (<CaretUp />)}
                    {sort.sortKey === sortType && sort.isReverse ? (<CaretDownFill />) : (<CaretDown />)}
                </CaretHolder>
            </StyledButtonLarge>
        </span>
    );
}

export default SortButton;