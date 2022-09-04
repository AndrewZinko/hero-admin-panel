import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useSelector, useDispatch } from "react-redux";
import { activeFilterChange, fetchHeroesFilters, selectAll } from "./filterSlice";

const HeroesFilters = () => {
    const [classNames, setClassNames] = useState('btn btn-outline-dark');
    const {request} = useHttp();
    const dispatch = useDispatch();
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = useSelector(selectAll);
    const elements = {
        all: {
            label: "All",
            classNames: "btn btn-outline-dark"
        },
        fire: {
            label: "Fire",
            classNames: "btn btn-danger"
        },
        water: {
            label: "Water",
            classNames: "btn btn-primary"
        },
        wind: {
            label: "Wind",
            classNames: "btn btn-success"
        },
        earth: {
            label: "Earth",
            classNames: "btn btn-secondary"
        }
    };

    useEffect(() => {
        dispatch(fetchHeroesFilters());
    }, []);

    const onChangeFilter = (classNames, filterName) => {
        setClassNames(classNames);
        dispatch(activeFilterChange(filterName));
    }

    const renderFilterOptions = (filters) => {
        if (filtersLoadingStatus === 'loading') {
            return;
        } else if (filters.length < 1 || filtersLoadingStatus === 'error') {
            return <h4>No filters available</h4>;
        }

        return filters[0].map((item, index) => {
            let clazz = '';

            if (elements[item].classNames.indexOf(classNames) > -1) {
                clazz = elements[item].classNames + ' active';
            } else {
                clazz = elements[item].classNames;
            }

            return <button 
                        key={index} 
                        className={clazz}
                        onClick={() => onChangeFilter(clazz, item)}>
                            {elements[item].label}
                        </button>
        });
    }
    
    const renderedFilters = renderFilterOptions(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filter heroes by elements</p>
                <div className="btn-group">
                    {renderedFilters}
                </div>
            </div>
        </div>
    );
}

export default HeroesFilters;