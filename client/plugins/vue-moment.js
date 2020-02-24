import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

moment.updateLocale('en', {
  relativeTime : {
    future: "in %s",
    past:   "%s ago",
    s  : 'now',
    ss : '%ds',
    m:  "1m",
    mm: "%dm",
    h:  "1h",
    hh: "%dh",
    d:  "1d",
    dd: "%dd",
    M:  "1m",
    MM: "%dm",
    y:  "1y",
    yy: "%dy"
  }
});

Vue.use(VueMoment, { moment })
