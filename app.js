Vue.component('flash-overlay', {
    template: `
        <div>
            <div v-if="this.flash" class="flash overlay top"></div>
            <div v-if="this.flash" class="flash overlay bottom"></div>
        </div>
    `,

    data: function() {
        return {
            flash: true,
            interval: null
        }
    },

    created: function() {
        let self = this;

        self.$parent.$on('trigger-alarm', function() {

            self.flash = true;

            self.interval = setInterval(self.toggleFlash, 200);

        });

        self.$parent.$on('disactivate-alarm', function() {

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
        alarms: []
    },

    created: function() {
        let self = this;

        self.clockDisplay = self.setTime()
        setInterval(function() {
            self.clockDisplay = self.setTime();
        }, 500);


    },

    methods: {

        setTime: function() {

            let now = new Date();

            let hours = this.addZero(now.getHours());

            let minutes = this.addZero(now.getMinutes());

            let seconds = this.addZero(now.getSeconds());

            return hours + ':' + minutes + ':' + seconds;
        },

        addZero: function(num) {
            if (num < 10) {
                num = '0' + num;
            }
            return num;
        },

        triggerAlarm: function() {
            this.$emit('trigger-alarm');
        },

        disactivateAlarm: function() {
            this.$emit('disactivate-alarm');
        }
    }
});
