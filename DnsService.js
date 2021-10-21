const axios = require('axios').default;
const { Resolver } = require('dns').promises;
const dns = new Resolver();
const jsdom = require("jsdom");
const { JSDOM, VirtualConsole } = jsdom;
const virtualConsole = new VirtualConsole();

function wait(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};

class DnsService{
    #url;
    constructor(url) {
        this.#url = url;
    }

    async ip138_Domains(ip, fn){
        const webPage = await axios.get(`https://site.ip138.com/${ip}/`, {
            headers:{
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50"
            }
        });
        // console.log(webPage.data);
        const options = {
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50",
            runScripts: "dangerously",
            // runScripts: "outside-only",
            virtualConsole
        };
        virtualConsole.sendTo(console);
        const dom = new JSDOM(webPage.data, options);
        // const dom = await JSDOM.fromURL(`https://site.ip138.com/${ip}/`, options);

        // console.log(dom.serialize());
        console.log(ip);
        const _TOKEN = dom.window.eval(`_TOKEN`);
        console.log(_TOKEN);
        let pageNo = 1;
        do{
            const result = await axios.get(`https://site.ip138.com/index/querybyip/?`, {
                params:{
                    ip: ip,
                    page: pageNo,
                    token: _TOKEN
                },
                headers:{
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50"
                }
            });
            if( result.status == 200 && result.data.hasOwnProperty('data') ){
                const vArr = result.data.data;
                if( vArr.length ){
                    for(const dm of vArr){
                        fn(dm);
                    }
                }
            }
            else
                break;
            pageNo++;
        }while( true );

    }

    async getDomains(fn){
        const addressArr = await dns.resolve4(this.#url);
        for(const address of addressArr){
            /*
            // 反向查找
            const domains = await dns.reverse(address);
            for(const domain of domains){
                if( fn ){
                    fn(domain);
                }
            }
            */
            await this.ip138_Domains(address, fn);
        }
    }
}

module.exports = DnsService;
