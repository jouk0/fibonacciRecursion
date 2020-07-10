let fs = require('fs');
let fibonacci = {
    data: [],
    round: 0,
    readFibData: function() {
        let path = './fibonacci.json';
        let data = JSON.parse(fs.readFileSync(path, 'utf-8'));
        return data;
    },
    saveFibData: function(object) {
        let data = this.readFibData();
        let found = false;
        data.forEach((elem, ind) => {
            if(elem.order === object.order) {
                found = true;
            }
        });
        if(!found) {
            data.push(object);
            fs.writeFileSync(path, JSON.stringify(data, (key, value) =>
                typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
            ));
        }
    },
    fibonacciPointFunction: function(good, point) {
        if(point === 1 || point === 2) {
            good(1);
        } else {
            let fibData = this.readFibData();
            let pointOne = 0;
            let pointTwo = 0;
            fibData.forEach((elem, ind) => {
                if(elem.order === (point-1)) {
                    pointOne = BigInt(elem.fibNumber);
                }
                if(elem.order === (point-2)) {
                    pointTwo = BigInt(elem.fibNumber);
                }
            });
            if(!pointOne) {
                this.fibonacciRecurcion(point-1).then((response) => {
                    let data = {
                        order: point-1,
                        fibNumber: BigInt(response),
                        prime: undefined
                    };
                    this.saveFibData(data);
                    if(!pointTwo) {
                        this.fibonacciRecurcion(point-2).then((response2) => {
                            let data = {
                                order: point-2,
                                fibNumber: BigInt(response2),
                                prime: undefined
                            };
                            this.saveFibData(data);
                            good(BigInt(response) + BigInt(response2));
                        });
                    } else {
                        good(BigInt(response) + BigInt(pointTwo));
                    }
                });
            } else {
                if(!pointTwo) {
                    this.fibonacciRecurcion(point-2).then((response2) => {
                        let data = {
                            order: point-2,
                            fibNumber: BigInt(response2),
                            prime: undefined
                        };
                        this.saveFibData(data);
                        good(BigInt(pointOne) + BigInt(response2));
                    });
                } else {
                    good(BigInt(pointOne) + BigInt(pointTwo));
                }
            }
        }
    },
    fibonacciRecurcion: function(point) {
        if(this.round > 1000) {
            return new Promise((good) => {
                setTimeout(() => {
                    this.round = 0;
                    this.fibonacciPointFunction(good, point);
                }, 1);
            });
        } else {
            return new Promise((good) => {
                this.round++;
                this.fibonacciPointFunction(good, point);
            });
        }
    },
    init: function(fibonacciAt) {
        this.fibonacciRecurcion(fibonacciAt).then((response) => {
            console.log("Fibonacci at "+fibonacciAt+": ", response);
        });
    }
};
