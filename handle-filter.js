const handleFilter = {
    methods: {
        handleFilter(filter_attributes){
            let filter_query=[]
            let datatime
            Object.keys(filter_attributes).map(function(key){
                if(filter_attributes[key]=='_all'){
                    return;
                }
                if(key.indexOf("date")>-1 || key.indexOf("time")>-1 || ((filter_attributes[key][0].length==24 || filter_attributes[key][0].length==40) && filter_attributes[key][0].indexOf("->")>-1) || filter_attributes[key][0].length==10 && new Date(filter_attributes[key][0])!='Invalid Date'){
                    if(filter_attributes[key][0].indexOf("->")>-1){   
                        let filter_attributes_temp = []
                        filter_attributes_temp[key]=filter_attributes[key][0].split(" -> ");
                        filter_query.push('(moment(item.'+key+').unix()>=moment("'+filter_attributes_temp[key][0]+'").unix() && moment(item.'+key+').unix()<=moment("'+filter_attributes_temp[key][1]+'").unix())')
                    }
                    else if(filter_attributes[key][0].length==10 && new Date(filter_attributes[key][0])!='Invalid Date'){
                        datatime='((0<= moment(item.'+key+').unix() - moment("'+filter_attributes[key][0]+'").unix() && moment(item.'+key+').unix()-moment("'+filter_attributes[key][0]+'").unix()<=86399 )'
                        for (let i = 1; i < filter_attributes[key].length; i++) {
                            datatime=datatime +'|| (0<=moment(item.'+key+').unix()-moment("'+filter_attributes[key][i]+'").unix() && moment(item.'+key+').unix()-moment("'+filter_attributes[key][i]+'").unix()<=86399 )'
                            
                        }
                        datatime=datatime +')';
                        filter_query.push(datatime);
                    }
                    else {
                        filter_query.push('(item.'+key+'=="'+filter_attributes[key].join('" || '+'item.'+key+'=="')+'")')
                    }
                }else{
                    filter_query.push('(item.'+key+'=="'+filter_attributes[key].join('" || '+'item.'+key+'=="')+'")')
                }
            })
            return filter_query
        },
    }
  }