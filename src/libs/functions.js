const functions={}

//Esta función servira para la creación de una cookie
functions.setCookie=(value)=>{
    
    
    let time=Date.now()+2629750000;
    
    let timeCovertDate=new Date(time)

    let dateCovertString=timeCovertDate.toString().substring(0,15);

    document.cookie = `userName=${value}; expires=${dateCovertString} 00:00:00 UTC; path=/`
    
}
//Función para establecer la cookie si la hubiese a la sesión
functions.establishSession = ()=>{
    if(document.cookie && !sessionStorage.getItem("userName")){
        let cookies=document.cookie;
        
        let separar=cookies.split('=')
        
        sessionStorage.setItem("userName",separar[1]);
    }
}



module.exports=functions