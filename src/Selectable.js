import React from 'react';


function Selectable(image,key){

    return (
        <div style={{display:"flex"}}>
        <img src={image.url} alt={image.name} key={key}/>
        <Typography>{image.name}</Typography>
        </div>
    )

}

export default Selectable;