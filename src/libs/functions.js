const functions={}


functions.setCookie=(valor)=>{
        
    var time=Date.now()+2629750000;
        
    var timeCovertDate=new Date(time)
    
    var dateCovertString=timeCovertDate.toString().substring(0,15);
    
    document.cookie = `userName=${valor}; expires=${dateCovertString} 00:00:00 UTC; path=/`
    
}
module.exports=functions