import React from "react";
import { isConstTypeReference } from "typescript";
import bicycle from './assets/Icons/svg/bicycle.svg';
import building_columns from './assets/Icons/svg/building_columns.svg';
import building from './assets/Icons/svg/building.svg';
import campground from './assets/Icons/svg/campground.svg';
import dining from './assets/Icons/svg/dining.svg';
import ferris_wheel from './assets/Icons/svg/ferris_wheel.svg';
import library from './assets/Icons/svg/library.svg';
import mountains from './assets/Icons/svg/mountains.svg';
import point_of_interest from './assets/Icons/svg/point_of_interest.svg';
import shopping from './assets/Icons/svg/shopping.svg';
import tourist_attraction from './assets/Icons/svg/tourist_attraction.svg';
import { AnySrvRecord } from "dns";

export const filters_active: Record<string, boolean> = {'bicycle': true,
    'building': true,
    'building_columns': true,
    'campground': true,
    'dining': true,
    'ferris_wheel': true,
    'library': true,
    'mountains': true,
    'point_of_interest': true,
    'shopping': true,
    'tourist_attraction': true};

const Filters = (props: any) => {
    return(
        <div>
            <button onClick={() => ToggleFilter('bicycle')} id='bicycle_button' className='filter-button filter-on'><img src={bicycle} width='50' height='50'/><p>Bicycle Store</p></button>
            <button onClick={() => ToggleFilter('building')} id='building_button' className='filter-button filter-on'><img src={building} width='50' height='50'/><p>Entertainment</p></button>
            <button onClick={() => ToggleFilter('building_columns')} id='building_columns_button' className='filter-button filter-on'><img src={building_columns} width='50' height='50'/><p>Government Buildings</p></button>
            <button onClick={() => ToggleFilter('campground')} id='campground_button' className='filter-button filter-on'><img src={campground} width='50' height='50'/><p>Camping and Zoos</p></button>
            <button onClick={() => ToggleFilter('dining')} id='dining_button' className='filter-button filter-on'><img src={dining} width='50' height='50'/><p>Dining</p></button>
            <button onClick={() => ToggleFilter('ferris_wheel')} id='ferris_wheel_button' className='filter-button filter-on'><img src={ferris_wheel} width='50' height='50'/><p>Amusement</p></button>
            <button onClick={() => ToggleFilter('library')} id='library_button' className='filter-button filter-on'><img src={library}width='50' height='50' /><p>Libraries/Book Stores</p></button>
            <button onClick={() => ToggleFilter('mountains')} id='mountains_button' className='filter-button filter-on'><img src={mountains} width='50' height='50'/><p>Nature</p></button>
            <button onClick={() => ToggleFilter('point_of_interest')} id='point_of_interest_button' className='filter-button filter-on'><img src={point_of_interest} width='50' height='50'/><p>Points of Interest</p></button>
            <button onClick={() => ToggleFilter('shopping')} id='shopping_button' className='filter-button filter-on'><img src={shopping} width='50' height='50'/><p>Stores</p></button>
            <button onClick={() => ToggleFilter('tourist_attraction')} id='tourist_attraction_button' className='filter-button filter-on'><img src={tourist_attraction} width='50' height='50'/><p>Tourist Attraction</p></button>
        </div>
    );
}

const ToggleFilter = (filter_id: any) => {
    filters_active[filter_id] = !filters_active[filter_id];
    if (!filters_active[filter_id]) {
        document.getElementById(filter_id + '_button')?.classList.remove('filter-on');
        document.getElementById(filter_id + '_button')?.classList.add('filter-off');
    }
    else {
        document.getElementById(filter_id + '_button')?.classList.remove('filter-off');
        document.getElementById(filter_id + '_button')?.classList.add('filter-on');
    }
}

export default Filters;