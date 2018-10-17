new Vue({

    el: "#app",

    data: {
        clockDisplay: ''
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
        }
    }
});
