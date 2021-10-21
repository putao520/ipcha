const DnsService = require("./DnsService.js");


(async function(){
    const dns = new DnsService("qq.com");
    await dns.getDomains((domain)=>{
        console.log(domain);
    });
})().catch(err=>{
    console.log(err);
});


