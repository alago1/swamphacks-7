export interface peak_hour_forecast {
  peak_delta_mean_week: number;
  peak_end: number;
  peak_intensity: number;
  peak_max: number;
  peak_start: number;
}

export interface hour_forecast {
  hour: string;
  intensity_nr: number;
  intensity_txt: string;
}

export interface venue_day_forecast {
  busy_hours: number[];
  change_hours: {
    most_people_come: number;
    most_people_leave: number;
  };
  day_info: {
    day_int: number;
    day_rank_max: number;
    day_rank_mean: number;
    day_text: string;
    venue_closed: number;
    venue_open: number;
  };
  hour_analysis: hour_forecast[];
  peak_hours: peak_hour_forecast[];
  quiet_hours: number[];
}

export interface venue_forecast {
  analysis: venue_day_forecast[];
}

export interface venue_live_forecast {
  analysis: {
    venue_forecasted_busyness: number;
    venue_live_busyness: number;
    venue_live_busyness_avaliable: boolean;
    venue_live_forecasted_delta: number;
  };
  status: string;
  venue_info: {
    venue_current_gmttime: string;
    venue_current_localtime_iso: string;
    venue_id: string;
    venue_name: string;
    venue_timezone: string;
  };
}
