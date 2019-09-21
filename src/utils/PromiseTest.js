export default {
    methods: {
        changePointPromise(item) {
            // console.log('111')
            return new Promise(resolve => {
              setTimeout(() => {
                item.lon = '00' + item.lon
                item.lat = '00' + item.lat
                console.log('item=', item)
                resolve(item)
              }, 1000)
            //   console.log('222')
            })
        }, 
        initPromiseData() {
            console.log('initPromiseData---')
            let test1 = []
            let test2 = [] 
            let len = 10
            for (let i = 0; i < len; i++) {
            let temp = {
                id: i,
                name: '测试' + i,
                lon: 3465,
                lat: 1231
            }
            let promose = this.changePointPromise(temp)
            promose.then(ret => {
                let data = ret
                test1.push(data)
                if (i == len - 1) {
                test2 = test2.concat(test1)
                console.log('test2=', test2)
                }
            })
            }
        }
    }
} 