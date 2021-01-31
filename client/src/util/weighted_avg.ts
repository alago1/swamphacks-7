export const weighted_avg_geo_coords = (geo_coords: any) => {
    // geo_coords should be formatted: [{lat: 22.12313, lng: 41.3123, weight: 3}, {lat: 31.213, lng: 41.3123, weight: 8}, ...]

    // sums all weights
    let totalWeight = 0;
    geo_coords.array.forEach((element: any) => {
        totalWeight += element.weight;
    });

    // makes new coords object with cartesian instead of geo coords
    let cartesian_coords: any = [];
    geo_coords.array.forEach((element: any) => {
        let { x, y, z } = geo_coords_to_cartesian(element.lat, element.lng);
        cartesian_coords.push({ x: x, y: y, z: z, weight: element.weight });
    });

    // gets the weighed average of all cartesian coords
    let weighted_x_avg = 0;
    let weighted_y_avg = 0;
    let weighted_z_avg = 0;
    cartesian_coords.forEach((element: any) => {
        weighted_x_avg += element.x * element.weight;
        weighted_y_avg += element.y * element.weight;
        weighted_z_avg += element.z * element.weight;
    });
    weighted_x_avg /= totalWeight;
    weighted_y_avg /= totalWeight;
    weighted_z_avg /= totalWeight;

    // converts back to geo coords and returns
    return cartesian_to_geo_coords(weighted_x_avg, weighted_y_avg, weighted_z_avg);
}

export const deg_to_rad = (degrees: number) => {
    return degrees * 2 * Math.PI / 360;
}

export const rad_to_deg = (degrees: number) => {
    return degrees * 360 / 2 / Math.PI;
}

export const geo_coords_to_cartesian = (lat_deg: number, lng_deg: number) => {
    const lat_rad = deg_to_rad(lat_deg);
    const lng_rad = deg_to_rad(lng_deg);

    const x = Math.sin(lat_rad) * Math.cos(lng_rad);
    const y = Math.sin(lat_rad) * Math.sin(lng_rad);
    const z = Math.cos(lat_rad);

    return { x, y, z };
}

export const cartesian_to_geo_coords = (x: number, y: number, z: number) => {
    const lat = rad_to_deg(Math.atan2(z, Math.sqrt(x * x + y * y)))
    const lng = rad_to_deg(Math.atan2(-y, x));
    return { lat, lng };
}