distributionApp.factory('$utilService', function(){
    return{
        pagination : function(lengthOfData, limit){
            var paginationList = [];
            var val = lengthOfData / limit;
            var pagination = Math.floor(val);
            if((val % 1) != 0){
                pagination += 1;
            }
            for(var i=1; i<=pagination; i++){
                if(i<=10){
                    paginationList.push({
                        numb: i,
                        active: false,
                        show: true,
                    });
                }
                else{
                    paginationList.push({
                        numb: i,
                        active: false,
                        show: false
                    })
                }
            }
            return paginationList;
        },
        activePagination : function(listPagination, page){
            for(var i=0; i<listPagination.length; i++){
                if(listPagination[i].numb == page){
                    listPagination[i].active = true;
                }
                else{
                    listPagination[i].active = false;
                }
            }
            return listPagination;
        },
        displayPopUpMessage : function(titleTxt, messageTxt, priorityType){
            $.toaster({
                priority: priorityType,
                message : messageTxt,
                title : titleTxt,
                settings: {
                    'toaster': {
                        'fade' : { in : 'fast', out : 'slow' },
                        'css':
                        {
                            'position' : 'fixed',
                            'top'      : '20%',
                            'left'     : '50%',
                            'width'    : '300px',
                            'zIndex'   : 50000
                        }
                    },
                    'timeout': 4000
                }
            });
        },
        defineLockStockToBoolean : function(lock){
            if(lock == 1) return true;
            else return false;
        },
        defineLockStockToInt : function(lock){
            if(lock) return 1;
            else return 0;
        },
        defineLockStockToText : function(lock){
            if(lock) return "YA";
            else return "TIDAK";
        }
    }
})
