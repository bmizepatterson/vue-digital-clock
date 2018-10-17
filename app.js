Vue.component('flash-overlay', {
    template: `
        <div v-if="this.flash">
            <div class="overlay top bg-warning"></div>
            <div class="overlay bottom bg-warning"></div>
        </div>
    `,

    data: function() {
        return {
            flash: false,
            interval: null
        }
    },

    created: function() {
        let self = this;

        self.$parent.$on('trigger-alarm', function() {

            self.flash = true;

            self.interval = setInterval(self.toggleFlash, 200);

        });

        self.$parent.$on('deactivate-alarm', function() {

            clearInterval(self.interval);
            self.flash = false;

        });
    },

    methods: {
        toggleFlash: function() {
            this.flash = !this.flash;
        }
    }
});

new Vue({

    el: "#app",

    data: {
        clockDisplay: '',
        alarms: [],
        triggered: false,
        newAlarm: {
            hour: '',
            minute: '',
            second: '',
            error: ''
        }
    },

    created: function() {
        let self = this;

        self.clockDisplay = self.setTime()

        setInterval(function() {
            self.clockDisplay = self.setTime();
        }, 500);

        self.$on('trigger-alarm', function() {
            self.triggered = true;
        });

        self.$on('deactivate-alarm', function() {
            self.triggered = false;
        })

        let savedAlarms = localStorage.getItem('alarms').split(',');
        if (savedAlarms.length) {
            self.alarms = savedAlarms;
        }
    },

    methods: {

        setTime: function() {

            let now = new Date();

            let hours = this.addZero(now.getHours());

            let minutes = this.addZero(now.getMinutes());

            let seconds = this.addZero(now.getSeconds());

            let timeString = hours + ':' + minutes + ':' + seconds;

            // Trigger an alarm only if no other has been triggered.
            if (!this.triggered) {
                for (let alarm of this.alarms) {
                    if (timeString == alarm) {
                        this.$emit('trigger-alarm');
                        break;
                    }
                }
            }

            return timeString;
        },

        addZero: function(num) {
            return num < 10 ? '0' + num : num;
        },

        deactivateAlarm: function() {
            this.$emit('deactivate-alarm');
        },

        addAlarm: function() {
            let hour = parseInt(this.newAlarm.hour);
            let minute = parseInt(this.newAlarm.minute);
            let second = parseInt(this.newAlarm.second);

            // Validate input
            if (hour < 0 || hour > 23) {
                this.newAlarm.error = 'You entered an invalid hour. Please try again.';
            }
            if (minute < 0 || minute > 59) {
                this.newAlarm.error = 'You entered an invalid minute. Please try again.';
            }
            if (second < 0 || second > 59) {
                this.newAlarm.error = 'You entered an invalid second. Please try again.';
            }

            if (this.newAlarm.error) {
                this.newAlarm.hour = this.newAlarm.minute = this.newAlarm.second = '';
            } else {
                // Save this alarm
                let timeString = this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
                this.alarms.push(timeString);
                localStorage.setItem('alarms', this.alarms);
            }
        },

        removeAlarm: function(alarm) {
            this.alarms.splice(alarm, 1);
        }
    }
});
