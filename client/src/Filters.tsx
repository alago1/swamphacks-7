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

const Filters = (props: any) => {
    return(
        <div>
            <img src={bicycle}  width='50' height='50'/>
            <img src={building}  width='50' height='50'/>
            <img src={building_columns}  width='50' height='50'/>
            <img src={campground}  width='50' height='50'/>
            <img src={dining}  width='50' height='50'/>
            <img src={ferris_wheel}  width='50' height='50'/>
            <img src={library} width='50' height='50' />
            <img src={mountains}  width='50' height='50'/>
            <img src={point_of_interest}  width='50' height='50'/>
            <img src={shopping}  width='50' height='50'/>
            <img src={tourist_attraction}  width='50' height='50'/>
        </div>
    );
}

export default Filters;