import { useState } from "react";
import { useDispatch , useSelector} from 'react-redux';
import { heroesAddElement} from '../heroesList/heroesSlice';
import { selectAll } from "../heroesFilters/filterSlice";
import { useHttp } from "../../hooks/http.hook";
import { v4 as uuidv4 } from 'uuid';

const HeroesAddForm = () => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [element, setElement] = useState('');

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = useSelector(selectAll);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const elements = {
        fire: "Огонь",
        water: "Вода",
        wind: "Ветер",
        earth: "Земля"
    }

    const onSubmitHandler = (e, name, text, element) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name, 
            description: text, 
            element
        };    

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(() => dispatch(heroesAddElement(newHero)))
            .then(() => {
                setName('');
                setText('');
                setElement('');
            });
    }

    const renderOptions = (filters) => {
        if (filters.length < 1 || filtersLoadingStatus === 'error') {
            return <option>No items available</option>;;
        }

        return filters[0].map((item, index) => {
            if (item === 'all') return null;
            return <option key={index} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>;
        });
    }

    const options = renderOptions(filters);

    return (
        <form 
            className="border p-4 shadow-lg rounded" 
            onSubmit={(e) => onSubmitHandler(e, name, text, element)}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">The name of new hero</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What is my name?"
                    onChange={(e) => setName(e.target.value)}
                    value={name}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Ability description</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    style={{"height": '130px'}}
                    onChange={(e) => setText(e.target.value)}
                    value={text}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Select hero element</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    onChange={(e) => setElement(e.target.value)}
                    value={element}>
                    <option >I own the element...</option>
                    {options}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;