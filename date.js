
module.exports.timeDat = ()=>{
    let dg = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "short"
    }
    return dg.toLocaleDateString("en-US", options);
    
};

module.exports.timeDay = ()=>{
    let dg = new Date();
    let options = {
        weekday: "long"
    }
    return dg.toLocaleDateString("en-US", options);
}

module.exports.timeD = ()=>{
    let dg = new Date();
    let options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    }
    return dg.toLocaleDateString("en-US", options);
}